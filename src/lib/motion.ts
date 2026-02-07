// Motion Design System — standardized animation tokens
// All animations across the site should use these tokens for consistency

export const MOTION = {
  // Durations (seconds)
  duration: {
    instant: 0.15,
    fast: 0.3,
    normal: 0.5,
    slow: 0.8,
    dramatic: 1.2,
    cinematic: 1.8,
  },

  // Easing curves
  ease: {
    // Standard Material-style
    default: [0.25, 0.1, 0.25, 1] as const,
    // Smooth deceleration (entering elements)
    out: [0.22, 1, 0.36, 1] as const,
    // Smooth acceleration (exiting elements)
    in: [0.4, 0, 1, 1] as const,
    // Elastic/bouncy
    spring: { stiffness: 300, damping: 30 },
    // Soft spring for UI elements
    soft: { stiffness: 150, damping: 20 },
    // Heavy spring for large elements
    heavy: { stiffness: 80, damping: 25 },
  },

  // Stagger delays for lists/grids
  stagger: {
    fast: 0.05,
    normal: 0.08,
    slow: 0.12,
    dramatic: 0.2,
  },

  // Standard reveal variants
  reveal: {
    fadeUp: {
      initial: { opacity: 0, y: 30, filter: 'blur(8px)' },
      animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    },
    fadeDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
    },
    fadeLeft: {
      initial: { opacity: 0, x: -40 },
      animate: { opacity: 1, x: 0 },
    },
    fadeRight: {
      initial: { opacity: 0, x: 40 },
      animate: { opacity: 1, x: 0 },
    },
    scaleUp: {
      initial: { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
      animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    },
    flipUp: {
      initial: { opacity: 0, rotateX: 15, y: 40 },
      animate: { opacity: 1, rotateX: 0, y: 0 },
    },
  },

  // Hover states
  hover: {
    lift: { y: -4, transition: { duration: 0.3 } },
    scale: { scale: 1.03, transition: { duration: 0.3 } },
    glow: { boxShadow: '0 0 40px rgba(200,149,108,0.3)', transition: { duration: 0.4 } },
    tilt3D: { rotateY: 2, rotateX: -2, scale: 1.02, transition: { duration: 0.4 } },
  },

  // Tap/press states
  tap: {
    press: { scale: 0.97 },
    deep: { scale: 0.94 },
  },

  // Viewport trigger settings
  viewport: {
    once: { once: true, margin: '-80px' } as const,
    repeat: { once: false, margin: '-50px' } as const,
  },
} as const;

// Container variant for staggered children
export function staggerContainer(staggerDelay: number = MOTION.stagger.normal) {
  return {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };
}

// Child variant for staggered animations
export const staggerChild = {
  initial: { opacity: 0, y: 24, filter: 'blur(6px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: MOTION.duration.slow, ease: MOTION.ease.out },
  },
};
