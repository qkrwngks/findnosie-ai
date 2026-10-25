import { useCallback, useEffect, useRef, useState } from 'react';
import { WAVE_BARS_PER_SEC } from './api/recordings';

export const MIN_RECORD_SEC = 5;

/**
 * 실시간 녹음 상태. 마이크 권한이 있으면 실제 입력 레벨로 파형을 그리고,
 * 권한이 없거나 지원되지 않으면 가상 파형으로 대체한다.
 */
export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [amps, setAmps] = useState<number[]>([]);

  const elapsedRef = useRef(0);
  const ampsRef = useRef<number[]>([]);
  const lastTickRef = useRef(0);
  const rafRef = useRef(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  const sampleLevel = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) {
      const i = ampsRef.current.length;
      return Math.min(1, 0.15 + Math.min(1, i / 30) * (0.3 + Math.random() * 0.7));
    }
    const buf = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buf);
    let sum = 0;
    for (const v of buf) sum += v * v;
    return Math.min(1, Math.max(0.08, Math.sqrt(sum / buf.length) * 5));
  }, []);

  const loop = useCallback(
    (now: number) => {
      elapsedRef.current += (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;
      const want = Math.floor(elapsedRef.current * WAVE_BARS_PER_SEC);
      if (ampsRef.current.length < want) {
        const next = [...ampsRef.current];
        while (next.length < want) next.push(sampleLevel());
        ampsRef.current = next;
        setAmps(next);
      }
      setElapsed(elapsedRef.current);
      rafRef.current = requestAnimationFrame(loop);
    },
    [sampleLevel],
  );

  const resume = useCallback(() => {
    lastTickRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
    setIsRecording(true);
  }, [loop]);

  const pause = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setIsRecording(false);
  }, []);

  const releaseMic = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    ctxRef.current?.close().catch(() => {});
    streamRef.current = null;
    ctxRef.current = null;
    analyserRef.current = null;
  }, []);

  const start = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    elapsedRef.current = 0;
    ampsRef.current = [];
    setElapsed(0);
    setAmps([]);
    resume();

    if (!navigator.mediaDevices?.getUserMedia) return;
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const ctx = new AudioContext();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        ctx.createMediaStreamSource(stream).connect(analyser);
        streamRef.current = stream;
        ctxRef.current = ctx;
        analyserRef.current = analyser;
      })
      .catch(() => {
        /* 권한 거부 시 가상 파형 유지 */
      });
  }, [resume]);

  /** 녹음을 끝내고 결과를 돌려준다 */
  const finish = useCallback(() => {
    pause();
    releaseMic();
    return { duration: elapsedRef.current, amps: ampsRef.current };
  }, [pause, releaseMic]);

  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current);
      releaseMic();
    },
    [releaseMic],
  );

  return { isRecording, elapsed, amps, start, pause, resume, finish };
}
