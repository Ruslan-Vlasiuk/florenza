'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const SERVICES = [
  { value: 'office_subscription', label: 'Регулярні поставки в офіс' },
  { value: 'event', label: 'Разове оформлення події' },
  { value: 'vip_gifts', label: 'VIP-букети для клієнтів' },
  { value: 'gifts', label: 'Корпоративні подарунки' },
  { value: 'opening', label: 'Відкриття' },
  { value: 'other', label: 'Інше' },
];

const BUDGETS = [
  { value: '<3k', label: 'до 3 тис.' },
  { value: '3-6k', label: '3–6 тис.' },
  { value: '6-15k', label: '6–15 тис.' },
  { value: '15k+', label: '15 тис.+' },
];

export function CorporateInquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await fetch('/api/forms/corporate-inquiry', {
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
        className="p-12 rounded-[var(--radius-lg)] bg-[var(--color-cream-soft)] text-center"
      >
        <h3 className="font-[var(--font-display)] text-3xl text-[var(--color-deep-forest)] mb-3">
          Прийняли запит
        </h3>
        <p className="text-[var(--color-text-secondary)]">
          Варвара особисто зв&apos;яжеться з вами протягом робочого дня.
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
        Запит від компанії
      </h2>

      <Field label="Назва компанії" name="companyName" required />
      <Field label="Контактна особа" name="contactName" required />
      <Field label="Телефон" name="phone" type="tel" required />

      <div>
        <label className="block text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
          Тип послуги
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SERVICES.map((s) => (
            <label key={s.value} className="flex items-center gap-2 text-sm">
              <input type="radio" name="serviceType" value={s.value} required />
              <span>{s.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Field label="Періодичність" name="frequency" placeholder="напр. щотижня, разова подія" />

      <div>
        <label className="block text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
          Орієнтовний бюджет (за раз)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {BUDGETS.map((b) => (
            <label key={b.value} className="flex items-center gap-2 text-sm">
              <input type="radio" name="budgetPerInstance" value={b.value} />
              <span>{b.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Field label="Деталі" name="notes" textarea />

      <button
        type="submit"
        disabled={submitting}
        className="w-full px-6 py-3.5 rounded-md bg-[var(--color-deep-forest)] text-[var(--color-cream)] font-medium disabled:opacity-50"
      >
        {submitting ? 'Надсилаю...' : 'Надіслати запит'}
      </button>
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
}: any) {
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
