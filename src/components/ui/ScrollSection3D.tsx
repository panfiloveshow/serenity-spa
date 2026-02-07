'use client';

import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from 'framer-motion';
import { useRef, ReactNode, useEffect, useState } from 'react';

type Effect = 'rise' | 'tilt' | 'zoom' | 'flip' | 'slide';

interface ScrollSection3DProps {
  children: ReactNode;
  effect?: Effect;
  className?: string;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

function useParallaxTransforms(
  scrollYProgress: MotionValue<number>,
  effect: Effect,
  mobile: boolean
) {
  const m = mobile ? 0.4 : 1;

  // All hooks called unconditionally to respect Rules of Hooks
  // On mobile: blur values are 0 (no GPU cost), rotations are 0
  const rise = {
    rotateX: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], mobile ? [0, 0, 0, 0] : [12, 0, 0, -6]),
    scale: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1 - 0.12 * m, 1, 1, 1 - 0.06 * m]),
    opacity: useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [0, 1, 1, 0.3]),
    y: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [120 * m, 0, 0, -50 * m]),
    filter: useTransform(scrollYProgress, [0, 0.15, 0.85, 1],
      mobile ? ['blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(0px)'] : ['blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(4px)']),
  };

  const tilt = {
    rotateX: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], mobile ? [0, 0, 0, 0] : [15, 0, 0, -5]),
    rotateY: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], mobile ? [0, 0, 0, 0] : [-6, 0, 0, 3]),
    scale: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1 - 0.15 * m, 1, 1, 1 - 0.05 * m]),
    opacity: useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [0, 1, 1, 0.3]),
    y: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [150 * m, 0, 0, -40 * m]),
    filter: useTransform(scrollYProgress, [0, 0.18, 0.82, 1],
      mobile ? ['blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(0px)'] : ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(5px)']),
  };

  const zoom = {
    scale: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1 - 0.2 * m, 1, 1, 1 + 0.05 * m]),
    opacity: useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [0, 1, 1, 0.2]),
    y: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100 * m, 0, 0, -60 * m]),
    rotateX: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], mobile ? [0, 0, 0, 0] : [8, 0, 0, -4]),
    filter: useTransform(scrollYProgress, [0, 0.15, 0.85, 1],
      mobile ? ['blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(0px)'] : ['blur(12px)', 'blur(0px)', 'blur(0px)', 'blur(6px)']),
  };

  const flip = {
    rotateX: useTransform(scrollYProgress, [0, 0.22, 0.78, 1], mobile ? [0, 0, 0, 0] : [20, 0, 0, -10]),
    scale: useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [1 - 0.18 * m, 1, 1, 1 - 0.08 * m]),
    opacity: useTransform(scrollYProgress, [0, 0.15, 0.78, 1], [0, 1, 1, 0.15]),
    y: useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [180 * m, 0, 0, -60 * m]),
    filter: useTransform(scrollYProgress, [0, 0.2, 0.8, 1],
      mobile ? ['blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(0px)'] : ['blur(15px)', 'blur(0px)', 'blur(0px)', 'blur(8px)']),
  };

  const slide = {
    x: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [-100 * m, 0, 0, 50 * m]),
    rotateY: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], mobile ? [0, 0, 0, 0] : [8, 0, 0, -4]),
    scale: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1 - 0.1 * m, 1, 1, 1 - 0.04 * m]),
    opacity: useTransform(scrollYProgress, [0, 0.12, 0.8, 1], [0, 1, 1, 0.4]),
    y: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [80 * m, 0, 0, -30 * m]),
    filter: useTransform(scrollYProgress, [0, 0.15, 0.85, 1],
      mobile ? ['blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(0px)'] : ['blur(6px)', 'blur(0px)', 'blur(0px)', 'blur(3px)']),
  };

  const effects = { rise, tilt, zoom, flip, slide };
  return effects[effect];
}

export function ScrollSection3D({
  children,
  effect = 'rise',
  className = '',
}: ScrollSection3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const transforms = useParallaxTransforms(scrollYProgress, effect, isMobile);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{ perspective: '1200px' }}
    >
      <motion.div
        style={{
          ...transforms,
          transformOrigin: 'center top',
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
