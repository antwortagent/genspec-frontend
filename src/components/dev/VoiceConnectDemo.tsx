import React, { useState } from 'react';
import { useVoiceSession } from '@/hooks/useVoiceSession';

export const VoiceConnectDemo: React.FC<{ projectId: string }>=({ projectId })=>{
  const { session, loading, error, start, end } = useVoiceSession();
  const [show, setShow] = useState(false);
  return (
    <div style={{ border:'1px dashed var(--border)', borderRadius:12, padding:12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <strong>Voice Session (dev)</strong>
        <button className="ghost" onClick={()=>setShow(!show)}>{show? 'Hide':'Show'}</button>
      </div>
      {show && (
        <div style={{ marginTop:12, display:'grid', gap:8 }}>
          {!session ? (
            <button className="primary" disabled={loading} onClick={()=>start(projectId)}>Start session</button>
          ) : (
            <button className="ghost" onClick={end}>End session</button>
          )}
          {error && <div style={{ color:'crimson' }}>{error}</div>}
          {session && (
            <pre style={{ whiteSpace:'pre-wrap', background:'#f8fafc', padding:12, borderRadius:8, border:'1px solid var(--border)'}}>{JSON.stringify(session, null, 2)}</pre>
          )}
          <div style={{ color:'var(--text-muted)', fontSize:12 }}>
            Use provider_url to open WebRTC/WebSocket, auth with token (if present), use iceServers for RTCPeerConnection, and send instructions as-is.
          </div>
        </div>
      )}
    </div>
  );
}
