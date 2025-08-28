import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import styles from './ProactiveAgentPanel.module.css';
import { ChatPanel } from './ChatPanel';
import { VoicePanel } from './VoicePanel';
export const ProactiveAgentPanel = () => {
    const [mode, setMode] = useState(() => {
        const saved = typeof window !== 'undefined' ? window.localStorage.getItem('agent_mode') : null;
        return (saved === 'chat' || saved === 'voice') ? saved : 'voice';
    });
    const [isExpanded, setIsExpanded] = useState(true);
    const [suggestions, setSuggestions] = useState([]);
    const [activeState, setActiveState] = useState('idle');
    useEffect(() => {
        try {
            window.localStorage.setItem('agent_mode', mode);
        }
        catch { }
    }, [mode]);
    // Mock suggestions - in a real app, these would come from the AI based on context
    useEffect(() => {
        // These would typically be generated based on user context
        setSuggestions([
            {
                id: '1',
                text: 'Help me create requirements for my new project',
                icon: (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), _jsx("polyline", { points: "14 2 14 8 20 8" }), _jsx("line", { x1: "16", y1: "13", x2: "8", y2: "13" }), _jsx("line", { x1: "16", y1: "17", x2: "8", y2: "17" }), _jsx("polyline", { points: "10 9 9 9 8 9" })] }))
            },
            {
                id: '2',
                text: 'Analyze my current project for compliance gaps',
                icon: (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), _jsx("polyline", { points: "22 4 12 14.01 9 11.01" })] }))
            },
            {
                id: '3',
                text: 'Prepare for my upcoming audit',
                icon: (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }), _jsx("line", { x1: "16", y1: "2", x2: "16", y2: "6" }), _jsx("line", { x1: "8", y1: "2", x2: "8", y2: "6" }), _jsx("line", { x1: "3", y1: "10", x2: "21", y2: "10" })] }))
            }
        ]);
    }, []);
    const handleSuggestionClick = (suggestion) => {
        console.log('Suggestion clicked:', suggestion);
        // Here you would typically send this to your AI backend
        // and process the response
        // Simulate AI thinking and responding
        setActiveState('thinking');
        setTimeout(() => {
            setActiveState('speaking');
            setTimeout(() => {
                setActiveState('idle');
            }, 3000);
        }, 2000);
    };
    return (_jsxs("aside", { className: `${styles.panel} ${isExpanded ? '' : styles.collapsed}`, children: [_jsxs("div", { className: styles.header, children: [_jsxs("div", { className: styles.title, children: [_jsxs("div", { className: `${styles.statusIndicator} ${styles[activeState]}`, children: [activeState === 'thinking' && (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("polyline", { points: "12,6 12,12 16,14" })] })), activeState === 'speaking' && (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M12 2c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10z" }), _jsx("path", { d: "M8 9.5v5m4-7v9m4-7v5" })] })), activeState === 'idle' && (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("path", { d: "M12 16v.01" }), _jsx("path", { d: "M12 12v-4" })] }))] }), _jsx("span", { children: "AI Assistant" })] }), _jsxs("div", { className: styles.controls, children: [_jsxs("div", { className: styles.modeToggle, role: "tablist", "aria-label": "Assistant mode", children: [_jsx("button", { role: "tab", "aria-selected": mode === 'chat', className: `${styles.modeBtn} ${mode === 'chat' ? styles.modeBtnActive : ''}`, onClick: () => setMode('chat'), children: "Chat" }), _jsx("button", { role: "tab", "aria-selected": mode === 'voice', className: `${styles.modeBtn} ${mode === 'voice' ? styles.modeBtnActive : ''}`, onClick: () => setMode('voice'), children: "Voice" })] }), _jsx("button", { className: styles.toggleButton, onClick: () => setIsExpanded(!isExpanded), "aria-label": isExpanded ? "Collapse panel" : "Expand panel", children: isExpanded ? (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("polyline", { points: "13 17 18 12 13 7" }), _jsx("polyline", { points: "6 17 11 12 6 7" })] })) : (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("polyline", { points: "11 17 6 12 11 7" }), _jsx("polyline", { points: "18 17 13 12 18 7" })] })) })] })] }), _jsxs("div", { className: styles.content, children: [_jsxs("div", { className: styles.suggestionsContainer, children: [_jsx("h3", { className: styles.suggestionsTitle, children: "I can help you with:" }), _jsx("div", { className: styles.suggestionsList, children: suggestions.map(suggestion => (_jsxs("button", { className: styles.suggestionItem, onClick: () => handleSuggestionClick(suggestion), children: [suggestion.icon, _jsx("span", { children: suggestion.text })] }, suggestion.id))) })] }), _jsx("div", { className: styles.interface, children: mode === 'chat' ? _jsx(ChatPanel, {}) : _jsx(VoicePanel, {}) })] })] }));
};
