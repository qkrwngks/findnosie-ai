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
