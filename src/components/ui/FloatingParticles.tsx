'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface Particle {
  id: number;
  x: string;
  y: string;
  size: number;
  duration: number;
  delay: number;
  color: string;
  drift: number;
}

interface FloatingParticlesProps {
  count?: number;
  colors?: string[];
}

const DEFAULT_PARTICLE_COLORS = ['#C8956C', '#D4A574', '#7A8BA8', '#E8DFD0'];

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function FloatingParticles({ 
  count = 20,
  colors = DEFAULT_PARTICLE_COLORS
}: FloatingParticlesProps) {
  const particles = useMemo<Particle[]>(() => (
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: `${pseudoRandom((i + 1) * 13) * 100}%`,
      y: `${pseudoRandom((i + 1) * 17) * 100}%`,
      size: pseudoRandom((i + 1) * 19) * 4 + 2,
      duration: pseudoRandom((i + 1) * 23) * 10 + 8,
      delay: pseudoRandom((i + 1) * 29) * 5,
      color: colors[Math.floor(pseudoRandom((i + 1) * 31) * colors.length)] || DEFAULT_PARTICLE_COLORS[0],
      drift: pseudoRandom((i + 1) * 37) * 20 - 10,
    }))
  ), [count, colors]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            filter: 'blur(1px)',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, particle.drift, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
