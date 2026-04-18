'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

type Effect = 'rise' | 'tilt' | 'zoom' | 'flip' | 'slide';

interface ScrollSection3DProps {
  children: ReactNode;
  effect?: Effect;
  className?: string;
}

/**
 * Viewport-triggered entrance wrapper.
 *
 * Previous implementation used `useScroll` + 5-6 `useTransform` values
 * per section (including `blur()` filter). With 5 sections that's 25-30
 * scroll-driven recalculations per frame — on mid-range desktops this
 * pegged at ~20 FPS.
 *
 * New implementation uses a one-shot `whileInView` entrance animation:
 *   - runs once when the section enters the viewport
 *   - no scroll-driven math after that (static afterwards → 60 FPS)
 *   - different `effect` values just pick different initial offsets
 *     so the visual language stays similar
 */
const initialByEffect: Record<Effect, { opacity: number; y?: number; x?: number; scale?: number }> = {
  rise:  { opacity: 0, y: 60 },
  tilt:  { opacity: 0, y: 40, scale: 0.97 },
  zoom:  { opacity: 0, scale: 0.93 },
  flip:  { opacity: 0, y: 50, scale: 0.95 },
  slide: { opacity: 0, x: -60 },
};

export function ScrollSection3D({
  children,
  effect = 'rise',
  className = '',
}: ScrollSection3DProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={`section-contain section-deferred ${className}`}>{children}</div>;
  }

  const initial = initialByEffect[effect];
  const animate = { opacity: 1, y: 0, x: 0, scale: 1 };

  return (
    <motion.div
      className={`section-contain section-deferred ${className}`}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
