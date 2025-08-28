import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '@/store/auth';
import { chatApi } from '@/api/services';
import styles from './ChatPanel.module.css';
export const ChatPanel = () => {
    const [messages, setMessages] = useState([
        {
            id: '1',
            type: 'assistant',
            content: 'Welcome to GenSpec! I\'m your AI assistant. I can help you create detailed specifications for your projects. What would you like to build today?',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || isLoading)
            return;
        const userMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: inputMessage.trim(),
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);
        try {
            // Try to use real AI API
            const response = await chatApi.sendMessage({
                message: userMessage.content,
                context: 'specification_generation'
            });
            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: response.message,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
        }
        catch (error) {
            // Fallback to mock response if API fails
            console.warn('AI API unavailable, using fallback response:', error);
            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: `I understand you want to create: "${userMessage.content}". Let me help you break this down into a comprehensive specification. Could you provide more details about the scope, target audience, and key features you have in mind?`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: styles.chatPanel, children: [_jsxs("div", { className: styles.header, children: [_jsx("div", { className: styles.headerInfo, children: _jsx("div", { className: styles.status, children: _jsx("div", { className: styles.statusIndicator }) }) }), _jsx("button", { className: styles.menuButton, children: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("circle", { cx: "12", cy: "12", r: "1" }), _jsx("circle", { cx: "12", cy: "5", r: "1" }), _jsx("circle", { cx: "12", cy: "19", r: "1" })] }) })] }), _jsx("div", { className: styles.messagesContainer, children: _jsxs("div", { className: styles.messages, children: [messages.map((message) => (_jsxs("div", { className: `${styles.message} ${styles[message.type]}`, children: [_jsx("div", { className: styles.messageAvatar, children: message.type === 'user' ? (_jsx("div", { className: styles.userAvatar, children: user?.email?.[0]?.toUpperCase() || 'U' })) : (_jsx("div", { className: styles.assistantAvatar, children: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M12 2L2 7L12 12L22 7L12 2Z" }), _jsx("path", { d: "M2 17L12 22L22 17" }), _jsx("path", { d: "M2 12L12 17L22 12" })] }) })) }), _jsxs("div", { className: styles.messageContent, children: [_jsx("div", { className: styles.messageText, children: message.content }), _jsx("div", { className: styles.messageTime, children: message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })] })] }, message.id))), isLoading && (_jsxs("div", { className: `${styles.message} ${styles.assistant}`, children: [_jsx("div", { className: styles.messageAvatar, children: _jsx("div", { className: styles.assistantAvatar, children: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M12 2L2 7L12 12L22 7L12 2Z" }), _jsx("path", { d: "M2 17L12 22L22 17" }), _jsx("path", { d: "M2 12L12 17L22 12" })] }) }) }), _jsx("div", { className: styles.messageContent, children: _jsxs("div", { className: styles.typing, children: [_jsx("span", {}), _jsx("span", {}), _jsx("span", {})] }) })] }))] }) }), _jsxs("div", { className: styles.inputContainer, children: [_jsxs("div", { className: styles.quickActions, children: [_jsxs("button", { className: styles.quickAction, children: [_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), _jsx("polyline", { points: "14 2 14 8 20 8" }), _jsx("line", { x1: "16", y1: "13", x2: "8", y2: "13" }), _jsx("line", { x1: "16", y1: "17", x2: "8", y2: "17" }), _jsx("polyline", { points: "10 9 9 9 8 9" })] }), _jsx("span", { children: "Create Spec" })] }), _jsxs("button", { className: styles.quickAction, children: [_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }), _jsx("rect", { x: "9", y: "9", width: "6", height: "6" }), _jsx("path", { d: "M9 1v6" }), _jsx("path", { d: "M15 1v6" }), _jsx("path", { d: "M9 17v6" }), _jsx("path", { d: "M15 17v6" }), _jsx("path", { d: "M1 9h6" }), _jsx("path", { d: "M17 9h6" }), _jsx("path", { d: "M1 15h6" }), _jsx("path", { d: "M17 15h6" })] }), _jsx("span", { children: "Add Feature" })] }), _jsxs("button", { className: styles.quickAction, children: [_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h4l3 3V8l-3 3z" }), _jsx("path", { d: "M22 9L20 7" }), _jsx("path", { d: "M22 7L20 9" })] }), _jsx("span", { children: "Review" })] })] }), _jsx("form", { onSubmit: handleSendMessage, className: styles.inputForm, children: _jsxs("div", { className: styles.inputWrapper, children: [_jsx("input", { type: "text", value: inputMessage, onChange: (e) => setInputMessage(e.target.value), placeholder: "Describe your project or ask a question...", className: styles.messageInput, disabled: isLoading }), _jsx("button", { type: "submit", className: styles.sendButton, disabled: !inputMessage.trim() || isLoading, children: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("line", { x1: "22", y1: "2", x2: "11", y2: "13" }), _jsx("polygon", { points: "22,2 15,22 11,13 2,9 22,2" })] }) })] }) })] })] }));
};
