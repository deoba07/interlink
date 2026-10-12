import { useEffect, useRef, useState } from "react";
import { LOCATIONS } from "../Constant/Location";
import "./LocationSelect.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function LocationSelect({ value, onChange, className }: Props) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // close when clicking outside or pressing Escape
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const selected = LOCATIONS.find((l) => l.value === value);
  const shown = LOCATIONS.filter((l) =>
    l.label.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
     setHighlighted(0);
  }, [filter, open]);


  const choose = (v: string) => {
    onChange(v);
    setOpen(false);
    setFilter("");
  };

  const onFilterkeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, shown.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (shown[highlighted]) choose(shown[highlighted].value);
    }
  };

  return (
    <div className={`loc-select ${className ?? ""}`} ref={ref} data-open={open}>
      <button
        type="button"
        className="loc-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected?.label ?? "All locations"}</span>
        <i className="fas fa-chevron-down"></i>
      </button>

      {open && (
        <div className="loc-panel">
          <input
            className="loc-filter"
            type="text"
            placeholder="Type a state..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            onKeyDown={onFilterkeyDown}
            autoFocus
          />
          <ul role="listbox" className="loc-list">
            {shown.map((l, i) => (
              <li
                key={l.label}
                role="option"
                aria-selected={l.value === value}
                className={`loc-option ${l.value === value ? "active" : ""} ${
                  i === highlighted ? "highlighted" : ""
                }`}
                onClick={() => choose(l.value)}
                onMouseEnter={() => setHighlighted(i)}
              >
                {l.label}
              </li>
            ))}
            {shown.length === 0 && <li className="loc-empty">No match</li>}
          </ul>
        </div>
      )}
    </div>
  );
}