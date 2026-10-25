import { useEffect, useRef, useState } from 'react';
import { fetchRecordings, saveRecording, uploadRecording, type Recording } from './api/recordings';
import { AnalysisScreen } from './components/AnalysisScreen';
import { BrandIcon, DownloadIcon, MoreIcon, PhoneIcon, UploadIcon } from './components/Icons';
import { LibraryScreen } from './components/LibraryScreen';
import { RecordingScreen } from './components/RecordingScreen';
import { Wheel } from './components/Wheel';
import { DESIGN_H, DESIGN_W, ScaleContext, useFitScale } from './scale';
import { MIN_RECORD_SEC, useRecorder } from './useRecorder';

type View = 'library' | 'recording' | 'analysis';

export function App() {
  const scale = useFitScale();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [view, setView] = useState<View>('library');
  const [expanded, setExpanded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const recorder = useRecorder();

  useEffect(() => {
    fetchRecordings().then(setRecordings);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const selected = recordings.find((r) => r.id === selectedId) ?? null;
  // 분석 결과는 항상 확대 레이아웃, 녹음은 항상 기본 레이아웃
  const isExpandedLayout = view === 'analysis' || (view === 'library' && expanded);
  const hasSelection = selected !== null;

  const enabled =
    view === 'library'
      ? {
          download: hasSelection,
          more: hasSelection,
          upload: !expanded && !hasSelection,
          phone: !expanded && !hasSelection,
          center: !expanded,
        }
      : { download: false, more: false, upload: false, phone: false, center: view === 'recording' };

  const startRecording = () => {
    setSelectedId(null);
    setView('recording');
    recorder.start();
  };

  const leaveRecording = async () => {
    const { duration, amps } = recorder.finish();
    setView('library');
    if (duration < MIN_RECORD_SEC) {
      setToast(`${MIN_RECORD_SEC}초 미만 녹음은 저장되지 않아요`);
      return;
    }
    const rec = await saveRecording(duration, amps);
    setRecordings((list) => [...list, rec]);
    setToast(`${rec.name}이(가) 보관함에 저장됐어요`);
  };

  const onCenter = () => {
    if (view === 'library') startRecording();
    else if (view === 'recording') (recorder.isRecording ? recorder.pause : recorder.resume)();
  };

  const onUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const rec = await uploadRecording(file);
    setRecordings((list) => [...list, rec]);
    setToast(`${rec.name} 업로드 완료`);
  };

  const hint =
    view === 'recording'
      ? recorder.elapsed >= MIN_RECORD_SEC
        ? '뒤로 가면 녹음이 보관함에 저장돼요'
        : `분석하려면 ${MIN_RECORD_SEC}초 이상 녹음해주세요`
      : isExpandedLayout
        ? '녹음본을 확인하고 다운로드하세요'
        : '가운데 버튼을 눌러 녹음을 시작하세요';

  return (
    <ScaleContext.Provider value={scale}>
      <div className="viewport">
        <div className="stage-box" style={{ width: DESIGN_W * scale, height: DESIGN_H * scale }}>
          <div
            className={`device ${isExpandedLayout ? 'layout-expanded' : 'layout-normal'} view-${view}`}
            style={{ transform: `scale(${scale})` }}
          >
            <div className="body" />

            <div className="brand">
              <BrandIcon className="brand-icon" />
              <span>
                <b>Findnosie</b> AI
              </span>
            </div>

            <div className="bezel">
              <div className="screen">
                {view === 'library' && (
                  <LibraryScreen
                    recordings={recordings}
                    selectedId={selectedId}
                    expanded={expanded}
                    onSelect={(id) => setSelectedId((cur) => (cur === id ? null : id))}
                    onToggleExpand={() => setExpanded((v) => !v)}
                  />
                )}
                {view === 'recording' && (
                  <RecordingScreen
                    isRecording={recorder.isRecording}
                    elapsed={recorder.elapsed}
                    amps={recorder.amps}
                    onBack={leaveRecording}
                  />
                )}
                {view === 'analysis' && selected && (
                  <AnalysisScreen recording={selected} onBack={() => setView('library')} />
                )}
              </div>
            </div>

            <p className="hint" style={{ opacity: toast ? 0 : 1 }}>
              {hint}
            </p>

            <Wheel
              mode={view === 'recording' ? 'recording' : 'library'}
              isRecording={recorder.isRecording}
              enabled={enabled}
              onDownload={() => selected && setToast(`${selected.name} 다운로드를 시작합니다`)}
              onMore={() => selected && setView('analysis')}
              onUpload={() => uploadRef.current?.click()}
              onPhone={() => setToast('소음 신고 기능은 준비 중이에요')}
              onCenter={onCenter}
            />

            {view === 'recording' ? (
              <div className="rec-label">
                {recorder.isRecording ? (
                  <>
                    <span className="rec-label-pause">
                      <i />
                      <i />
                    </span>
                    종료
                  </>
                ) : (
                  <>
                    <span className="rec-label-dot" />
                    재개
                  </>
                )}
              </div>
            ) : (
              <div className="legend">
                <ul>
                  <li>
                    <DownloadIcon /> 다운로드
                  </li>
                  <li>
                    <MoreIcon /> 분석 정보
                  </li>
                </ul>
                <ul>
                  <li>
                    <UploadIcon /> 업로드
                  </li>
                  <li>
                    <PhoneIcon /> 소음 신고
                  </li>
                </ul>
              </div>
            )}

            <div className="footer">
              <span>LISTEN / FIND</span>
              <span className="footer-dots">
                {Array.from({ length: 9 }, (_, i) => (
                  <i key={i} />
                ))}
              </span>
            </div>

            {toast && <div className="toast">{toast}</div>}
          </div>
        </div>
        <input ref={uploadRef} type="file" accept="audio/*" hidden onChange={onUploadFile} />
      </div>
    </ScaleContext.Provider>
  );
}
