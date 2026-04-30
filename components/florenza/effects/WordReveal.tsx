'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface WordRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerPerWord?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

/**
 * Reveals each word with a soft blur + rise. Used for editorial headlines.
 * Sequence is choreographed: first word lifts almost immediately,
 * subsequent words lag with intention so the line "lands" cinematically.
 */
export function WordReveal({
  text,
  className,
  delay = 0.15,
  staggerPerWord = 0.08,
  as = 'h1',
}: WordRevealProps) {
  const reduced = useReducedMotion();
  const words = text.split(' ');

  if (reduced) {
    const Element = as as 'h1';
    return <Element className={className}>{text}</Element>;
  }

  const Container = motion[as] as typeof motion.h1;

  return (
    <Container className={className} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          aria-hidden="true"
          initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            delay: delay + i * staggerPerWord,
            duration: 0.85,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </Container>
  );
}
