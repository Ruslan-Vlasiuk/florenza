import Link from 'next/link';
import { BlurFade } from './effects/BlurFade';
import { BotanicalWatermark } from './effects/BotanicalWatermark';

/**
 * Messenger-bot ordering CTA. Florenza accepts orders through Telegram
 * and Viber bots — quick, no email, no registration. Replaces the old
 * channel-subscription pitch.
 */
export function MessengerOrder() {
  return (
    <section className="relative editorial-container py-24 md:py-32 overflow-hidden">
      <BotanicalWatermark
        variant="branch"
        position="top-right"
        size={420}
        opacity={0.06}
        rotate={-15}
      />
      <BlurFade>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <p className="section-eyebrow justify-center inline-flex mb-6">
            Замовлення в один клік
          </p>
          <h2 className="font-[var(--font-display)] text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.05] text-[var(--color-deep-forest)] mb-6">
            Букет за хвилину —
            <br />
            <em style={{ fontStyle: 'italic' }}>прямо в месенджері.</em>
          </h2>
          <p className="text-base md:text-lg leading-[1.85] text-[var(--color-text-secondary)] mb-12 max-w-xl mx-auto">
            Напишіть нашому Telegram або Viber-боту — підкажемо букет, оформимо
            замовлення і приймемо оплату прямо в чаті. Без email, без реєстрації,
            без зайвих кроків.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="https://t.me/FLORENZA_irpin_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#229ED9] text-white text-sm font-medium transition-transform hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(34,158,217,0.35)]"
            >
              <svg
                viewBox="0 0 240 240"
                className="w-5 h-5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M120 0C53.7 0 0 53.7 0 120s53.7 120 120 120 120-53.7 120-120S186.3 0 120 0zm54.3 81.4l-19 89.6c-1.5 6.6-5.3 8.3-10.7 5.2l-29.6-21.8-14.3 13.7c-1.6 1.6-2.9 2.9-5.9 2.9l2.1-30.1 54.7-49.5c2.4-2.1-.5-3.3-3.7-1.2l-67.6 42.6-29.1-9.1c-6.3-2-6.5-6.3 1.3-9.4l113.8-43.8c5.3-1.9 9.9 1.3 8.2 9.4z" />
              </svg>
              Замовити в Telegram
            </Link>
            <Link
              href="viber://pa?chatURI=florenza_irpin"
              className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#7360F2] text-white text-sm font-medium transition-transform hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(115,96,242,0.35)]"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M11.4 0C8.4.1 4.6.4 2.7 2.4 1.1 4 .5 6.4.5 9.4c0 3 .1 8.5 5.2 9.9v2.5c0 .9.5 1.4 1.4 1.4.3 0 .5-.1.7-.2.9-.6 1.4-1.1 2-1.7.4-.4.8-.8 1.3-1.2 3.5 0 6.1-.7 6.4-.8 1-.3 6.7-1.1 7.6-8.7.3-2.6.4-7.6-3.3-10.4C19.7.7 16.5 0 12.5 0c-.4 0-.7 0-1.1.0zm.4 17c-.3 0-.5 0-.7-.1l-1.3 1.3c-.4.4-.8.8-1.2 1.2v-1.6c0-.4-.3-.6-.7-.7-4.3-1-4.5-5.3-4.5-7.8 0-2.5.5-4.5 1.7-5.7C7 1.6 10.5 1.5 12.4 1.5h.1c4.7 0 6.6 1 7.4 1.6 2.5 1.9 2.6 5.7 2.4 7.7-.7 5.6-4.7 6.3-5.7 6.5-.4.1-2.6.7-4.8.7zm-1.5-2.2c-1.4-.5-2.6-1.6-3.4-3-.3-.5-.4-1-.4-1.5 0-.7.4-1 .7-1.2l.4-.3c.3-.2.7-.1 1 .2.1.1.4.4.5.5.4.4.7.7.4 1.2 0 .1-.1.2-.2.3.7.9 1.5 1.6 2.4 2 .1-.1.2-.2.3-.2.5-.3.8 0 1.2.4l.5.5c.3.3.4.7.2 1l-.3.4c-.2.3-.5.7-1.2.7-.5 0-1-.1-1.5-.4z" />
              </svg>
              Замовити в Viber
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.32em] text-[var(--color-text-muted)]">
            <span>✓ Відповідь &lt; 1 хв</span>
            <span>✓ Оплата в чаті</span>
            <span>✓ Доставка від 60 хв</span>
            <span>✓ Без email і реєстрацій</span>
          </div>
        </div>
      </BlurFade>
    </section>
  );
}
