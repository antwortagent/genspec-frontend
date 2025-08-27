import { useCallback, useRef, useState } from 'react';
export function useRealtimeGemini() {
    const pcRef = useRef(null);
    const dcRef = useRef(null);
    const remoteStreamRef = useRef(null);
    const [state, setState] = useState('idle');
    const [error, setError] = useState(null);
    const [assistantText, setAssistantText] = useState('');
    const connect = useCallback(async (session, inputStream) => {
        if (!session)
            throw new Error('Missing session');
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
        try {
            pc.addTransceiver('audio', { direction: 'recvonly' });
        }
        catch { }
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
            }
            catch {
                // ignore non-JSON
            }
        };
        pc.onconnectionstatechange = () => {
            if (pc.connectionState === 'connected')
                setState('connected');
            if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected')
                setState('error');
        };
        const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: false });
        await pc.setLocalDescription(offer);
        if (!session.provider_url.startsWith('http')) {
            setError('Invalid provider_url protocol. Expected https://');
            setState('error');
            return { remoteStream: remoteStreamRef.current };
        }
        try {
            const providerParams = session.instructions?.provider_parameters || {};
            const model = providerParams.model || providerParams.provider_model;
            if (providerParams.provider === 'openai' || (typeof model === 'string' && /gpt|o1|o3|openai/i.test(model))) {
                throw new Error('Config mismatch: OpenAI model/provider passed to Gemini client. Backend should set provider=openai_realtime for OpenAI models.');
            }
            // Prefer X-Goog-Api-Key if provided by backend; else fall back to Authorization if configured
            const headers = {
                'Content-Type': 'application/sdp',
                'Accept': 'application/sdp',
            };
            if (session.token) {
                const header = session.token_header || 'Authorization';
                if (header.toLowerCase() === 'authorization') {
                    const scheme = session.token_scheme || 'Bearer';
                    headers['Authorization'] = `${scheme} ${session.token}`;
                }
                else {
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
                }
                catch { }
            };
        }
        catch (e) {
            setError(e?.message || 'Realtime connection failed');
            setState('error');
        }
        return { remoteStream: remoteStreamRef.current };
    }, []);
    const disconnect = useCallback(() => {
        try {
            dcRef.current?.close();
        }
        catch { }
        try {
            pcRef.current?.close();
        }
        catch { }
        dcRef.current = null;
        pcRef.current = null;
        setState('idle');
    }, []);
    return {
        state,
        error,
        assistantText,
        remoteStream: remoteStreamRef.current,
        connect,
        disconnect,
    };
}
