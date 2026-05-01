import Image from 'next/image';
import { BlurFade } from './effects/BlurFade';
import { BotanicalWatermark } from './effects/BotanicalWatermark';

interface Chapter {
  eyebrow: string;
  title: string;
  body: string;
}

interface StoryStickySectionProps {
  imageUrl: string;
  imageAlt: string;
  chapters: Chapter[];
  brand?: string;
}

/**
 * Aesop-style sticky-image scrollytelling.
 * The photo on the left stays pinned while paragraphs scroll past on the right.
 * Image subtly cross-fades as user passes between chapters (handled visually
 * via overlay opacity tied to scroll progress).
 */
export function StoryStickySection({
  imageUrl,
  imageAlt,
  chapters,
  brand = 'Florenza',
}: StoryStickySectionProps) {
  return (
    <section className="relative py-24 md:py-32">
      {/* Watermarks live in their own clipping wrapper so the SECTION can
          stay overflow:visible — otherwise sticky positioning breaks. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <BotanicalWatermark variant="fern" position="top-left" size={380} opacity={0.08} rotate={-8} />
        <BotanicalWatermark variant="wreath" position="bottom-right" size={320} opacity={0.07} />
      </div>
      <div className="editorial-container relative z-10">
      <BlurFade>
        <p className="section-eyebrow mb-4">Філософія {brand}</p>
        <h2 className="font-[var(--font-display)] text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.05] text-[var(--color-deep-forest)] max-w-2xl mb-16 md:mb-24">
          Букет як редакторський жест,
          <br />
          а не товар з полиці
        </h2>
      </BlurFade>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 lg:gap-24">
        {/* Sticky image — left column on desktop, top on mobile */}
        <div className="md:col-span-5 lg:col-span-5 order-1">
          <div className="md:sticky md:top-24">
            <div className="relative aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-cream-soft)]">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
              {/* Soft vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at center, transparent 60%, rgba(26,26,26,0.15) 100%)',
                }}
              />
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.22em] text-[var(--color-sage-deep)] opacity-80">
              Студія · Ірпінь
            </p>
          </div>
        </div>

        {/* Scrolling chapters */}
        <div className="md:col-span-7 lg:col-span-6 lg:col-start-7 order-2 space-y-24 md:space-y-32">
          {chapters.map((chapter, i) => {
            // Pull a representative phrase as a pull-quote for chapter 2 only
            const isPullQuote = i === 1;
            // First letter of body for drop cap on chapter 1
            const useDropCap = i === 0;
            return (
              <BlurFade key={chapter.title} delay={0.1} yOffset={32}>
                <article>
                  <div className="flex items-center gap-4 mb-6">
                    <span
                      className="font-[var(--font-display)] text-5xl md:text-6xl text-[var(--color-sage)] leading-none"
                      style={{ fontStyle: 'italic', fontVariationSettings: "'opsz' 144, 'wght' 280" }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div
                      className="h-px flex-1 max-w-[80px]"
                      style={{ background: 'var(--color-sage-deep)', opacity: 0.4 }}
                    />
                    <p className="text-[10px] uppercase tracking-[0.42em] text-[var(--color-sage-deep)] opacity-80">
                      {chapter.eyebrow}
                    </p>
                  </div>
                  <h3 className="font-[var(--font-display)] text-[clamp(1.75rem,3vw,2.5rem)] leading-tight text-[var(--color-deep-forest)] mb-6">
                    {chapter.title}
                  </h3>
                  {isPullQuote ? (
                    <>
                      <blockquote
                        className="font-[var(--font-display)] text-[clamp(1.5rem,2.5vw,2.25rem)] leading-[1.3] text-[var(--color-deep-forest)] mb-6 pl-6 border-l-2"
                        style={{ borderColor: 'var(--color-dusty-rose)', fontStyle: 'italic' }}
                      >
                        «Букет має поєднуватися з обличчям клієнтки, не кричати про себе».
                      </blockquote>
                      <p className="text-base leading-[1.85] text-[var(--color-text-secondary)] max-w-prose">
                        {chapter.body}
                      </p>
                    </>
                  ) : (
                    <p
                      className={`text-lg leading-[1.75] text-[var(--color-text-secondary)] max-w-prose ${
                        useDropCap ? 'drop-cap' : ''
                      }`}
                    >
                      {chapter.body}
                    </p>
                  )}
                </article>
              </BlurFade>
            );
          })}
        </div>
      </div>
      </div>
    </section>
  );
}
