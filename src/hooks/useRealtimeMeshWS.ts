import { useCallback, useRef, useState } from 'react';
import type { FEVoiceConnect } from '@/hooks/useVoiceSession';

// Mesh WebSocket client for low-latency audio streaming (gemini_ws)
// Inbound: JSON events + binary audio (TTS)
// Outbound: JSON control + binary mic frames (PCM16/Opus)

type ConnState = 'idle' | 'connecting' | 'connected' | 'error';

type WSMessage = {
  type: string;
  text?: string;
  format?: string;
  data?: string; // base64 for audio chunks if mesh chooses JSON frames; or binary frames via Blob
};

export function useRealtimeMeshWS() {
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const remoteBufferRef = useRef<Uint8Array[]>([]);
  const [state, setState] = useState<ConnState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [assistantText, setAssistantText] = useState<string>('');
  const [ready, setReady] = useState<boolean>(false);

  const connect = useCallback(async (session: FEVoiceConnect & { audio?: any }, inputStream: MediaStream) => {
  setState('connecting');
    setError(null);
    setAssistantText('');
  setReady(false);

    if (!session.provider_url.startsWith('ws://') && !session.provider_url.startsWith('wss://')) {
      setError('Invalid provider_url for mesh WS. Expected ws:// or wss://');
      setState('error');
      return { audioEl: null };
    }

    // provider_url already contains sessionId and token as query params from mesh
    const ws = new WebSocket(session.provider_url);
    ws.binaryType = 'arraybuffer';
    wsRef.current = ws;

    ws.onopen = () => {
      setState('connected');
      setReady(true);
      // Send a start/control frame if needed (voice/locale/etc.)
      const startMsg = { type: 'start', audio: session.audio || { sampleRate: 16000, encoding: 'pcm16' } };
      ws.send(JSON.stringify(startMsg));
      // Start sending mic frames
      try {
        const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
        const mr = new MediaRecorder(inputStream, { mimeType: mime, audioBitsPerSecond: 48000 });
        mediaRecorderRef.current = mr;
        mr.ondataavailable = (e) => {
          if (e.data && e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            ws.send(e.data);
          }
        };
        mr.start(100); // ~100ms chunks
      } catch (err: any) {
        // Fallback: raw PCM via ScriptProcessor not implemented here
      }
    };

    ws.onmessage = (ev) => {
      if (typeof ev.data === 'string') {
        try {
          const msg: WSMessage = JSON.parse(ev.data);
          switch (msg.type) {
            case 'transcript_partial':
            case 'transcript_final':
            case 'agent_message':
              if (msg.text) setAssistantText((prev) => prev + (msg.type === 'transcript_partial' ? msg.text : `\n${msg.text}`));
              break;
            case 'audio_chunk':
              if (msg.data) {
                const chunk = Uint8Array.from(atob(msg.data), c => c.charCodeAt(0));
                remoteBufferRef.current.push(chunk);
              }
              break;
            case 'audio_end':
              // Simple playback via a Blob; for gapless playback a streaming SourceBuffer is better
              const all = remoteBufferRef.current.reduce((acc, u8) => {
                const out = new Uint8Array(acc.length + u8.length);
                out.set(acc, 0); out.set(u8, acc.length);
                return out;
              }, new Uint8Array());
              remoteBufferRef.current = [];
              const ab: ArrayBuffer = all.buffer as ArrayBuffer;
              const blob = new Blob([ab], { type: 'audio/mpeg' });
              const url = URL.createObjectURL(blob);
              if (!remoteAudioRef.current) {
                remoteAudioRef.current = new Audio();
                remoteAudioRef.current.autoplay = true; remoteAudioRef.current.muted = false;
              }
              remoteAudioRef.current.src = url;
              remoteAudioRef.current.play().catch(() => {});
              break;
          }
        } catch {
          // ignore
        }
      } else {
        // Binary TTS frame path (optional)
      }
    };

    ws.onerror = () => {
      setError('Mesh WS error');
      setState('error');
      setReady(false);
    };

    ws.onclose = () => {
      try { mediaRecorderRef.current?.stop(); } catch {}
      mediaRecorderRef.current = null;
      setState('idle');
      setReady(false);
    };

    // Wait until websocket is open before resolving
    await new Promise<void>((resolve, reject) => {
      if (ws.readyState === WebSocket.OPEN) return resolve();
      const timeout = setTimeout(() => reject(new Error('WebSocket not ready')), 8000);
      ws.addEventListener('open', () => { clearTimeout(timeout); resolve(); }, { once: true } as any);
    });

    return { audioEl: remoteAudioRef.current };
  }, []);

  const sendText = useCallback(async (text: string) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) throw new Error('Connection not ready');
    try {
      ws.send(JSON.stringify({ type: 'user_text', text }));
    } catch (e: any) {
      throw new Error(e?.message || 'Failed to send text');
    }
  }, []);

  const updateSession = useCallback(async (partial: { system_prompt?: string; provider_parameters?: Record<string, any>; tools?: any[] }) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) throw new Error('Connection not ready');
    try {
      ws.send(JSON.stringify({ type: 'session.update', session: partial }));
    } catch (e: any) {
      throw new Error(e?.message || 'Failed to update session');
    }
  }, []);

  const disconnect = useCallback(() => {
    try { mediaRecorderRef.current?.stop(); } catch {}
    mediaRecorderRef.current = null;
    try { wsRef.current?.close(); } catch {}
    wsRef.current = null;
    setState('idle');
  }, []);

  return { state, error, assistantText, connect, sendText, updateSession, disconnect, ready };
}
