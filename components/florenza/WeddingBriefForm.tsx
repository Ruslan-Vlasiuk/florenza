'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const NEEDED = [
  { value: 'bridal_bouquet', label: 'Букет нареченої' },
  { value: 'boutonnieres', label: 'Бутоньєрки' },
  { value: 'arch', label: 'Арка / задник' },
  { value: 'table_arrangements', label: 'Композиції на столи' },
  { value: 'aisle', label: 'Декорування виходу' },
  { value: 'petals', label: 'Лепестки' },
  { value: 'toss_bouquet', label: 'Букет на кидання' },
];

const BUDGETS = [
  { value: '<15k', label: 'до 15 000 грн' },
  { value: '15-30k', label: '15–30 тис.' },
  { value: '30-60k', label: '30–60 тис.' },
  { value: '60k+', label: '60 тис.+' },
];

export function WeddingBriefForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      brideName: formData.get('brideName') as string,
      phone: formData.get('phone') as string,
      weddingDate: formData.get('weddingDate') as string,
      venue: formData.get('venue') as string,
      guestCount: Number(formData.get('guestCount') || 0),
      styleNotes: formData.get('styleNotes') as string,
      budget: formData.get('budget') as string,
      whatNeeded: formData.getAll('whatNeeded'),
      additionalNotes: formData.get('additionalNotes') as string,
    };
    try {
      await fetch('/api/forms/wedding-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-12 rounded-[var(--radius-lg)] bg-[var(--color-cream-soft)] text-center space-y-4"
      >
        <h3 className="font-[var(--font-display)] text-3xl text-[var(--color-deep-forest)]">
          Прийняли бриф 🤍
        </h3>
        <p className="text-[var(--color-text-secondary)]">
          Варвара зв&apos;яжеться з вами протягом доби особисто.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="p-8 md:p-10 rounded-[var(--radius-lg)] bg-[var(--color-bg-elevated)] border border-[var(--color-border-soft)] space-y-6"
    >
      <h2 className="font-[var(--font-display)] text-3xl text-[var(--color-deep-forest)]">
        Бриф нареченої
      </h2>

      <Field label="Ім'я нареченої" name="brideName" required />
      <Field label="Телефон" name="phone" type="tel" required />
      <Field label="Дата весілля" name="weddingDate" type="date" required />
      <Field label="Локація" name="venue" placeholder="напр. ресторан Лісовик, Ворзель" />
      <Field label="Орієнтовна кількість гостей" name="guestCount" type="number" />

      <div>
        <label className="block text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
          Що потрібно
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {NEEDED.map((n) => (
            <label key={n.value} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" name="whatNeeded" value={n.value} className="rounded" />
              <span>{n.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
          Орієнтовний бюджет
        </label>
        <div className="grid grid-cols-2 gap-2">
          {BUDGETS.map((b) => (
            <label key={b.value} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" name="budget" value={b.value} required />
              <span>{b.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Field
        label="Стиль (короткий опис)"
        name="styleNotes"
        textarea
        placeholder="напр. природні текстури, приглушені відтінки, мінімум формальності"
      />

      <Field
        label="Додаткові побажання"
        name="additionalNotes"
        textarea
        placeholder="напр. алергія на лілеї, обов'язково півонії, тощо"
      />

      <button
        type="submit"
        disabled={submitting}
        className="w-full px-6 py-3.5 rounded-md bg-[var(--color-deep-forest)] text-[var(--color-cream)] font-medium disabled:opacity-50"
      >
        {submitting ? 'Надсилаю...' : 'Надіслати бриф'}
      </button>
      <p className="text-xs text-[var(--color-text-muted)] text-center">
        Варвара зв&apos;яжеться з вами особисто протягом 24 годин.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  textarea = false,
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-3 rounded-md border border-[var(--color-border)] bg-[var(--color-cream-soft)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]"
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-md border border-[var(--color-border)] bg-[var(--color-cream-soft)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]"
        />
      )}
    </div>
  );
}
