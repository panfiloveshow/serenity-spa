'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AuroraBackgroundProps {
  color1?: string;
  color2?: string;
  color3?: string;
}

export function AuroraBackground({ 
  color1 = '#263A5E', 
  color2 = '#234A72', 
  color3 = '#C8956C' 
}: AuroraBackgroundProps) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // On mobile: static gradient, no animation, no blur — saves GPU
  if (isMobile) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 20% 30%, ${color1}20 0%, transparent 60%), radial-gradient(ellipse at 80% 60%, ${color3}15 0%, transparent 60%)`,
          }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2"
        animate={{
          background: [
            `radial-gradient(ellipse at 20% 30%, ${color1}30 0%, transparent 50%),
             radial-gradient(ellipse at 80% 20%, ${color2}25 0%, transparent 50%),
             radial-gradient(ellipse at 40% 80%, ${color3}20 0%, transparent 50%)`,
            `radial-gradient(ellipse at 60% 40%, ${color1}25 0%, transparent 50%),
             radial-gradient(ellipse at 30% 70%, ${color2}30 0%, transparent 50%),
             radial-gradient(ellipse at 80% 60%, ${color3}25 0%, transparent 50%)`,
            `radial-gradient(ellipse at 40% 50%, ${color1}30 0%, transparent 50%),
             radial-gradient(ellipse at 70% 30%, ${color2}25 0%, transparent 50%),
             radial-gradient(ellipse at 20% 70%, ${color3}20 0%, transparent 50%)`,
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          filter: 'blur(80px)',
        }}
      />
    </div>
  );
}
