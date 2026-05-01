'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import { DiscountTimer } from './DiscountTimer';

export interface BouquetCardData {
  slug: string;
  name: string;
  price: number;
  primaryImageUrl: string;
  hoverImageUrl?: string;
  imageAlt: string;
  discount?: {
    enabled: boolean;
    type: 'percent' | 'fixed';
    amount: number;
    endAt?: string;
    campaignName?: string;
  } | null;
  emotionalTone?: string[] | null;
  preparationHours?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function BouquetCard({
  bouquet,
  index = 0,
}: {
  bouquet: BouquetCardData;
  index?: number;
}) {
  const hasDiscount =
    bouquet.discount?.enabled && bouquet.discount.amount > 0;
  const finalPrice = hasDiscount
    ? bouquet.discount!.type === 'percent'
      ? Math.round(bouquet.price * (1 - bouquet.discount!.amount / 100))
      : bouquet.price - bouquet.discount!.amount
    : bouquet.price;

  const aspect = bouquet.size === 'lg' ? 'aspect-[3/4]' : bouquet.size === 'sm' ? 'aspect-square' : 'aspect-[4/5]';

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <Link href={`/buket/${bouquet.slug}`} className="block">
        <div
          className={cn(
            'bouquet-card-image relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-cream-soft)] shadow-[0_2px_8px_rgba(44,62,45,0.04)] group-hover:shadow-[0_20px_60px_rgba(44,62,45,0.12)] transition-shadow duration-500',
            aspect,
          )}
        >
          <Image
            src={bouquet.primaryImageUrl}
            alt={bouquet.imageAlt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
          {bouquet.hoverImageUrl && (
            <Image
              src={bouquet.hoverImageUrl}
              alt={bouquet.imageAlt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          )}
          {hasDiscount && (
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-[var(--color-deep-forest)] text-[var(--color-cream)] text-xs uppercase tracking-wider rounded-sm">
              {bouquet.discount!.type === 'percent'
                ? `−${bouquet.discount!.amount}%`
                : `−${bouquet.discount!.amount} грн`}
            </div>
          )}
          {bouquet.preparationHours && bouquet.preparationHours <= 2 && (
            <div className="absolute top-3 right-3 px-2 py-1 bg-[var(--color-cream)]/90 text-[var(--color-deep-forest)] text-[10px] uppercase tracking-wider rounded-sm">
              готовий сьогодні
            </div>
          )}
          {/* Quick-view chip — appears on hover */}
          <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-[var(--color-deep-forest)]/95 text-[var(--color-cream)] text-[10px] uppercase tracking-[0.2em] rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            Швидкий перегляд →
          </div>
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-[var(--font-display)] text-lg text-[var(--color-deep-forest)] leading-tight">
              {bouquet.name}
            </h3>
            {bouquet.emotionalTone && bouquet.emotionalTone.length > 0 && (
              <p className="mt-1 text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                {bouquet.emotionalTone[0]}
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            {hasDiscount && (
              <div className="text-xs text-[var(--color-text-muted)] line-through">
                {formatPrice(bouquet.price)}
              </div>
            )}
            <div className="text-base font-medium text-[var(--color-deep-forest)]">
              {formatPrice(finalPrice)}
            </div>
          </div>
        </div>
        {hasDiscount && bouquet.discount?.endAt && (
          <DiscountTimer endAt={bouquet.discount.endAt} compact />
        )}
      </Link>
    </motion.article>
  );
}
