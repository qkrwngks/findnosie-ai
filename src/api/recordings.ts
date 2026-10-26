// 백엔드 연동 전까지 사용하는 목(mock) API.
// 실제 서버가 준비되면 이 파일의 함수 본문만 fetch 호출로 교체하면 된다.

export interface Recording {
  id: string;
  name: string;
  /** 초 단위 길이 */
  duration: number;
  /** 파형 진폭(0~1), WAVE_BARS_PER_SEC 간격 */
  amps: number[];
}

export interface Analysis {
  recordingId: string;
  db: number;
  cause: string;
}

export const WAVE_BARS_PER_SEC = 8;

const CAUSES = ['세탁기', '발걸음', '청소기', '음악', '대화 소리', '공사', '반려동물'];

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

/** 디자인 시안처럼 작게 시작해서 점점 커지는 파형을 결정적으로 생성 */
function generateAmps(duration: number, seed: number): number[] {
  const rand = seeded(seed);
  const n = Math.max(1, Math.round(duration * WAVE_BARS_PER_SEC));
  const amps: number[] = [];
  for (let i = 0; i < n; i++) {
    const ramp = Math.min(1, i / 30);
    const swell = 0.55 + 0.45 * Math.sin(i / 23 + seed);
    const v = 0.12 + ramp * swell * (0.25 + rand() * 0.75);
    amps.push(Math.min(1, v));
  }
  return amps;
}

let store: Recording[] = Array.from({ length: 7 }, (_, i) => {
  const duration = 309.09 + (i - 1) * 23.4;
  return { id: `rec-${i + 1}`, name: `녹음 파일 ${i + 1}`, duration, amps: generateAmps(duration, i + 1) };
});

const analyses = new Map<string, Analysis>([
  ['rec-2', { recordingId: 'rec-2', db: 85, cause: '세탁기' }],
]);

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchRecordings(): Promise<Recording[]> {
  await delay(120);
  return [...store];
}

export async function fetchAnalysis(rec: Recording): Promise<Analysis> {
  await delay(250);
  let a = analyses.get(rec.id);
  if (!a) {
    const peak = rec.amps.reduce((m, v) => Math.max(m, v), 0);
    const rand = seeded(rec.id.length * 97 + Math.round(rec.duration * 100));
    a = {
      recordingId: rec.id,
      db: Math.round(45 + peak * 45),
      cause: CAUSES[Math.floor(rand() * CAUSES.length)],
    };
    analyses.set(rec.id, a);
  }
  return a;
}

export async function saveRecording(duration: number, amps: number[], name?: string): Promise<Recording> {
  await delay(150);
  const rec: Recording = {
    id: `rec-${Date.now()}`,
    name: name ?? `녹음 파일 ${store.length + 1}`,
    duration,
    amps,
  };
  store = [...store, rec];
  return rec;
}

export async function uploadRecording(file: File): Promise<Recording> {
  const duration = await new Promise<number>((resolve) => {
    const audio = new Audio();
    const url = URL.createObjectURL(file);
    audio.preload = 'metadata';
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(audio.duration) ? audio.duration : 30);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(30);
    };
    audio.src = url;
  });
  const name = file.name.replace(/\.[^.]+$/, '');
  return saveRecording(duration, generateAmps(duration, file.size), name);
}
