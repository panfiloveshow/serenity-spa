'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltAmount?: number;
  glowColor?: string;
}

export function TiltCard({ 
  children, 
  className = '', 
  tiltAmount = 10,
  glowColor = '#D4A574'
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 767px)');
  
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  
  const springConfig = { stiffness: 300, damping: 30 };
  const rotateX = useSpring(useTransform(y, [0, 1], [tiltAmount, -tiltAmount]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-tiltAmount, tiltAmount]), springConfig);
  
  const glowX = useTransform(x, [0, 1], ['-50%', '50%']);
  const glowY = useTransform(y, [0, 1], ['-50%', '50%']);
  const glowBg = useTransform(
    [glowX, glowY],
    ([latestX, latestY]) => `radial-gradient(circle at ${latestX} ${latestY}, ${glowColor}20, transparent 50%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || isMobile) return;
    const rect = ref.current.getBoundingClientRect();
    const xPos = (e.clientX - rect.left) / rect.width;
    const yPos = (e.clientY - rect.top) / rect.height;
    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  // On mobile: no 3D transforms, no glow — just a plain wrapper
  if (isMobile) {
    return <div className={`relative ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: glowBg }}
      />
      {children}
    </motion.div>
  );
}
