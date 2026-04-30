import Link from 'next/link';
import { BlurFade } from './effects/BlurFade';
import { BotanicalWatermark } from './effects/BotanicalWatermark';

/**
 * Telegram-channel subscription CTA. Florenza doesn't use email, so this
 * is the brand's primary "stay in touch" channel.
 */
export function TelegramSubscribe() {
  return (
    <section
      className="relative editorial-container py-24 md:py-32 overflow-hidden"
    >
      <BotanicalWatermark variant="branch" position="top-right" size={420} opacity={0.06} rotate={-15} />
      <BlurFade>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <p className="section-eyebrow justify-center inline-flex mb-6">
            Канал · Telegram
          </p>
          <h2 className="font-[var(--font-display)] text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.05] text-[var(--color-deep-forest)] mb-6">
            Сезон в одному
            <br />
            <em style={{ fontStyle: 'italic' }}>Telegram-каналі.</em>
          </h2>
          <p className="text-base md:text-lg leading-[1.85] text-[var(--color-text-secondary)] mb-10 max-w-xl mx-auto">
            Раз на тиждень — фото нових букетів, тихий дайджест ринку, маленькі
            знижки тільки для підписників. Без спаму, без email, без cookie. Лише
            те, що варто читати.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="https://t.me/FLORENZA_irpin_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[var(--color-deep-forest)] text-[var(--color-cream)] text-sm font-medium transition-transform hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(44,62,45,0.25)]"
            >
              <svg
                viewBox="0 0 240 240"
                className="w-4 h-4"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M120 0C53.7 0 0 53.7 0 120s53.7 120 120 120 120-53.7 120-120S186.3 0 120 0zm54.3 81.4l-19 89.6c-1.5 6.6-5.3 8.3-10.7 5.2l-29.6-21.8-14.3 13.7c-1.6 1.6-2.9 2.9-5.9 2.9l2.1-30.1 54.7-49.5c2.4-2.1-.5-3.3-3.7-1.2l-67.6 42.6-29.1-9.1c-6.3-2-6.5-6.3 1.3-9.4l113.8-43.8c5.3-1.9 9.9 1.3 8.2 9.4z" />
              </svg>
              Підписатись на Florenza
            </Link>
            <Link
              href="/about"
              className="text-sm uppercase tracking-[0.32em] text-[var(--color-sage-deep)] border-b border-[var(--color-sage-deep)] pb-1"
            >
              Про канал
            </Link>
          </div>
          <p className="mt-10 text-xs uppercase tracking-[0.32em] text-[var(--color-text-muted)]">
            ✓ 2 пости на тиждень · ✓ Жодного спаму · ✓ Тільки Telegram
          </p>
        </div>
      </BlurFade>
    </section>
  );
}
