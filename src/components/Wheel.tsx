import { DownloadIcon, MicIcon, MoreIcon, PhoneIcon, UploadIcon } from './Icons';

export type WheelMode = 'library' | 'recording';

interface Props {
  mode: WheelMode;
  isRecording?: boolean;
  enabled: { download: boolean; more: boolean; upload: boolean; phone: boolean; center: boolean };
  onDownload: () => void;
  onMore: () => void;
  onUpload: () => void;
  onPhone: () => void;
  onCenter: () => void;
}

/** iPod 클릭휠 형태의 조작부 */
export function Wheel({ mode, isRecording, enabled, onDownload, onMore, onUpload, onPhone, onCenter }: Props) {
  const lib = mode === 'library';
  return (
    <div className={`wheel wheel--${mode}`}>
      {lib && (
        <>
          <button className="wheel-btn wheel-btn--top" disabled={!enabled.download} onClick={onDownload} aria-label="다운로드">
            <DownloadIcon />
          </button>
          <button className="wheel-btn wheel-btn--left" disabled={!enabled.more} onClick={onMore} aria-label="분석 정보">
            <MoreIcon />
          </button>
          <button className="wheel-btn wheel-btn--right" disabled={!enabled.upload} onClick={onUpload} aria-label="업로드">
            <UploadIcon />
          </button>
          <button className="wheel-btn wheel-btn--bottom" disabled={!enabled.phone} onClick={onPhone} aria-label="소음 신고">
            <PhoneIcon />
          </button>
        </>
      )}

      {lib ? (
        <button className="wheel-center wheel-center--mic" disabled={!enabled.center} onClick={onCenter} aria-label="녹음 시작">
          <span className="mic-face">
            <MicIcon />
          </span>
        </button>
      ) : (
        <button
          className="wheel-center wheel-center--rec"
          onClick={onCenter}
          aria-label={isRecording ? '녹음 종료' : '녹음 재개'}
        >
          {isRecording ? (
            <span className="rec-pause">
              <i />
              <i />
            </span>
          ) : (
            <span className="rec-dot" />
          )}
        </button>
      )}
    </div>
  );
}
