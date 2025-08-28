import React, { useState, useEffect } from 'react';
import styles from './ProactiveAgentPanel.module.css';
import { ChatPanel } from './ChatPanel';
import { VoicePanel } from './VoicePanel';

type Suggestion = {
  id: string;
  text: string;
  icon?: React.ReactNode;
  action?: () => void;
};

export const ProactiveAgentPanel: React.FC = () => {
  const [mode, setMode] = useState<'chat' | 'voice'>(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('agent_mode') : null;
    return (saved === 'chat' || saved === 'voice') ? saved : 'voice';
  });

  const [isExpanded, setIsExpanded] = useState(true);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeState, setActiveState] = useState<'idle' | 'thinking' | 'speaking'>('idle');

  useEffect(() => {
    try { window.localStorage.setItem('agent_mode', mode); } catch {}
  }, [mode]);

  // Mock suggestions - in a real app, these would come from the AI based on context
  useEffect(() => {
    // These would typically be generated based on user context
    setSuggestions([
      {
        id: '1',
        text: 'Help me create requirements for my new project',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        )
      },
      {
        id: '2',
        text: 'Analyze my current project for compliance gaps',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        )
      },
      {
        id: '3',
        text: 'Prepare for my upcoming audit',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        )
      }
    ]);
  }, []);

  const handleSuggestionClick = (suggestion: Suggestion) => {
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

  return (
    <aside className={`${styles.panel} ${isExpanded ? '' : styles.collapsed}`}>
      <div className={styles.header}>
        <div className={styles.title}>
          <div className={`${styles.statusIndicator} ${styles[activeState]}`}>
            {activeState === 'thinking' && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
            )}
            {activeState === 'speaking' && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10z"/>
                <path d="M8 9.5v5m4-7v9m4-7v5"/>
              </svg>
            )}
            {activeState === 'idle' && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v.01"/>
                <path d="M12 12v-4"/>
              </svg>
            )}
          </div>
          <span>AI Assistant</span>
        </div>
        <div className={styles.controls}>
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
          <button 
            className={styles.toggleButton}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
          >
            {isExpanded ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="13 17 18 12 13 7"/>
                <polyline points="6 17 11 12 6 7"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="11 17 6 12 11 7"/>
                <polyline points="18 17 13 12 18 7"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {/* Proactive suggestions */}
        <div className={styles.suggestionsContainer}>
          <h3 className={styles.suggestionsTitle}>I can help you with:</h3>
          <div className={styles.suggestionsList}>
            {suggestions.map(suggestion => (
              <button 
                key={suggestion.id}
                className={styles.suggestionItem}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.icon}
                <span>{suggestion.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Regular chat/voice interface */}
        <div className={styles.interface}>
          {mode === 'chat' ? <ChatPanel /> : <VoicePanel />}
        </div>
      </div>
    </aside>
  );
};
