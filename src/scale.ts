import { createContext, useEffect, useState } from 'react';

/** 시안 기준 크기 (1080x2340 원본을 923x2000으로 축소한 좌표계) */
export const DESIGN_W = 923;
export const DESIGN_H = 2000;

export const ScaleContext = createContext(1);

/** 뷰포트에 시안 전체가 들어가도록 하는 배율 */
export function useFitScale() {
  const calc = () => Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H);
  const [scale, setScale] = useState(calc);
  useEffect(() => {
    const onResize = () => setScale(calc());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return scale;
}

/** mm.ss.cc */
export function formatDotted(sec: number) {
  const cs = Math.floor(sec * 100 + 1e-6);
  const m = Math.floor(cs / 6000);
  const s = Math.floor((cs % 6000) / 100);
  const c = cs % 100;
  return `${pad(m)}.${pad(s)}.${pad(c)}`;
}

/** mm : ss . cc */
export function formatTimer(sec: number) {
  const [m, s, c] = formatDotted(sec).split('.');
  return `${m} : ${s} . ${c}`;
}

const pad = (n: number) => String(n).padStart(2, '0');
