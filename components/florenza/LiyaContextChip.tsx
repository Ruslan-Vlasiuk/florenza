'use client';

import { motion } from 'framer-motion';
import {
  type LiyaEntryContext,
  isOrderContext,
  isQuestionContext,
} from '@/lib/liya-bridge';

type Props = { context: LiyaEntryContext };

export function LiyaContextChip({ context }: Props) {
  if (context.intent === 'general') return null;

  const label = isOrderContext(context)
    ? `Дивитеся «${context.bouquetName}»`
    : isQuestionContext(context)
      ? `Питання про «${context.bouquetName}»`
      : '';

  if (!label) return null;

  return (
    <motion.div
      data-testid="liya-context-chip"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mx-3 mb-2 inline-flex items-center gap-2 self-start rounded-full border border-[var(--color-border-soft)] bg-[var(--color-cream-soft)] px-3 py-1.5 text-xs text-[var(--color-deep-forest)]"
    >
      <span aria-hidden>🌸</span>
      <span>{label}</span>
    </motion.div>
  );
}
