'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

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

export function FloatingParticles({ 
  count = 20,
  colors = ['#C8956C', '#D4A574', '#7A8BA8', '#E8DFD0']
}: FloatingParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 10 + 8,
        delay: Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        drift: Math.random() * 20 - 10,
      }))
    );
  }, [count, colors]);

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
