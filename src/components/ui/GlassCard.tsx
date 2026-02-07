'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { MOTION } from '@/lib/motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover3D?: boolean;
  delay?: number;
}

export function GlassCard({ children, className = '', hover3D = true, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      className={`
        relative rounded-2xl border border-[#7A8BA8]/12
        bg-[#1F4268]/50 backdrop-blur-lg
        shadow-[0_4px_24px_rgba(0,0,0,0.15)]
        transition-all duration-500
        ${hover3D ? 'hover:shadow-[0_8px_40px_rgba(0,0,0,0.25)] hover:border-[#C8956C]/15' : ''}
        ${className}
      `}
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={MOTION.viewport.once}
      transition={{
        duration: MOTION.duration.slow,
        delay,
        ease: MOTION.ease.out,
      }}
      whileHover={hover3D ? {
        y: -3,
        scale: 1.01,
        transition: { duration: MOTION.duration.fast, ease: 'easeOut' },
      } : undefined}
    >
      {/* Subtle noise texture */}
      <div className="absolute inset-0 rounded-2xl opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      {children}
    </motion.div>
  );
}

