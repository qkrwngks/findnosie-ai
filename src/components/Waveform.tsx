import { useContext, useEffect, useRef } from 'react';
import { ScaleContext } from '../scale';

interface Props {
  width: number;
  height: number;
  amps: number[];
  /** 플레이헤드 위치에 오는 막대 인덱스(소수 허용) */
  position: number;
  spacing?: number;
  barWidth?: number;
  /** 플레이헤드 x 좌표 (기본: 가운데) */
  headX?: number;
  /** 막대 최대 높이 비율 */
  maxRatio?: number;
}

/** 플레이헤드를 고정하고 파형이 흘러가는 막대형 파형 */
export function Waveform({
  width,
  height,
  amps,
  position,
  spacing = 9.5,
  barWidth = 4.5,
  headX = width / 2,
  maxRatio = 0.62,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const scale = useContext(ScaleContext);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ratio = (window.devicePixelRatio || 1) * scale;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f4f5f7';

    const mid = height / 2;
    const first = Math.max(0, Math.floor(position - headX / spacing) - 1);
    const last = Math.min(amps.length - 1, Math.ceil(position + (width - headX) / spacing) + 1);
    for (let i = first; i <= last; i++) {
      const x = headX + (i - position) * spacing - barWidth / 2;
      const h = Math.max(barWidth * 2, amps[i] * height * maxRatio);
      roundRect(ctx, x, mid - h / 2, barWidth, h, barWidth / 2);
    }
  }, [width, height, amps, position, spacing, barWidth, headX, maxRatio, scale]);

  return <canvas ref={ref} style={{ width, height, display: 'block' }} />;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.fill();
}
