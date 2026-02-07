'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface CTAButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'glass';
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function CTAButton({ children, variant = 'primary', href, onClick, className = '' }: CTAButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left - width / 2;
      const mouseY = e.clientY - rect.top - height / 2;
      x.set(mouseX * 0.3); // Magnetic strength
      y.set(mouseY * 0.3);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base = 'relative inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-base tracking-wide transition-all duration-500 cursor-pointer overflow-hidden group';

  const variants = {
    primary: `${base} bg-gradient-to-r from-[#C8956C] to-[#A07550] text-[#1B3A5C] shadow-[0_4px_20px_rgba(200,149,108,0.3)] hover:shadow-[0_8px_30px_rgba(200,149,108,0.4)]`,
    secondary: `${base} border border-[#C8956C]/30 text-[#C8956C] hover:bg-[#C8956C]/10`,
    glass: `${base} bg-[#234A72]/40 backdrop-blur-md border border-[#7A8BA8]/20 text-[#E8DFD0] hover:bg-[#234A72]/60`,
  };

  // Wrapper for motion logic, deciding whether to render 'a' or 'button' logic is complex with pure motion components if structure changes
  // Simplified: We use a motion.div wrapper for magnetic effect and put the actual button inside, 
  // OR we apply magnetic effect to the button itself. 
  // Let's apply to the button itself.

  const Component = href ? motion.a : motion.button;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseXSpring, y: mouseYSpring }}
      className="inline-block"
    >
      <Component
        className={`${variants[variant]} ${className}`}
        href={href}
        onClick={onClick}
        whileTap={{ scale: 0.95 }}
      >
        <span className="relative z-10">{children}</span>
        {/* Shine effect on hover */}
        <motion.div 
          className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"
        />
      </Component>
    </motion.div>
  );
}

