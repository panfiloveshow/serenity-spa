'use client';

import { motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function FluidBackground() {
  const isMobile = useMediaQuery('(max-width: 767px)');

  // On mobile: plain background color, no animated blobs, no SVG filters
  if (isMobile) {
    return <div className="fixed inset-0 z-0 pointer-events-none bg-[#152E4A]" />;
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#152E4A]">
      {/* SVG Filters for Liquid Effect */}
      <svg className="hidden">
        <defs>
          <filter id="liquid-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Moving Blobs */}
      <div className="absolute inset-0 w-full h-full" style={{ filter: 'url(#liquid-filter)' }}>
        <motion.div
          className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-[#234A72] rounded-full mix-blend-screen opacity-40 blur-[80px]"
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[20%] w-[600px] h-[600px] bg-[#263A5E] rounded-full mix-blend-screen opacity-30 blur-[100px]"
          animate={{
            x: [0, -150, 50, 0],
            y: [0, 80, -50, 0],
            scale: [1, 1.3, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-[#C8956C] rounded-full mix-blend-overlay opacity-20 blur-[60px]"
          animate={{
            x: [0, 80, -80, 0],
            y: [0, 50, -50, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      
      {/* Grain Overlay (already in globals, but ensuring layer order) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
    </div>
  );
}
