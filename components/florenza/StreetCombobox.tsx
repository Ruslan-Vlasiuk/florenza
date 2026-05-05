'use client';

import { useEffect, useRef, useState } from 'react';

type Suggestion = {
  street: string;
  displayName: string;
  lat: string;
  lon: string;
  osmId: string;
};

type Props = {
  value: string;
  onChange: (street: string) => void;
  city: string; // city key: irpin | bucha | hostomel | kyiv
  required?: boolean;
  placeholder?: string;
};

export function StreetCombobox({
  value,
  onChange,
  city,
  required,
  placeholder = 'Почніть вводити назву вулиці…',
}: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastQueryRef = useRef('');

  // Debounce-fetch
  useEffect(() => {
    const q = value.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    if (q === lastQueryRef.current) return;
    lastQueryRef.current = q;

    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/places/streets?city=${encodeURIComponent(city)}&q=${encodeURIComponent(q)}`,
          { signal: ctrl.signal },
        );
        const data = await res.json();
        setSuggestions(data.suggestions ?? []);
        setHighlight(-1);
      } catch {
        // network error or aborted — silently
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [value, city]);

  function handleKey(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(suggestions.length - 1, h + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(0, h - 1));
    } else if (e.key === 'Enter' && highlight >= 0) {
      e.preventDefault();
      pick(suggestions[highlight]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  function pick(s: Suggestion) {
    onChange(s.street);
    setOpen(false);
    setSuggestions([]);
    inputRef.current?.blur();
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        required={required}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // delay close to allow clicks
          blurTimer.current = setTimeout(() => setOpen(false), 120);
        }}
        onChange={(e) => {
          if (blurTimer.current) clearTimeout(blurTimer.current);
          onChange(e.target.value);
          setOpen(true);
        }}
        onKeyDown={handleKey}
        className="w-full px-4 py-3 rounded-md bg-[var(--color-cream-soft)] text-[var(--color-deep-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open && suggestions.length > 0}
        aria-controls="street-suggestions"
      />

      {loading && (
        <span
          aria-hidden="true"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-[var(--color-sage)] border-t-transparent animate-spin"
        />
      )}

      {open && suggestions.length > 0 && (
        <ul
          id="street-suggestions"
          role="listbox"
          className="absolute z-30 left-0 right-0 mt-1 max-h-64 overflow-y-auto rounded-md border border-[var(--color-border-soft)] bg-[var(--color-cream)] shadow-lg"
        >
          {suggestions.map((s, i) => (
            <li
              key={s.osmId}
              role="option"
              aria-selected={highlight === i}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(s);
              }}
              onMouseEnter={() => setHighlight(i)}
              className={`px-4 py-2.5 cursor-pointer text-sm ${
                highlight === i
                  ? 'bg-[var(--color-cream-soft)] text-[var(--color-deep-forest)]'
                  : 'text-[var(--color-text-primary)]'
              }`}
            >
              <p className="font-medium">{s.street}</p>
              <p className="text-xs text-[var(--color-text-muted)] truncate">
                {s.displayName}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
