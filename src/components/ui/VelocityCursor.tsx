'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';

export function VelocityCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth out the mouse movement
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 300, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 300, mass: 0.5 });
  
  // Calculate velocity for distortion
  const velocityX = useVelocity(smoothX);
  const velocityY = useVelocity(smoothY);
  
  // Transform velocity into scale/rotation values
  const scaleX = useTransform(velocityX, [-1000, 0, 1000], [1.5, 1, 1.5]);
  const scaleY = useTransform(velocityY, [-1000, 0, 1000], [0.6, 1, 0.6]);
  
  // Rotation based on movement direction
  const rotate = useTransform<number, number>([velocityX, velocityY], ([vx, vy]) => {
    if (!vx && !vy) return 0;
    return Math.atan2(vy, vx) * (180 / Math.PI);
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full bg-[#C8956C] mix-blend-difference pointer-events-none z-[9999]"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
        scaleX,
        scaleY,
        rotate,
      }}
    />
  );
}
