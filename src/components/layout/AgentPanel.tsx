import React, { useState, useRef, useEffect } from 'react';
import styles from './AgentPanel.module.css';
import { ChatPanel } from './ChatPanel';
import { VoicePanel } from './VoicePanel';

export const AgentPanel: React.FC = () => {
  const [mode, setMode] = useState<'chat' | 'voice'>(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('agent_mode') : null;
    return (saved === 'chat' || saved === 'voice') ? saved : 'voice';
  });

  useEffect(() => {
    try { window.localStorage.setItem('agent_mode', mode); } catch {}
  }, [mode]);

  return (
    <aside className={styles.panel}>
      <div className={styles.toggleRow}>
        <div className={styles.modeToggle} role="tablist" aria-label="Assistant mode">
          <button
            role="tab"
            aria-selected={mode === 'chat'}
            className={`${styles.modeBtn} ${mode === 'chat' ? styles.modeBtnActive : ''}`}
            onClick={() => setMode('chat')}
          >
            Chat
          </button>
          <button
            role="tab"
            aria-selected={mode === 'voice'}
            className={`${styles.modeBtn} ${mode === 'voice' ? styles.modeBtnActive : ''}`}
            onClick={() => setMode('voice')}
          >
            Voice
          </button>
        </div>
      </div>

      <div className={styles.host}>
        {mode === 'chat' ? <ChatPanel /> : <VoicePanel />}
      </div>
    </aside>
  );
};
