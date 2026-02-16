'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Parallax3DBlockProps {
  children: React.ReactNode;
  className?: string;
  depth?: number; // How "deep" the element goes (translateZ)
  rotateIntensity?: number; // How much it rotates during scroll
  direction?: 'left' | 'right' | 'up' | 'down'; // Main axis of movement/rotation
  offset?: number; // Parallax offset (translateY)
}

export function Parallax3DBlock({
  children,
  className = '',
  depth = 50,
  rotateIntensity = 15,
  direction = 'up',
  offset = 50,
}: Parallax3DBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Parallax Y movement
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  
  // 3D rotations based on scroll
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    direction === 'up' || direction === 'down' 
      ? [rotateIntensity, 0, -rotateIntensity] 
      : [0, 0, 0]
  );

  const rotateY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    direction === 'left' 
      ? [-rotateIntensity, 0, rotateIntensity]
      : direction === 'right'
      ? [rotateIntensity, 0, -rotateIntensity]
      : [0, 0, 0]
  );

  // Z-depth scale effect (moving closer/further)
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div 
      ref={ref} 
      className={`relative perspective-1000 ${className}`}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        style={{
          y,
          rotateX,
          rotateY,
          scale,
          opacity,
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full"
      >
        <motion.div
          style={{
            transform: `translateZ(${depth}px)`,
          }}
          className="w-full h-full"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
