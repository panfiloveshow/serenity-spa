'use client';

import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { MOTION, staggerContainer } from '@/lib/motion';

interface KineticTextProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  split?: boolean;
}

const wordVariants = {
  initial: {
    y: '110%',
    rotateX: 45,
    opacity: 0,
  },
  animate: {
    y: '0%',
    rotateX: 0,
    opacity: 1,
    transition: {
      duration: MOTION.duration.slow,
      ease: MOTION.ease.out,
    },
  },
};

export function KineticText({
  children,
  className = '',
  as: Tag = 'h2',
  split = true,
}: KineticTextProps) {
  const words = children.trim().split(/\s+/);

  if (!split) {
    return (
      <div className="overflow-hidden" style={{ perspective: '600px' }}>
        <motion.div
          className={`block origin-bottom ${className}`}
          initial={{ y: '100%', opacity: 0 }}
          whileInView={{ y: '0%', opacity: 1 }}
          viewport={MOTION.viewport.once}
          transition={{ duration: MOTION.duration.slow, ease: MOTION.ease.out }}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="overflow-hidden"
      style={{ perspective: '800px' }}
      variants={staggerContainer(MOTION.stagger.fast)}
      initial="initial"
      whileInView="animate"
      viewport={MOTION.viewport.once}
    >
      <Tag className={`${className} flex flex-wrap`}>
        {words.map((word, i) => (
          <Fragment key={i}>
            <span
              className={`overflow-hidden inline-block${i < words.length - 1 ? ' mr-[0.3em]' : ''}`}
              style={{ perspective: '400px' }}
            >
              <motion.span
                className="inline-block origin-bottom"
                variants={wordVariants}
              >
                {word}
              </motion.span>
            </span>
            {i < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </Tag>
    </motion.div>
  );
}
