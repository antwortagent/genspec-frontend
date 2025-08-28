import { useCallback, useState } from 'react';
import { voiceApi } from '@/api/services';
export function useVoiceSession() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const start = useCallback(async (project_id) => {
        setLoading(true);
        setError(null);
        try {
            // Choose backend API dynamically via voiceApi.startSession (api param or env)
            const res = await voiceApi.startSession({ project_id });
            const fe = {
                provider: res.provider,
                provider_url: res.provider_url,
                token: res.token,
                token_header: res.token_header ?? null,
                token_scheme: res.token_scheme ?? null,
                iceServers: res.iceServers,
                instructions: res.instructions,
                session_id: res.session_id,
            };
            setSession(fe);
            return fe;
        }
        catch (e) {
            setError(e?.message || 'Failed to start voice session');
            throw e;
        }
        finally {
            setLoading(false);
        }
    }, []);
    const end = useCallback(async () => {
        if (!session)
            return;
        try {
            await voiceApi.endSession(session.session_id);
        }
        finally {
            setSession(null);
        }
    }, [session]);
    return { session, loading, error, start, end };
}
