import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import styles from '@/styles/AgentPanel.module.css';
import { ChatPanel } from './ChatPanel';
import { VoicePanel } from './VoicePanel';
export const AgentPanel = () => {
    const [mode, setMode] = useState(() => {
        const saved = typeof window !== 'undefined' ? window.localStorage.getItem('agent_mode') : null;
        return (saved === 'chat' || saved === 'voice') ? saved : 'voice';
    });
    useEffect(() => {
        try {
            window.localStorage.setItem('agent_mode', mode);
        }
        catch { }
    }, [mode]);
    return (_jsxs("aside", { className: styles.panel, children: [_jsxs("div", { className: styles.toggleRow, children: [_jsx("div", { className: styles.title, children: "Assistant" }), _jsxs("div", { className: styles.modeToggle, role: "tablist", "aria-label": "Assistant mode", children: [_jsx("button", { role: "tab", "aria-selected": mode === 'chat', className: `${styles.modeBtn} ${mode === 'chat' ? styles.modeBtnActive : ''}`, onClick: () => setMode('chat'), children: "Chat" }), _jsx("button", { role: "tab", "aria-selected": mode === 'voice', className: `${styles.modeBtn} ${mode === 'voice' ? styles.modeBtnActive : ''}`, onClick: () => setMode('voice'), children: "Voice" })] })] }), _jsx("div", { className: styles.host, children: mode === 'chat' ? _jsx(ChatPanel, {}) : _jsx(VoicePanel, {}) })] }));
};
