import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/store/auth';
import { chatApi } from '@/api/services';
import { useParams } from 'react-router-dom';
import { useVoiceSession } from '@/hooks/useVoiceSession';
import { useRealtimeOpenAI } from '@/hooks/useRealtimeOpenAI';
import { useRealtimeGemini } from '@/hooks/useRealtimeGemini';
import { useRealtimeMeshWS } from '@/hooks/useRealtimeMeshWS';
import styles from './ChatPanel.module.css';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ChatPanel: React.FC = () => {
  const { projectId } = useParams();
  const [messages, setMessages] = useState<Message[]>([
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
  const { session, start: startSession } = useVoiceSession();
  const openaiRT = useRealtimeOpenAI();
  const geminiRT = useRealtimeGemini();
  const meshWSRT = useRealtimeMeshWS();
  const [activeClient, setActiveClient] = useState<'openai' | 'gemini' | 'mesh' | null>(null);
  const getClientForSession = (sess: any) => {
    const isMesh = !!(sess && (sess.session_flow === 'websocket_mesh' || sess.provider_url?.startsWith('ws://') || sess.provider_url?.startsWith('wss://')));
    if (isMesh) return { key: 'mesh' as const, client: meshWSRT };
    const isGem = !!(sess && (sess.instructions?.provider_parameters?.provider === 'gemini' || sess.provider?.includes?.('gemini')));
    return isGem ? { key: 'gemini' as const, client: geminiRT } : { key: 'openai' as const, client: openaiRT };
  };
  const rtState = activeClient === 'gemini' ? geminiRT.state : activeClient === 'mesh' ? meshWSRT.state : openaiRT.state;
  const rtError = activeClient === 'gemini' ? geminiRT.error : activeClient === 'mesh' ? meshWSRT.error : openaiRT.error;
  const rtReady = activeClient === 'gemini' ? geminiRT.ready : activeClient === 'mesh' ? meshWSRT.ready : openaiRT.ready;
  const assistantText = activeClient === 'gemini' ? geminiRT.assistantText : activeClient === 'mesh' ? meshWSRT.assistantText : openaiRT.assistantText;
  const assistantBaseRef = useRef<number>(0);
  const assistantMsgIdRef = useRef<string | null>(null);
  const connectingRef = useRef<Promise<void> | null>(null);

  const waitUntilConnected = async (timeoutMs = 5000) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const st = activeClient === 'gemini' ? geminiRT.state : activeClient === 'mesh' ? meshWSRT.state : openaiRT.state;
      const ready = activeClient === 'gemini' ? geminiRT.ready : activeClient === 'mesh' ? meshWSRT.ready : openaiRT.ready;
      if (st === 'connected' && ready) return;
      await new Promise((r) => setTimeout(r, 150));
    }
    throw new Error('Realtime connection not ready');
  };

  // Ensure connection (no mic) on first user send or when session becomes available
  useEffect(() => {
    // Lazy connect when needed; do not auto-connect to avoid autoplay issues
  }, [session]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // 1) Ensure voice session
      let sess = session;
      if (!sess) {
        if (!projectId) throw new Error('Open a project to start a session');
        sess = await startSession(projectId);
      }
  // 2) Ensure realtime connection (no mic stream); serialize connects
  const { key, client } = getClientForSession(sess);
  setActiveClient(key);
  const clientState = client.state;
  if (clientState !== 'connected') {
        if (!connectingRef.current) {
          connectingRef.current = (async () => {
    try { await client.connect(sess, new MediaStream()); } finally { /* keep promise for waiters */ }
          })();
        }
        try {
          await connectingRef.current;
        } finally {
          // no-op, retain ref for subsequent waiters
        }
        // Wait until DC is really open
        try {
          await waitUntilConnected();
        } catch {
          // Give a short grace period and try once more
          await new Promise((r) => setTimeout(r, 300));
          await waitUntilConnected();
        }
      }

      // 3) Create assistant placeholder and start streaming
      const assistantId = (Date.now() + 1).toString();
      assistantMsgIdRef.current = assistantId;
      assistantBaseRef.current = typeof assistantText === 'string' ? assistantText.length : 0;
      setMessages(prev => [...prev, { id: assistantId, type: 'assistant', content: '', timestamp: new Date() }]);

      // 4) Try realtime send first
  if (client?.sendText) {
        // Retry a few times if the DC just opened
        let lastErr: any = null;
        for (let i = 0; i < 5; i++) {
          try {
    await client.sendText(userMessage.content);
            lastErr = null;
            break;
          } catch (e:any) {
            lastErr = e;
            await new Promise((r) => setTimeout(r, 200));
          }
        }
        if (lastErr) throw lastErr;
      } else {
        // Fallback to REST chat
        const response = await chatApi.sendMessage({ message: userMessage.content, context: 'specification_generation' });
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: response.message } : m));
      }
    } catch (error) {
      console.warn('Realtime chat failed, using fallback:', error);
      const fallbackId = assistantMsgIdRef.current || (Date.now() + 1).toString();
      setMessages(prev => prev.map(m => m.id === fallbackId ? { ...m, content: `I understand you want to create: "${userMessage.content}". Let me help you break this down into a comprehensive specification. Could you provide more details about the scope, target audience, and key features you have in mind?` } : m));
    } finally {
      setIsLoading(false);
    }
  };

  // Stream assistantText into the last assistant placeholder for this turn
  useEffect(() => {
    if (!assistantMsgIdRef.current) return;
    const base = assistantBaseRef.current || 0;
    const text = typeof assistantText === 'string' ? assistantText.slice(base) : '';
  if (!text) return;
  setMessages(prev => prev.map(m => m.id === assistantMsgIdRef.current ? { ...m, content: text } : m));
  }, [assistantText]);

  return (
    <div className={styles.chatPanel}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <div className={styles.status}>
            <div className={styles.statusIndicator}></div>
          </div>
        </div>
        <button className={styles.menuButton}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="12" cy="5" r="1"/>
            <circle cx="12" cy="19" r="1"/>
          </svg>
        </button>
      </div>

      <div className={styles.messagesContainer}>
        <div className={styles.messages}>
          {rtError && (
            <div className={`${styles.message} ${styles.assistant}`}>
              <div className={styles.messageContent}>
                <div className={styles.messageText}>
                  {rtError}
                </div>
              </div>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${styles[message.type]}`}
            >
              <div className={styles.messageAvatar}>
                {message.type === 'user' ? (
                  <div className={styles.userAvatar}>
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                ) : (
                  <div className={styles.assistantAvatar}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                      <path d="M2 17L12 22L22 17"/>
                      <path d="M2 12L12 17L22 12"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className={styles.messageContent}>
                <div className={styles.messageText}>
                  {message.content}
                </div>
                <div className={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.message} ${styles.assistant}`}>
              <div className={styles.messageAvatar}>
                <div className={styles.assistantAvatar}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                    <path d="M2 17L12 22L22 17"/>
                    <path d="M2 12L12 17L22 12"/>
                  </svg>
                </div>
              </div>
              <div className={styles.messageContent}>
                <div className={styles.typing}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.inputContainer}>
        <div className={styles.connectionHint}>
          {rtState === 'connected' ? (rtReady ? 'Realtime connected' : 'Finalizing…') : rtState === 'connecting' ? 'Connecting…' : 'Idle'}
        </div>
        <div className={styles.quickActions}>
          <button className={styles.quickAction}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <span>Create Spec</span>
          </button>
          <button className={styles.quickAction}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <rect x="9" y="9" width="6" height="6"/>
              <path d="M9 1v6"/>
              <path d="M15 1v6"/>
              <path d="M9 17v6"/>
              <path d="M15 17v6"/>
              <path d="M1 9h6"/>
              <path d="M17 9h6"/>
              <path d="M1 15h6"/>
              <path d="M17 15h6"/>
            </svg>
            <span>Add Feature</span>
          </button>
          <button className={styles.quickAction}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h4l3 3V8l-3 3z"/>
              <path d="M22 9L20 7"/>
              <path d="M22 7L20 9"/>
            </svg>
            <span>Review</span>
          </button>
        </div>
        
        <form onSubmit={handleSendMessage} className={styles.inputForm}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Describe your project or ask a question..."
              className={styles.messageInput}
              disabled={isLoading}
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={!inputMessage.trim() || isLoading}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22,2 15,22 11,13 2,9 22,2"/>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
