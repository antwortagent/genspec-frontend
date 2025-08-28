import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useVoiceSession } from '@/hooks/useVoiceSession';
import { voiceApi } from '@/api/services';
import { useRealtimeOpenAI } from '@/hooks/useRealtimeOpenAI';
import { useRealtimeGemini } from '@/hooks/useRealtimeGemini';
import { useRealtimeMeshWS } from '@/hooks/useRealtimeMeshWS';
import styles from './VoicePanel.module.css';

export const VoicePanel: React.FC = () => {
  const { projectId } = useParams();
  const { session, start: startSession, end: endSession, loading: sessionLoading, error: sessionError } = useVoiceSession();
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing'>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [timer, setTimer] = useState<number>(0);
  const timerRef = useRef<number | null>(null);
  const [rippleId, setRippleId] = useState(0);
  const [wakeSound, setWakeSound] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0);
  const [micError, setMicError] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const openaiRT = useRealtimeOpenAI();
  const geminiRT = useRealtimeGemini();
  const meshWSRT = useRealtimeMeshWS();
  const isGemini = !!(session && ((session as any).instructions?.provider_parameters?.provider === 'gemini' || (session as any).provider?.includes('gemini')));
  const useMeshWS = !!(session && (((session as any).provider === 'gemini_ws') || (session as any).provider_url?.startsWith('ws://') || (session as any).provider_url?.startsWith('wss:')));
  const chosen = useMeshWS ? meshWSRT : (isGemini ? geminiRT : openaiRT);
  const { state: rtState, error: rtError, assistantText, connect, disconnect } = chosen;
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

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

  // Handle microphone start/stop and analysis (and start realtime connection if session is ready)
  useEffect(() => {
    const startMic = async () => {
      try {
        setMicError(null);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtxRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        analyserRef.current = analyser;
        const source = ctx.createMediaStreamSource(stream);
        sourceRef.current = source;
        source.connect(analyser);

        // Optional wake sound
        if (wakeSound) {
          try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = 880; // A5
            gain.gain.setValueAtTime(0.0001, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
            osc.connect(gain).connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
          } catch {}
        }

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteTimeDomainData(dataArray);
          // Compute RMS to approximate volume
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const v = (dataArray[i] - 128) / 128; // -1..1
            sum += v * v;
          }
          const rms = Math.sqrt(sum / dataArray.length);
          // Smooth and clamp 0..1
          const smoothed = Math.min(1, Math.max(0, rms * 2));
          setVolume((prev) => prev * 0.6 + smoothed * 0.4);
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();

        // After mic is ready and we have a session, connect to provider for realtime replies
        try {
          if (session) {
            const resp: any = await connect(session as any, stream);
            const remoteStream = resp?.remoteStream;
            const audioEl = resp?.audioEl;
            if (audioEl) {
              remoteAudioRef.current = audioEl;
            }
            if (remoteStream) {
              if (!remoteAudioRef.current) remoteAudioRef.current = new Audio();
              remoteAudioRef.current.srcObject = remoteStream as any;
              remoteAudioRef.current.autoplay = true;
              remoteAudioRef.current.muted = false;
              // Attempt to play (might be blocked; user interacted via click already)
              remoteAudioRef.current.play().catch(() => {});
            }
          }
        } catch (e: any) {
          setMicError(e?.message || 'Realtime connect failed');
        }
      } catch (err: any) {
        setMicError('Microphone unavailable');
        setVolume(0);
      }
    };

    const stopMic = async () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
      try {
        if (sourceRef.current) {
          sourceRef.current.disconnect();
          sourceRef.current = null;
        }
        if (analyserRef.current) {
          analyserRef.current.disconnect();
          analyserRef.current = null;
        }
        if (audioCtxRef.current) {
          await audioCtxRef.current.close();
          audioCtxRef.current = null;
        }
      } catch {}
      setVolume(0);
    };

    if (status === 'listening') {
      startMic();
    } else {
      stopMic();
      disconnect();
    }
    return () => { stopMic(); };
  }, [status, wakeSound, session]);

  // Cleanup on page hide/unload: end session and disconnect
  useEffect(() => {
    const handleBeforeUnload = () => {
      try { disconnect(); } catch {}
      try { endSession(); } catch {}
    };
    window.addEventListener('pagehide', handleBeforeUnload);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('pagehide', handleBeforeUnload);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [disconnect, endSession]);

  const toggleListening = async () => {
  setRippleId((n) => n + 1);
    if (status === 'idle') {
      if (!projectId) {
        setMicError('Open a project to start a voice session.');
        return;
      }
      try {
        if (!session) {
          await startSession(projectId);
        }
      } catch (e:any) {
        setMicError(sessionError || 'Failed to start voice session');
        return;
      }
      setTranscript('');
      setStatus('listening');
    } else if (status === 'listening') {
      setStatus('processing');
      // Fake short processing delay
      setTimeout(async () => {
        setStatus('idle');
        try {
          if (session && transcript.trim()) {
            await voiceApi.submitTranscripts(session.session_id, [
              { speaker: 'user', text: transcript }
            ]);
          }
        } catch {}
        try { await endSession(); } catch {}
      }, 900);
    } else {
      setStatus('idle');
      try { await endSession(); } catch {}
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
            {import.meta.env?.DEV && session && (
              <span className={`${styles.provider} ${isGemini ? styles.gemini : styles.openai}`}>
                {isGemini ? 'Gemini' : 'OpenAI'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.orbStage}>
          <div className={`${styles.orb} ${status === 'listening' ? styles.orbActive : ''} ${status === 'processing' ? styles.orbProcessing : ''}`}
               style={{ ['--vu' as any]: volume.toFixed(2) }}
               onClick={toggleListening}
               role="button"
               aria-label={status === 'listening' ? 'Stop recording' : 'Start recording'}
         tabIndex={0}
         onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleListening(); } }}>
            <div className={styles.orbCore}></div>
      {/* Tap ripple */}
      {rippleId > 0 && <span key={rippleId} className={styles.ripple} aria-hidden />}
            <svg className={styles.wave} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" aria-hidden>
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2EE5FF"/>
                  <stop offset="100%" stopColor="#7C3AED"/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <path
                className={`${status === 'listening' ? styles.waveAnim : ''}`}
                d="M 40 200 C 120 120, 280 280, 360 200"
                stroke="url(#grad)"
                strokeWidth="3"
                fill="none"
                filter="url(#glow)"
              />
              <path
                className={`${status === 'listening' ? styles.waveAnimSlow : ''}`}
                d="M 40 220 C 150 160, 250 240, 360 220"
                stroke="url(#grad)"
                strokeWidth="2"
                fill="none"
                opacity="0.7"
                filter="url(#glow)"
              />
            </svg>
          </div>
          <div className={styles.prompt}>{transcript || "What's the price of hoverboard ...."}</div>
          <div className={styles.listeningText}>
            {status === 'listening' ? 'Listening...' : status === 'processing' ? 'Processing...' : 'Tap to speak'}
          </div>
          {sessionLoading && <div className={styles.timer}>Connecting...</div>}
          {rtError && <div className={styles.micError} role="alert">{rtError}</div>}
          <div className={styles.vuBars} aria-hidden>
            {Array.from({ length: 16 }).map((_, i) => {
              const h = 8 + Math.round(volume * 36 * (0.5 + 0.5 * Math.sin(i * 0.6)));
              return <span key={i} className={styles.vu} style={{ height: `${h}px`, opacity: 0.7 + volume * 0.3 }} />;
            })}
          </div>
          <button
            className={`${styles.fabMic} ${status === 'listening' ? styles.active : ''}`}
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
          <div className={styles.timer}>{mmss(timer)}</div>
          {(micError || sessionError) && <div className={styles.micError} role="alert">{micError || sessionError}</div>}
        </div>

        <div className={styles.transcript}>
          <div className={styles.transcriptHeader}>
            <h4>Transcript</h4>
            <div className={styles.actions}>
              <label className={styles.toggle} title="Play wake sound when starting listening">
                <input type="checkbox" checked={wakeSound} onChange={(e) => setWakeSound(e.target.checked)} />
                <span>Wake sound</span>
              </label>
              <button className={styles.action} onClick={() => setTranscript('')}>
                Clear
              </button>
            </div>
          </div>
          <div className={styles.transcriptBody}>
            {transcript && <p>{transcript}</p>}
            {assistantText && <p><strong>Assistant:</strong> {assistantText}</p>}
            {!transcript && !assistantText && (
              <p className={styles.placeholder}>Your voice transcript will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
