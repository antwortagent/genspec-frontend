import { useCallback, useRef, useState } from 'react';
export function useRealtimeOpenAI() {
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
        try {
            pc.addTransceiver('audio', { direction: 'recvonly' });
        }
        catch { }
        // Add mic tracks
        inputStream.getTracks().forEach((t) => pc.addTrack(t, inputStream));
        // Data channel for events
        const dc = pc.createDataChannel('oai-events');
        dcRef.current = dc;
        dc.onmessage = (ev) => {
            try {
                const msg = JSON.parse(ev.data);
                // Heuristic handling of common event shapes
                const t = msg?.type;
                if (t === 'response.output_text.delta' && typeof msg?.delta === 'string') {
                    setAssistantText((prev) => prev + msg.delta);
                }
                else if (t === 'response.output_text.done' && typeof msg?.text === 'string') {
                    setAssistantText((prev) => (prev || '') + msg.text);
                }
                else if (t === 'transcript.delta' && typeof msg?.text === 'string') {
                    // some providers stream transcript too
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
        // Create offer to receive audio
        const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: false });
        await pc.setLocalDescription(offer);
        // Use HTTPS SDP exchange by default (OpenAI-style). If provider_url is wss, we would need a WS path (not implemented here).
        if (session.provider_url.startsWith('wss:')) {
            setError('WebSocket realtime not implemented in this client. Use HTTPS/SDP provider_url.');
            setState('error');
            return { remoteStream: remoteStreamRef.current };
        }
        if (!session.provider_url.startsWith('http')) {
            setError('Invalid provider_url protocol. Expected https://');
            setState('error');
            return { remoteStream: remoteStreamRef.current };
        }
        try {
            const providerParams = session.instructions?.provider_parameters || {};
            const model = providerParams.model || providerParams.provider_model;
            if (providerParams.provider === 'gemini' || (typeof model === 'string' && /gemini/i.test(model))) {
                throw new Error('Config mismatch: Gemini model/provider passed to OpenAI client. Backend should set provider=gemini_realtime and a Gemini-compatible provider_url.');
            }
            // If no token is provided for a direct OpenAI HTTPS endpoint, abort with a clear error.
            if (!session.token && /api\.openai\.com/.test(session.provider_url)) {
                throw new Error('Missing provider token from session. Backend/mesh must supply an ephemeral token or proxy the SDP exchange.');
            }
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
            // Send session instructions after DC opens
            dc.onopen = () => {
                try {
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
