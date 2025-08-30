import { useCallback, useRef, useState } from 'react';
import type { FEVoiceConnect } from '@/hooks/useVoiceSession';

// Gemini Realtime over WebRTC uses an HTTPS SDP exchange similar to OpenAI, but accepts X-Goog-Api-Key header
// and may expect different datachannel message shapes. We implement the minimal-compatible client here.

type ConnState = 'idle' | 'connecting' | 'connected' | 'error';

export function useRealtimeGemini() {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<ConnState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [assistantText, setAssistantText] = useState<string>('');

  const connect = useCallback(async (session: FEVoiceConnect, inputStream: MediaStream) => {
    if (!session) throw new Error('Missing session');
    setState('connecting');
    setError(null);
    setAssistantText('');

    const iceServers = session.iceServers ?? [{ urls: 'stun:stun.l.google.com:19302' }];
    const pc = new RTCPeerConnection({ iceServers });
    pcRef.current = pc;

    const remoteStream = new MediaStream();
    remoteStreamRef.current = remoteStream;
    pc.ontrack = (e) => {
      for (const track of e.streams[0].getTracks()) {
        remoteStream.addTrack(track);
      }
    };

  // Ensure we negotiate a remote audio stream for TTS
  try { pc.addTransceiver('audio', { direction: 'recvonly' } as any); } catch {}
  inputStream.getTracks().forEach((t) => pc.addTrack(t, inputStream));

    // Data channel for events (Gemini may auto-create; we also create one for symmetry)
    const dc = pc.createDataChannel('events');
    dcRef.current = dc;
    dc.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        // Minimal parsing; adjust as needed for Gemini's message schema
        if (typeof msg?.text === 'string') {
          setAssistantText((prev) => prev + msg.text);
        }
      } catch {
        // ignore non-JSON
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') setState('connected');
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') setState('error');
    };

    const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: false } as any);
    await pc.setLocalDescription(offer);

    // Validate provider_url and session_flow
    const url = session.provider_url || '';
    const isHttps = url.startsWith('https://');
    const isHttp = url.startsWith('http://');
    const isWss = url.startsWith('wss://');
    const isWs = url.startsWith('ws://');
    const allowInsecure = (typeof window !== 'undefined' && /^http:\/\/(localhost|127\.0\.0\.1)(:\\d+)?$/.test(window.location.origin))
      || ((import.meta as any).env?.VITE_ALLOW_INSECURE_PROVIDER_URL === 'true');

    const flow = (session as any).session_flow as string | undefined;
    if (flow && flow.startsWith('websocket')) {
      // Not yet supported in this client
      if (!(isWss || (isWs && allowInsecure))) {
        setError(`Invalid provider_url for websocket mesh. Use wss:// (or ws:// in local dev). Received: ${url}`);
        setState('error');
        return { remoteStream: remoteStreamRef.current };
      }
      setError('WebSocket realtime (websocket_mesh) not implemented in this client. Use https_sdp_direct or enable a mesh client.');
      setState('error');
      return { remoteStream: remoteStreamRef.current };
    }

    if (!(isHttps || (isHttp && allowInsecure))) {
      setError(`Invalid provider_url protocol. Expected https://${allowInsecure ? ' or http:// (local dev)' : ''}. Received: ${url}`);
      setState('error');
      return { remoteStream: remoteStreamRef.current };
    }

  try {
      const providerParams: any = (session as any).instructions?.provider_parameters || {};
      const model: string | undefined = providerParams.model || providerParams.provider_model;
      if (providerParams.provider === 'openai' || (typeof model === 'string' && /gpt|o1|o3|openai/i.test(model))) {
        throw new Error('Config mismatch: OpenAI model/provider passed to Gemini client. Backend should set provider=openai_realtime for OpenAI models.');
      }
      // Prefer X-Goog-Api-Key if provided by backend; else fall back to Authorization if configured
      const headers: Record<string, string> = {
        'Content-Type': 'application/sdp',
        'Accept': 'application/sdp',
      };
      if (session.token) {
        const header = session.token_header || 'Authorization';
        if (header.toLowerCase() === 'authorization') {
          const scheme = session.token_scheme || 'Bearer';
          headers['Authorization'] = `${scheme} ${session.token}`;
        } else {
          headers[header] = session.token;
        }
      }
      const res = await fetch(session.provider_url, {
        method: 'POST',
        headers,
        body: offer.sdp || ''
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Realtime offer failed: ${res.status} ${text}`);
      }
      const answerSdp = await res.text();
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });

  dc.onopen = () => {
        try {
          // Send initial config/instructions if Gemini expects it on open
          dc.send(JSON.stringify({ type: 'session.update', session: session.instructions }));
        } catch {}
      };
    } catch (e: any) {
      setError(e?.message || 'Realtime connection failed');
      setState('error');
    }

    return { remoteStream: remoteStreamRef.current };
  }, []);

  const sendText = useCallback(async (text: string) => {
    const dc = dcRef.current;
    if (!dc || dc.readyState !== 'open') throw new Error('Connection not ready');
    try {
      // Gemini Realtime: mirror OpenAI event; adjust if backend expects another shape
      const frame = {
        type: 'response.create',
        response: {
          conversation: {
            messages: [
              { role: 'user', content: [{ type: 'input_text', text }] }
            ]
          }
        }
      } as any;
      dc.send(JSON.stringify(frame));
    } catch (e: any) {
      throw new Error(e?.message || 'Failed to send text');
    }
  }, []);

  const updateSession = useCallback(async (partial: { system_prompt?: string; provider_parameters?: Record<string, any>; tools?: any[] }) => {
    const dc = dcRef.current;
    if (!dc || dc.readyState !== 'open') throw new Error('Connection not ready');
    try {
      dc.send(JSON.stringify({ type: 'session.update', session: partial }));
    } catch (e: any) {
      throw new Error(e?.message || 'Failed to update session');
    }
  }, []);

  const disconnect = useCallback(() => {
    try { dcRef.current?.close(); } catch {}
    try { pcRef.current?.close(); } catch {}
    dcRef.current = null; pcRef.current = null;
    setState('idle');
  }, []);

  return {
    state,
    error,
    assistantText,
    remoteStream: remoteStreamRef.current,
  connect,
  sendText,
  updateSession,
    disconnect,
  };
}
