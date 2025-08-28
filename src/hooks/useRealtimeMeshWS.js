import { useCallback, useRef, useState } from 'react';
export function useRealtimeMeshWS() {
    const wsRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const remoteAudioRef = useRef(null);
    const remoteBufferRef = useRef([]);
    const [state, setState] = useState('idle');
    const [error, setError] = useState(null);
    const [assistantText, setAssistantText] = useState('');
    const connect = useCallback(async (session, inputStream) => {
        setState('connecting');
        setError(null);
        setAssistantText('');
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
            }
            catch (err) {
                // Fallback: raw PCM via ScriptProcessor not implemented here
            }
        };
        ws.onmessage = (ev) => {
            if (typeof ev.data === 'string') {
                try {
                    const msg = JSON.parse(ev.data);
                    switch (msg.type) {
                        case 'transcript_partial':
                        case 'transcript_final':
                        case 'agent_message':
                            if (msg.text)
                                setAssistantText((prev) => prev + (msg.type === 'transcript_partial' ? msg.text : `\n${msg.text}`));
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
                                out.set(acc, 0);
                                out.set(u8, acc.length);
                                return out;
                            }, new Uint8Array());
                            remoteBufferRef.current = [];
                            const ab = all.buffer;
                            const blob = new Blob([ab], { type: 'audio/mpeg' });
                            const url = URL.createObjectURL(blob);
                            if (!remoteAudioRef.current) {
                                remoteAudioRef.current = new Audio();
                                remoteAudioRef.current.autoplay = true;
                                remoteAudioRef.current.muted = false;
                            }
                            remoteAudioRef.current.src = url;
                            remoteAudioRef.current.play().catch(() => { });
                            break;
                    }
                }
                catch {
                    // ignore
                }
            }
            else {
                // Binary TTS frame path (optional)
            }
        };
        ws.onerror = () => {
            setError('Mesh WS error');
            setState('error');
        };
        ws.onclose = () => {
            try {
                mediaRecorderRef.current?.stop();
            }
            catch { }
            mediaRecorderRef.current = null;
            setState('idle');
        };
        return { audioEl: remoteAudioRef.current };
    }, []);
    const disconnect = useCallback(() => {
        try {
            mediaRecorderRef.current?.stop();
        }
        catch { }
        mediaRecorderRef.current = null;
        try {
            wsRef.current?.close();
        }
        catch { }
        wsRef.current = null;
        setState('idle');
    }, []);
    return { state, error, assistantText, connect, disconnect };
}
