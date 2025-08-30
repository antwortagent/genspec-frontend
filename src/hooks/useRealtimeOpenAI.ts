import { useCallback, useRef, useState } from 'react';
import type { FEVoiceConnect } from '@/hooks/useVoiceSession';

type ConnState = 'idle' | 'connecting' | 'connected' | 'error';

export function useRealtimeOpenAI() {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<ConnState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [assistantText, setAssistantText] = useState<string>('');
  const [ready, setReady] = useState<boolean>(false);

  const connect = useCallback(async (session: FEVoiceConnect, inputStream: MediaStream) => {
    if (!session) throw new Error('Missing session');
  setState('connecting');
    setError(null);
    setAssistantText('');
  setReady(false);

    // Fallback STUN if not provided
    const iceServers = session.iceServers ?? [{ urls: 'stun:stun.l.google.com:19302' }];
    const pc = new RTCPeerConnection({ iceServers });
    pcRef.current = pc;

    // Collect remote audio into a MediaStream
    const remoteStream = new MediaStream();
    remoteStreamRef.current = remoteStream;
    pc.ontrack = (e) => {
      for (const track of e.streams[0].getTracks()) {
        remoteStream.addTrack(track);
      }
    };

  // Add a recvonly audio transceiver to ensure we negotiate a remote audio stream
  try { pc.addTransceiver('audio', { direction: 'recvonly' } as any); } catch {}

  // Add mic tracks
    inputStream.getTracks().forEach((t) => pc.addTrack(t, inputStream));

    // Data channel for events
  const dc = pc.createDataChannel('oai-events');
    dcRef.current = dc;
    dc.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        // Heuristic handling of common event shapes
        const t = msg?.type as string | undefined;
        if (t === 'response.output_text.delta' && typeof msg?.delta === 'string') {
          setAssistantText((prev) => prev + msg.delta);
        } else if (t === 'response.output_text.done' && typeof msg?.text === 'string') {
          setAssistantText((prev) => (prev || '') + msg.text);
        } else if (t === 'transcript.delta' && typeof msg?.text === 'string') {
          // some providers stream transcript too
          setAssistantText((prev) => prev + msg.text);
        }
      } catch {
        // ignore non-JSON
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') setState('connected');
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') { setState('error'); setReady(false); }
    };

    // Create offer to receive audio
    const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: false } as any);
    await pc.setLocalDescription(offer);
    // Wait for ICE gathering to complete to include all candidates in the SDP (non-trickle flow)
    await new Promise<void>((resolve) => {
      if (pc.iceGatheringState === 'complete') return resolve();
      const checkComplete = () => {
        if (pc.iceGatheringState === 'complete') {
          pc.removeEventListener('icegatheringstatechange', checkComplete);
          resolve();
        }
      };
      pc.addEventListener('icegatheringstatechange', checkComplete);
      // As a fallback, also resolve after onicecandidate null
      const onIceCandidate = (e: RTCPeerConnectionIceEvent) => {
        if (!e.candidate) {
          pc.removeEventListener('icecandidate', onIceCandidate as any);
          pc.removeEventListener('icegatheringstatechange', checkComplete);
          resolve();
        }
      };
      pc.addEventListener('icecandidate', onIceCandidate as any);
    });

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
      // Mesh over WebSocket is not yet implemented in this client
      if (!(isWss || (isWs && allowInsecure))) {
        setError(`Invalid provider_url for websocket mesh. Use wss:// (or ws:// in local dev). Received: ${url}`);
        setState('error');
        return { remoteStream: remoteStreamRef.current };
      }
      setError('WebSocket realtime (websocket_mesh) not implemented in this client. Use https_sdp_direct or enable a mesh client.');
      setState('error');
      return { remoteStream: remoteStreamRef.current };
    }

    // Default: HTTPS SDP exchange (direct to provider). Allow http:// only in local dev.
    if (!(isHttps || (isHttp && allowInsecure))) {
      setError(`Invalid provider_url protocol. Expected https://${allowInsecure ? ' or http:// (local dev)' : ''}. Received: ${url}`);
      setState('error');
      return { remoteStream: remoteStreamRef.current };
    }

  try {
      const providerParams: any = (session as any).instructions?.provider_parameters || {};
      const model: string | undefined = providerParams.model || providerParams.provider_model;
      if (providerParams.provider === 'gemini' || (typeof model === 'string' && /gemini/i.test(model))) {
        throw new Error('Config mismatch: Gemini model/provider passed to OpenAI client. Backend should set provider=gemini_realtime and a Gemini-compatible provider_url.');
      }
      // If no token is provided for a direct OpenAI HTTPS endpoint, abort with a clear error.
      if (!session.token && /api\.openai\.com/.test(session.provider_url)) {
        throw new Error('Missing provider token from session. Backend/mesh must supply an ephemeral token or proxy the SDP exchange.');
      }
      const headers: Record<string, string> = {
        'Content-Type': 'application/sdp',
        'Accept': 'application/sdp',
      };
      if (session.token) {
        const header = (session as any).token_header || 'Authorization';
        if (header.toLowerCase() === 'authorization') {
          const scheme = (session as any).token_scheme || 'Bearer';
          headers['Authorization'] = `${scheme} ${session.token}`;
        } else {
          headers[header] = session.token;
        }
      }
      const res = await fetch(session.provider_url, {
        method: 'POST',
        headers,
        body: (pc.localDescription?.sdp || offer.sdp || '')
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Realtime offer failed: ${res.status} ${text}`);
      }
      const answerSdp = await res.text();
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });

      // Send session instructions after DC opens
      dc.onopen = () => {
        setReady(true);
        try {
          dc.send(JSON.stringify({ type: 'session.update', session: session.instructions }));
        } catch {}
      };
      dc.onclose = () => { setReady(false); };
    } catch (e: any) {
      setError(e?.message || 'Realtime connection failed');
      setState('error');
      setReady(false);
    }

    // Wait until data channel is open before resolving connect
    await new Promise<void>((resolve, reject) => {
      const dc = dcRef.current;
      if (dc && dc.readyState === 'open') return resolve();
      const timeout = setTimeout(() => {
        try { dc?.removeEventListener?.('open', onOpen as any); } catch {}
        reject(new Error('Data channel not ready'));
      }, 8000);
      function onOpen() {
        clearTimeout(timeout);
        try { dc?.removeEventListener?.('open', onOpen as any); } catch {}
        resolve();
      }
      try { dc?.addEventListener?.('open', onOpen as any, { once: true } as any); } catch {}
    });

    return { remoteStream: remoteStreamRef.current };
  }, []);

  // Send a user text message over the data channel and request a response
  const sendText = useCallback(async (text: string) => {
    const dc = dcRef.current;
    if (!dc || dc.readyState !== 'open') throw new Error('Connection not ready');
    try {
      // OpenAI Realtime: create a new response using a user message
      const frame = {
        type: 'response.create',
        response: {
          instructions: undefined,
          conversation: {
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'input_text', text }
                ]
              }
            ]
          }
        }
      } as any;
      dc.send(JSON.stringify(frame));
    } catch (e: any) {
      throw new Error(e?.message || 'Failed to send text');
    }
  }, []);

  // Patch session settings (system_prompt, provider_parameters, tools, etc.)
  const updateSession = useCallback(async (partial: { system_prompt?: string; provider_parameters?: Record<string, any>; tools?: any[] }) => {
    const dc = dcRef.current;
    if (!dc || dc.readyState !== 'open') throw new Error('Connection not ready');
    try {
      dc.send(
        JSON.stringify({
          type: 'session.update',
          session: partial,
        })
      );
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
  ready,
  };
}
