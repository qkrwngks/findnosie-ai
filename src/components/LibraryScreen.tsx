import type { Recording } from '../api/recordings';
import { CollapseIcon, ExpandIcon, FolderIcon } from './Icons';

interface Props {
  recordings: Recording[];
  selectedId: string | null;
  expanded: boolean;
  onSelect: (id: string) => void;
  onToggleExpand: () => void;
}

export function LibraryScreen({ recordings, selectedId, expanded, onSelect, onToggleExpand }: Props) {
  return (
    <>
      <header className="screen-header">
        <FolderIcon className="hdr-folder" aria-hidden />
        <h1>보관함</h1>
        <button className="hdr-right" onClick={onToggleExpand} aria-label={expanded ? '축소' : '확대'}>
          {expanded ? <CollapseIcon /> : <ExpandIcon />}
        </button>
      </header>
      <ul className="file-list" role="listbox" aria-label="녹음 파일 목록">
        {recordings.map((r) => (
          <li key={r.id}>
            <button
              role="option"
              aria-selected={r.id === selectedId}
              className={`file-row${r.id === selectedId ? ' is-selected' : ''}`}
              onClick={() => onSelect(r.id)}
            >
              {r.name}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
