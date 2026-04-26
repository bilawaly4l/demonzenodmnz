import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SignalSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
}

export function SignalSearchBar({
  value,
  onChange,
  resultCount,
}: SignalSearchBarProps) {
  const [local, setLocal] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external value resets (e.g. clear all)
  useEffect(() => {
    setLocal(value);
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setLocal(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(v), 300);
  }

  function handleClear() {
    setLocal("");
    onChange("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") handleClear();
  }

  return (
    <div className="flex flex-col gap-1.5 w-full max-w-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          data-ocid="signals.search_input"
          aria-label="Search signals by asset name"
          placeholder="Search asset… e.g. BTC, EUR/USD"
          value={local}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full h-10 pl-9 pr-9 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-smooth"
        />
        {local && (
          <button
            type="button"
            data-ocid="signals.search_clear.button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {local && resultCount !== undefined && (
        <p className="text-xs text-muted-foreground pl-1">
          {resultCount} signal{resultCount !== 1 ? "s" : ""} found
        </p>
      )}
    </div>
  );
}
