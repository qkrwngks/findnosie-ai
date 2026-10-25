import { WAVE_BARS_PER_SEC } from '../api/recordings';
import { formatTimer } from '../scale';
import { BackIcon } from './Icons';
import { Waveform } from './Waveform';

interface Props {
  isRecording: boolean;
  elapsed: number;
  amps: number[];
  onBack: () => void;
}

export function RecordingScreen({ isRecording, elapsed, amps, onBack }: Props) {
  return (
    <>
      <header className="screen-header">
        <button className="hdr-left" onClick={onBack} aria-label="뒤로">
          <BackIcon />
        </button>
        <h1>실시간 녹음</h1>
      </header>

      <div className="rec-timer">
        <span className={`rec-indicator${isRecording ? ' is-on' : ''}`} />
        <span className="rec-time">{formatTimer(elapsed)}</span>
      </div>

      <div className={`rec-band${isRecording ? ' is-recording' : ''}`}>
        <div className="rec-band-past" />
        <Waveform
          width={680}
          height={293}
          amps={amps}
          position={elapsed * WAVE_BARS_PER_SEC}
          spacing={9}
          maxRatio={0.37}
        />
        <div className="playhead" />
      </div>
    </>
  );
}
