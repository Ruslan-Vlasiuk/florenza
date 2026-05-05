'use client';

import { useId } from 'react';

type Props = {
  label: string;
  value: string; // E.164 normalized e.g. "+380501234567"
  onChange: (e164: string) => void;
  required?: boolean;
};

const PLACEHOLDER = '+380 __ ___ __ __';

/**
 * Ukrainian phone input with auto-format `+380 50 123 45 67`.
 * Stores normalized E.164 (`+380501234567`) in parent state, displays
 * the formatted version. User can paste any common form (`0501234567`,
 * `+380501234567`, `380501234567`, `(050) 123-45-67`) — all normalize.
 */
export function PhoneField({ label, value, onChange, required }: Props) {
  const id = useId();
  const display = formatUkrainianPhone(value).display;

  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatUkrainianPhone(e.target.value);
    onChange(formatted.e164);
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-2"
      >
        {label}
        {required && <span className="text-[var(--color-deep-forest)]"> *</span>}
      </label>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={display}
        onChange={handle}
        placeholder={PLACEHOLDER}
        required={required}
        pattern="\+380 \d{2} \d{3} \d{2} \d{2}"
        maxLength={PLACEHOLDER.length}
        className="w-full px-4 py-3 rounded-md bg-white border border-[var(--color-border-soft)] text-[var(--color-deep-forest)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-deep-forest)] focus:ring-2 focus:ring-[var(--color-sage)]/40 transition-colors tabular-nums"
      />
    </div>
  );
}

export function formatUkrainianPhone(input: string): {
  display: string;
  e164: string;
  isComplete: boolean;
} {
  if (!input) return { display: '', e164: '', isComplete: false };

  // Pull all digits
  let digits = input.replace(/\D/g, '');

  // Common normalizations:
  //   '0501234567'      → '380501234567'
  //   '380501234567'    → as-is
  //   '+380501234567'   → '380501234567'
  //   '8050...' (very rare typo) → ignore — user must include 380
  if (digits.startsWith('0') && digits.length <= 10) {
    digits = '38' + digits;
  }
  if (digits.length > 0 && !digits.startsWith('380')) {
    // user typed only the operator + number without country code
    if (digits.length <= 9) digits = '380' + digits;
  }
  digits = digits.slice(0, 12); // 380 + 9 digits

  // Build display
  let display = '';
  if (digits.length === 0) return { display: '', e164: '', isComplete: false };

  display = '+' + digits.slice(0, Math.min(3, digits.length));
  if (digits.length >= 4) display += ' ' + digits.slice(3, Math.min(5, digits.length));
  if (digits.length >= 6) display += ' ' + digits.slice(5, Math.min(8, digits.length));
  if (digits.length >= 9) display += ' ' + digits.slice(8, Math.min(10, digits.length));
  if (digits.length >= 11) display += ' ' + digits.slice(10, 12);

  return {
    display,
    e164: digits.length > 0 ? '+' + digits : '',
    isComplete: digits.length === 12,
  };
}
