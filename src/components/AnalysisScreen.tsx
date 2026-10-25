import { useContext, useEffect, useRef, useState } from 'react';
import { fetchAnalysis, WAVE_BARS_PER_SEC, type Analysis, type Recording } from '../api/recordings';
import { formatDotted, ScaleContext } from '../scale';
import { BackIcon, PauseIcon, PlayIcon } from './Icons';
import { Waveform } from './Waveform';

type PlayState = 'idle' | 'playing' | 'paused';

const SPACING = 9.5;

interface Props {
  recording: Recording;
  onBack: () => void;
}

export function AnalysisScreen({ recording, onBack }: Props) {
  const scale = useContext(ScaleContext);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [state, setState] = useState<PlayState>('idle');
  const [time, setTime] = useState(0);
  const timeRef = useRef(0);
  const dragRef = useRef<{ x: number; t: number; wasPlaying: boolean } | null>(null);

  useEffect(() => {
    let alive = true;
    setAnalysis(null);
    fetchAnalysis(recording).then((a) => alive && setAnalysis(a));
    return () => {
      alive = false;
    };
  }, [recording]);

  const seek = (t: number) => {
    timeRef.current = Math.min(recording.duration, Math.max(0, t));
    setTime(timeRef.current);
  };

  useEffect(() => {
    if (state !== 'playing') return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const next = timeRef.current + (now - last) / 1000;
      last = now;
      if (next >= recording.duration) {
        seek(0);
        setState('idle');
        return;
      }
      seek(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state, recording.duration]);

  const togglePlay = () => setState((s) => (s === 'playing' ? 'paused' : 'playing'));

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, t: timeRef.current, wasPlaying: state === 'playing' };
    if (state === 'playing') setState('paused');
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = (e.clientX - d.x) / scale;
    seek(d.t - dx / (SPACING * WAVE_BARS_PER_SEC));
    if (state === 'idle' && Math.abs(dx) > 2) setState('paused');
  };
  const onPointerUp = () => {
    const d = dragRef.current;
    dragRef.current = null;
    if (d?.wasPlaying) setState('playing');
  };

  return (
    <>
      <header className="screen-header">
        <button className="hdr-left" onClick={onBack} aria-label="뒤로">
          <BackIcon />
        </button>
        <h1>분석 결과</h1>
      </header>

      <section className="an-card">
        <h2 className="an-title">{recording.name}</h2>

        <div className={`player player--${state}`}>
          <div className="player-top">
            <button className="player-btn" onClick={togglePlay} aria-label={state === 'playing' ? '일시정지' : '재생'}>
              {state === 'playing' ? <PauseIcon /> : <PlayIcon />}
            </button>
            {state === 'idle' ? (
              <span className="player-time">{formatDotted(recording.duration)}</span>
            ) : (
              <>
                <span className="player-time player-time--current">{formatDotted(time)}</span>
                <span className="player-total">({formatDotted(recording.duration)})</span>
              </>
            )}
          </div>
          <div
            className="player-band"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <Waveform width={749} height={182} amps={recording.amps} position={time * WAVE_BARS_PER_SEC} spacing={SPACING} />
            <div className="playhead" />
          </div>
        </div>

        <div className="an-stats">
          <div className="an-stat">
            <span className="an-label">소음 크기</span>
            <span className="an-value">
              {analysis ? analysis.db : '--'}
              <small>dB</small>
            </span>
          </div>
          <div className="an-divider" />
          <div className="an-stat">
            <span className="an-label">소음 원인</span>
            <span className="an-value an-value--cause">{analysis ? analysis.cause : '분석 중'}</span>
          </div>
        </div>
      </section>
    </>
  );
}
