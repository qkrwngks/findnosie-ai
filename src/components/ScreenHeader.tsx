import { BackIcon } from './Icons';

interface Props {
  title: string;
  onBack: () => void;
}

/** 뒤로 버튼 + 제목 헤더 */
export function ScreenHeader({ title, onBack }: Props) {
  return (
    <header className="screen-header">
      <button className="hdr-left" onClick={onBack} aria-label="뒤로">
        <BackIcon />
      </button>
      <h1>{title}</h1>
    </header>
  );
}
