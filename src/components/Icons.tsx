import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const FolderIcon = (p: P) => (
  <svg viewBox="0 0 60 54" {...p}>
    <path d="M6 4h16l6 7h26a5 5 0 0 1 5 5v31a5 5 0 0 1-5 5H6a5 5 0 0 1-5-5V9a5 5 0 0 1 5-5z" fill="#d3d5d8" />
    <path d="M1 18h58" stroke="#a9adb2" strokeWidth="2" />
  </svg>
);

export const ExpandIcon = (p: P) => (
  <svg viewBox="0 0 44 44" {...p} {...stroke} strokeWidth="4">
    <path d="M2 13V2h11M31 2h11v11M42 31v11H31M13 42H2V31" />
  </svg>
);

export const CollapseIcon = (p: P) => (
  <svg viewBox="0 0 54 54" {...p} {...stroke} strokeWidth="4.5">
    <path d="M22 4v18H4M32 4v18h18M50 32H32v18M4 32h18v18" />
  </svg>
);

export const BackIcon = (p: P) => (
  <svg viewBox="0 0 30 50" {...p} {...stroke} strokeWidth="4.5">
    <path d="M26 3L4 25l22 22" />
  </svg>
);

export const MicIcon = (p: P) => (
  <svg viewBox="0 0 60 92" {...p} {...stroke} strokeWidth="7">
    <rect x="17" y="4" width="26" height="50" rx="13" fill="currentColor" stroke="none" />
    <path d="M6 42a24 24 0 0 0 48 0M30 66v20M14 87h32" />
  </svg>
);

export const DownloadIcon = (p: P) => (
  <svg viewBox="0 0 44 44" {...p} {...stroke} strokeWidth="3">
    <path d="M22 3v26M11 18l11 11 11-11M3 31v9h38v-9" />
  </svg>
);

export const UploadIcon = (p: P) => (
  <svg viewBox="0 0 44 44" {...p} {...stroke} strokeWidth="3">
    <path d="M22 29V3M11 14L22 3l11 11M3 31v9h38v-9" />
  </svg>
);

export const MoreIcon = (p: P) => (
  <svg viewBox="0 0 44 10" {...p}>
    <circle cx="5" cy="5" r="4.5" fill="currentColor" />
    <circle cx="22" cy="5" r="4.5" fill="currentColor" />
    <circle cx="39" cy="5" r="4.5" fill="currentColor" />
  </svg>
);

export const PhoneIcon = (p: P) => (
  <svg viewBox="0 0 44 44" {...p} {...stroke} strokeWidth="3">
    <path d="M14 3l5 10-5 4c2.5 6 7 10.5 13 13l4-5 10 5-2 8c-.4 1.6-2 2.8-3.7 2.6C18 38.8 5.2 26 3.4 9.7 3.2 8 4.4 6.4 6 6z" />
  </svg>
);

export const PlayIcon = (p: P) => (
  <svg viewBox="0 0 40 44" {...p}>
    <path d="M2 3.5v37a2 2 0 0 0 3 1.7l32-18.5a2 2 0 0 0 0-3.4L5 1.8A2 2 0 0 0 2 3.5z" fill="currentColor" />
  </svg>
);

export const PauseIcon = (p: P) => (
  <svg viewBox="0 0 40 46" {...p}>
    <rect x="2" y="1" width="12" height="44" rx="2" fill="currentColor" />
    <rect x="26" y="1" width="12" height="44" rx="2" fill="currentColor" />
  </svg>
);

export const BrandIcon = (p: P) => (
  <svg viewBox="0 0 28 28" {...p}>
    <rect width="28" height="28" rx="4" fill="#9aa1a6" />
    <rect x="11" y="5" width="6" height="11" rx="3" fill="#eef0ef" />
    <path d="M7 13a7 7 0 0 0 14 0M14 20v4M9 24h10" fill="none" stroke="#eef0ef" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
