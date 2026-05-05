'use client';

import { useEffect, useState } from 'react';

type Props = {
  orderNumber: string;
  /** delay before opening Telegram (ms). Default 2000. */
  delay?: number;
  /** if false, only show the button — no auto-redirect. */
  autoRedirect?: boolean;
};

const TG_BOT_URL = (orderNumber: string) =>
  `https://t.me/FLORENZA_irpin_bot?start=order_${orderNumber}`;

/**
 * Auto-opens Telegram deep-link in the same tab so the chat starts
 * with `/start order_FL-XXX` payload — webhook then pins this Telegram
 * chat to the order's customer.
 *
 * Shows a small countdown so the user sees the order-success page first
 * and isn't dropped into Telegram without context.
 */
export function OrderTelegramRedirect({ orderNumber, delay = 2000, autoRedirect = true }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(delay / 1000));
  const [aborted, setAborted] = useState(!autoRedirect);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!autoRedirect || aborted || opened) return;
    const tickInterval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    const t = setTimeout(() => {
      setOpened(true);
      window.location.href = TG_BOT_URL(orderNumber);
    }, delay);
    return () => {
      clearInterval(tickInterval);
      clearTimeout(t);
    };
  }, [orderNumber, delay, aborted, opened, autoRedirect]);

  if (aborted) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[#229ED9]/30 bg-[#229ED9]/8 p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="flex-1">
            <h2 className="font-[var(--font-display)] text-xl text-[var(--color-deep-forest)] mb-2">
              Слідкуйте за замовленням у Telegram
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Бот закріпить замовлення <strong>{orderNumber}</strong> за вашим
              Telegram і надсилатиме статуси: підтвердження, збір, передача
              курʼєру, доставка. Через нього ж можна писати нам напряму.
            </p>
          </div>
          <a
            href={TG_BOT_URL(orderNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#229ED9] text-white text-sm font-medium hover:-translate-y-0.5 hover:shadow-lg transition-transform"
          >
            <TelegramIcon /> Відкрити в Telegram
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-[#229ED9]/30 bg-[#229ED9]/8 p-6 md:p-8 mb-8">
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        <div className="flex-1">
          <h2 className="font-[var(--font-display)] text-xl text-[var(--color-deep-forest)] mb-2">
            Відкриваємо Telegram-бот для відстеження…
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Через {secondsLeft} {pluralUkr(secondsLeft, 'секунду', 'секунди', 'секунд')} перейдемо
            у чат із <strong>@FLORENZA_irpin_bot</strong>. Він автоматично закріпить
            замовлення <strong>{orderNumber}</strong> за вашим Telegram, надішле статуси і дасть
            писати нам напряму.
          </p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <a
            href={TG_BOT_URL(orderNumber)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#229ED9] text-white text-sm font-medium hover:-translate-y-0.5 hover:shadow-lg transition-transform"
          >
            <TelegramIcon /> Відкрити зараз
          </a>
          <button
            type="button"
            onClick={() => setAborted(true)}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-deep-forest)] underline underline-offset-2"
          >
            Скасувати авто-перехід
          </button>
        </div>
      </div>
    </div>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 240 240" className="w-5 h-5" fill="currentColor" aria-hidden="true">
      <path d="M120 0C53.7 0 0 53.7 0 120s53.7 120 120 120 120-53.7 120-120S186.3 0 120 0zm54.3 81.4l-19 89.6c-1.5 6.6-5.3 8.3-10.7 5.2l-29.6-21.8-14.3 13.7c-1.6 1.6-2.9 2.9-5.9 2.9l2.1-30.1 54.7-49.5c2.4-2.1-.5-3.3-3.7-1.2l-67.6 42.6-29.1-9.1c-6.3-2-6.5-6.3 1.3-9.4l113.8-43.8c5.3-1.9 9.9 1.3 8.2 9.4z" />
    </svg>
  );
}

function pluralUkr(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
