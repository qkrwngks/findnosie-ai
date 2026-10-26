import { useContext, useEffect, useRef } from 'react';
import { ScaleContext } from '../scale';

/** 막대 간격 기본값. 드래그 탐색 계산에서도 같은 값을 쓴다 */
export const BAR_SPACING = 9.5;
const BAR_WIDTH = 4.5;

interface Props {
  width: number;
  height: number;
  amps: number[];
  /** 플레이헤드 위치에 오는 막대 인덱스(소수 허용) */
  position: number;
  spacing?: number;
  /** 막대 최대 높이 비율 */
  maxRatio?: number;
}

/** 플레이헤드를 가운데 고정하고 파형이 흘러가는 막대형 파형 */
export function Waveform({ width, height, amps, position, spacing = BAR_SPACING, maxRatio = 0.62 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const scale = useContext(ScaleContext);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ratio = (window.devicePixelRatio || 1) * scale;
    const w = Math.round(width * ratio);
    const h = Math.round(height * ratio);
    // 크기를 다시 대입하면 백버퍼가 재할당되므로 바뀔 때만 설정
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f4f5f7';

    const headX = width / 2;
    const mid = height / 2;
    const first = Math.max(0, Math.floor(position - headX / spacing) - 1);
    const last = Math.min(amps.length - 1, Math.ceil(position + (width - headX) / spacing) + 1);
    ctx.beginPath();
    for (let i = first; i <= last; i++) {
      const x = headX + (i - position) * spacing - BAR_WIDTH / 2;
      const barH = Math.max(BAR_WIDTH * 2, amps[i] * height * maxRatio);
      ctx.roundRect(x, mid - barH / 2, BAR_WIDTH, barH, BAR_WIDTH / 2);
    }
    ctx.fill();
  }, [width, height, amps, position, spacing, maxRatio, scale]);

  return <canvas ref={ref} style={{ width, height, display: 'block' }} />;
}
