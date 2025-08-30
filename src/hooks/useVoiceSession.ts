import { useCallback, useState } from 'react';
import { voiceApi, type VoiceSessionResponse, type ProviderName } from '@/api/services';

// Contract: FE uses these fields verbatim to connect to the provider
export type FEVoiceConnect = {
  provider: ProviderName;
  session_flow: string;
  provider_url: string;
  token: string | null;
  token_header?: string | null;
  token_scheme?: string | null;
  iceServers: VoiceSessionResponse['iceServers'];
  instructions: VoiceSessionResponse['instructions'];
  session_id: string;
};

export function useVoiceSession() {
  const [session, setSession] = useState<FEVoiceConnect | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async (project_id: string) => {
    setLoading(true); setError(null);
    try {
      // Choose backend API dynamically via voiceApi.startSession (api param or env)
      const res = await voiceApi.startSession({ project_id } as any);
      const fe: FEVoiceConnect = {
        provider: (res as any).provider as ProviderName,
        session_flow: res.session_flow,
        provider_url: res.provider_url,
        token: res.token,
        token_header: (res as any).token_header ?? null,
        token_scheme: (res as any).token_scheme ?? null,
        iceServers: res.iceServers,
        instructions: res.instructions,
        session_id: res.session_id,
      };
      setSession(fe);
      return fe;
    } catch (e: any) {
      setError(e?.message || 'Failed to start voice session');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const end = useCallback(async () => {
    if (!session) return;
    try {
      await voiceApi.endSession(session.session_id);
    } finally {
      setSession(null);
    }
  }, [session]);

  return { session, loading, error, start, end };
}
