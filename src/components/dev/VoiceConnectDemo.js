import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useVoiceSession } from '@/hooks/useVoiceSession';
export const VoiceConnectDemo = ({ projectId }) => {
    const { session, loading, error, start, end } = useVoiceSession();
    const [show, setShow] = useState(false);
    return (_jsxs("div", { style: { border: '1px dashed var(--border)', borderRadius: 12, padding: 12 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("strong", { children: "Voice Session (dev)" }), _jsx("button", { className: "ghost", onClick: () => setShow(!show), children: show ? 'Hide' : 'Show' })] }), show && (_jsxs("div", { style: { marginTop: 12, display: 'grid', gap: 8 }, children: [!session ? (_jsx("button", { className: "primary", disabled: loading, onClick: () => start(projectId), children: "Start session" })) : (_jsx("button", { className: "ghost", onClick: end, children: "End session" })), error && _jsx("div", { style: { color: 'crimson' }, children: error }), session && (_jsx("pre", { style: { whiteSpace: 'pre-wrap', background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }, children: JSON.stringify(session, null, 2) })), _jsx("div", { style: { color: 'var(--text-muted)', fontSize: 12 }, children: "Use provider_url to open WebRTC/WebSocket, auth with token (if present), use iceServers for RTCPeerConnection, and send instructions as-is." })] }))] }));
};
