import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useVoiceSession } from '@/hooks/useVoiceSession';
import { voiceApi } from '@/api/services';
import { useRealtimeOpenAI } from '@/hooks/useRealtimeOpenAI';
import { useRealtimeGemini } from '@/hooks/useRealtimeGemini';
import { useRealtimeMeshWS } from '@/hooks/useRealtimeMeshWS';
import styles from './VoicePanel.module.css';
export const VoicePanel = () => {
    const { projectId } = useParams();
    const { session, start: startSession, end: endSession, loading: sessionLoading, error: sessionError } = useVoiceSession();
    const [status, setStatus] = useState('idle');
    const [transcript, setTranscript] = useState('');
    const [timer, setTimer] = useState(0);
    const timerRef = useRef(null);
    const [rippleId, setRippleId] = useState(0);
    const [wakeSound, setWakeSound] = useState(true);
    const [volume, setVolume] = useState(0);
    const [micError, setMicError] = useState(null);
    const audioCtxRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const rafRef = useRef(null);
    const openaiRT = useRealtimeOpenAI();
    const geminiRT = useRealtimeGemini();
    const meshWSRT = useRealtimeMeshWS();
    const isGemini = !!(session && (session.instructions?.provider_parameters?.provider === 'gemini' || session.provider?.includes('gemini')));
    const useMeshWS = !!(session && ((session.provider === 'gemini_ws') || session.provider_url?.startsWith('ws://') || session.provider_url?.startsWith('wss:')));
    const chosen = useMeshWS ? meshWSRT : (isGemini ? geminiRT : openaiRT);
    const { state: rtState, error: rtError, assistantText, connect, disconnect } = chosen;
    const remoteAudioRef = useRef(null);
    useEffect(() => {
        if (status === 'listening') {
            timerRef.current = window.setInterval(() => setTimer((t) => t + 1), 1000);
        }
        else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            if (status === 'idle')
                setTimer(0);
        }
        return () => {
            if (timerRef.current)
                clearInterval(timerRef.current);
        };
    }, [status]);
    // Handle microphone start/stop and analysis (and start realtime connection if session is ready)
    useEffect(() => {
        const startMic = async () => {
            try {
                setMicError(null);
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaStreamRef.current = stream;
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
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
                    }
                    catch { }
                }
                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                const tick = () => {
                    if (!analyserRef.current)
                        return;
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
                        const resp = await connect(session, stream);
                        const remoteStream = resp?.remoteStream;
                        const audioEl = resp?.audioEl;
                        if (audioEl) {
                            remoteAudioRef.current = audioEl;
                        }
                        if (remoteStream) {
                            if (!remoteAudioRef.current)
                                remoteAudioRef.current = new Audio();
                            remoteAudioRef.current.srcObject = remoteStream;
                            remoteAudioRef.current.autoplay = true;
                            remoteAudioRef.current.muted = false;
                            // Attempt to play (might be blocked; user interacted via click already)
                            remoteAudioRef.current.play().catch(() => { });
                        }
                    }
                }
                catch (e) {
                    setMicError(e?.message || 'Realtime connect failed');
                }
            }
            catch (err) {
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
            }
            catch { }
            setVolume(0);
        };
        if (status === 'listening') {
            startMic();
        }
        else {
            stopMic();
            disconnect();
        }
        return () => { stopMic(); };
    }, [status, wakeSound, session]);
    // Cleanup on page hide/unload: end session and disconnect
    useEffect(() => {
        const handleBeforeUnload = () => {
            try {
                disconnect();
            }
            catch { }
            try {
                endSession();
            }
            catch { }
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
            }
            catch (e) {
                setMicError(sessionError || 'Failed to start voice session');
                return;
            }
            setTranscript('');
            setStatus('listening');
        }
        else if (status === 'listening') {
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
                }
                catch { }
                try {
                    await endSession();
                }
                catch { }
            }, 900);
        }
        else {
            setStatus('idle');
            try {
                await endSession();
            }
            catch { }
        }
    };
    const mmss = (s) => {
        const m = Math.floor(s / 60).toString().padStart(2, '0');
        const sec = (s % 60).toString().padStart(2, '0');
        return `${m}:${sec}`;
    };
    return (_jsxs("div", { className: styles.voicePanel, children: [_jsx("div", { className: styles.header, children: _jsxs("div", { className: styles.headerInfo, children: [_jsx("h3", { children: "AI Voice Assistant" }), _jsxs("div", { className: styles.status, children: [_jsx("div", { className: `${styles.statusDot} ${styles[status]}` }), _jsxs("span", { children: [status === 'idle' && 'Idle', status === 'listening' && 'Listening', status === 'processing' && 'Processing'] }), import.meta.env?.DEV && session && (_jsx("span", { className: `${styles.provider} ${isGemini ? styles.gemini : styles.openai}`, children: isGemini ? 'Gemini' : 'OpenAI' }))] })] }) }), _jsxs("div", { className: styles.body, children: [_jsxs("div", { className: styles.orbStage, children: [_jsxs("div", { className: `${styles.orb} ${status === 'listening' ? styles.orbActive : ''} ${status === 'processing' ? styles.orbProcessing : ''}`, style: { ['--vu']: volume.toFixed(2) }, onClick: toggleListening, role: "button", "aria-label": status === 'listening' ? 'Stop recording' : 'Start recording', tabIndex: 0, onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    toggleListening();
                                } }, children: [_jsx("div", { className: styles.orbCore }), rippleId > 0 && _jsx("span", { className: styles.ripple, "aria-hidden": true }, rippleId), _jsxs("svg", { className: styles.wave, viewBox: "0 0 400 400", preserveAspectRatio: "xMidYMid meet", "aria-hidden": true, children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "grad", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", stopColor: "#2EE5FF" }), _jsx("stop", { offset: "100%", stopColor: "#7C3AED" })] }), _jsxs("filter", { id: "glow", children: [_jsx("feGaussianBlur", { stdDeviation: "3.5", result: "coloredBlur" }), _jsxs("feMerge", { children: [_jsx("feMergeNode", { in: "coloredBlur" }), _jsx("feMergeNode", { in: "SourceGraphic" })] })] })] }), _jsx("path", { className: `${status === 'listening' ? styles.waveAnim : ''}`, d: "M 40 200 C 120 120, 280 280, 360 200", stroke: "url(#grad)", strokeWidth: "3", fill: "none", filter: "url(#glow)" }), _jsx("path", { className: `${status === 'listening' ? styles.waveAnimSlow : ''}`, d: "M 40 220 C 150 160, 250 240, 360 220", stroke: "url(#grad)", strokeWidth: "2", fill: "none", opacity: "0.7", filter: "url(#glow)" })] })] }), _jsx("div", { className: styles.prompt, children: transcript || "What's the price of hoverboard ...." }), _jsx("div", { className: styles.listeningText, children: status === 'listening' ? 'Listening...' : status === 'processing' ? 'Processing...' : 'Tap to speak' }), sessionLoading && _jsx("div", { className: styles.timer, children: "Connecting..." }), rtError && _jsx("div", { className: styles.micError, role: "alert", children: rtError }), _jsx("div", { className: styles.vuBars, "aria-hidden": true, children: Array.from({ length: 16 }).map((_, i) => {
                                    const h = 8 + Math.round(volume * 36 * (0.5 + 0.5 * Math.sin(i * 0.6)));
                                    return _jsx("span", { className: styles.vu, style: { height: `${h}px`, opacity: 0.7 + volume * 0.3 } }, i);
                                }) }), _jsx("button", { className: `${styles.fabMic} ${status === 'listening' ? styles.active : ''}`, onClick: toggleListening, "aria-label": status === 'listening' ? 'Stop recording' : 'Start recording', children: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M12 1a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" }), _jsx("path", { d: "M19 10a7 7 0 0 1-14 0" }), _jsx("line", { x1: "12", y1: "19", x2: "12", y2: "23" }), _jsx("line", { x1: "8", y1: "23", x2: "16", y2: "23" })] }) }), _jsx("div", { className: styles.timer, children: mmss(timer) }), (micError || sessionError) && _jsx("div", { className: styles.micError, role: "alert", children: micError || sessionError })] }), _jsxs("div", { className: styles.transcript, children: [_jsxs("div", { className: styles.transcriptHeader, children: [_jsx("h4", { children: "Transcript" }), _jsxs("div", { className: styles.actions, children: [_jsxs("label", { className: styles.toggle, title: "Play wake sound when starting listening", children: [_jsx("input", { type: "checkbox", checked: wakeSound, onChange: (e) => setWakeSound(e.target.checked) }), _jsx("span", { children: "Wake sound" })] }), _jsx("button", { className: styles.action, onClick: () => setTranscript(''), children: "Clear" })] })] }), _jsxs("div", { className: styles.transcriptBody, children: [transcript && _jsx("p", { children: transcript }), assistantText && _jsxs("p", { children: [_jsx("strong", { children: "Assistant:" }), " ", assistantText] }), !transcript && !assistantText && (_jsx("p", { className: styles.placeholder, children: "Your voice transcript will appear here." }))] })] })] })] }));
};
