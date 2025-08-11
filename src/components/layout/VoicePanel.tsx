import React, { useState, useRef, useEffect } from 'react';
import styles from './VoicePanel.module.css';

export const VoicePanel: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing'>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [timer, setTimer] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === 'listening') {
      timerRef.current = window.setInterval(() => setTimer((t) => t + 1), 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (status === 'idle') setTimer(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  const toggleListening = () => {
    if (status === 'idle') {
      setTranscript('');
      setStatus('listening');
    } else if (status === 'listening') {
      setStatus('processing');
      // Fake short processing delay
      setTimeout(() => setStatus('idle'), 900);
    } else {
      setStatus('idle');
    }
  };

  const mmss = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div className={styles.voicePanel}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h3>AI Voice Assistant</h3>
          <div className={styles.status}>
            <div className={`${styles.statusDot} ${styles[status]}`}></div>
            <span>
              {status === 'idle' && 'Idle'}
              {status === 'listening' && 'Listening'}
              {status === 'processing' && 'Processing'}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.visual}>
          <button
            className={`${styles.micButton} ${status === 'listening' ? styles.active : ''}`}
            onClick={toggleListening}
            aria-label={status === 'listening' ? 'Stop recording' : 'Start recording'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10a7 7 0 0 1-14 0"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </button>
          <div className={styles.waveBars} aria-hidden>
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className={`${styles.bar} ${status === 'listening' ? styles.animate : ''}`} style={{ animationDelay: `${(i % 12) * 0.05}s` }} />
            ))}
          </div>
          <div className={styles.timer}>{mmss(timer)}</div>
        </div>

        <div className={styles.transcript}>
          <div className={styles.transcriptHeader}>
            <h4>Transcript</h4>
            <div className={styles.actions}>
              <button className={styles.action} onClick={() => setTranscript('')}>
                Clear
              </button>
            </div>
          </div>
          <div className={styles.transcriptBody}>
            {transcript ? (
              <p>{transcript}</p>
            ) : (
              <p className={styles.placeholder}>Your voice transcript will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
