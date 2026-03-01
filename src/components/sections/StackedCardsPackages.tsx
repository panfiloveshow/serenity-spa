'use client';

import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { CTAButton } from '../ui/CTAButton';
import { PACKAGES } from '@/lib/constants';
import { KineticText } from '../ui/KineticText';
import { MOTION, staggerContainer, staggerChild, NOISE_BG } from '@/lib/motion';
import { useBooking } from '@/lib/booking-context';
import { useIsMobile } from '@/hooks/useMediaQuery';

const CARD_COLORS = ['#1F4268', '#234A72', '#1F4268', '#234A72'];
const ORB_COLORS = ['#C8956C', '#7A8BA8', '#C8956C', '#7A8BA8'];

export function StackedCardsPackages() {
  return (
    <section className="bg-[#1B3A5C] relative overflow-hidden" id="packages">
      {/* Header */}
      <div className="pt-32 pb-16 px-6">
        <div className="container mx-auto">
          <motion.div 
            className="text-center"
            variants={staggerContainer()}
            initial="initial"
            whileInView="animate"
            viewport={MOTION.viewport.once}
          >
            <motion.span className="text-[#C8956C] uppercase tracking-[0.25em] text-xs block mb-4" variants={staggerChild}>
              Незабываемый опыт
            </motion.span>
            <KineticText className="text-5xl md:text-7xl font-light text-[#E8DFD0] tracking-tight justify-center">Программы</KineticText>
          </motion.div>
        </div>
      </div>

      {/* Sticky stacking area with 3D parallax */}
      <div className="relative px-6">
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#C8956C]/3 blur-[200px] rounded-full pointer-events-none hidden md:block" />

        <div className="container mx-auto relative z-10">
          {PACKAGES.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} />
          ))}
          <div className="h-[40vh]" />
        </div>
      </div>
    </section>
  );
}

function useCard3DTransforms(scrollYProgress: MotionValue<number>, mobile: boolean) {
  const m = mobile ? 0.4 : 1;
  return {
    rotateX: useTransform(scrollYProgress, [0, 0.3, 0.5, 0.85, 1], mobile ? [0, 0, 0, 0, 0] : [18, 6, 0, 0, -3]),
    rotateY: useTransform(scrollYProgress, [0, 0.3, 0.5, 0.85, 1], mobile ? [0, 0, 0, 0, 0] : [-4, -1, 0, 0, 1]),
    scale: useTransform(scrollYProgress, [0, 0.3, 0.5, 0.85, 1], [1 - 0.18 * m, 1 - 0.06 * m, 1, 1, 1 - 0.03 * m]),
    opacity: useTransform(scrollYProgress, [0, 0.25, 0.45, 0.85, 1], [0, 0.6, 1, 1, 0.5]),
    y: useTransform(scrollYProgress, [0, 0.3, 0.5, 0.85, 1], [160 * m, 40 * m, 0, 0, -20 * m]),
    filter: useTransform(scrollYProgress, [0, 0.3, 0.5, 0.85, 1],
      mobile ? ['blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(0px)'] : ['blur(12px)', 'blur(3px)', 'blur(0px)', 'blur(0px)', 'blur(2px)']),
  };
}

function PackageCard({ pkg, index }: { pkg: typeof PACKAGES[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const { openBooking } = useBooking();

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const transforms = useCard3DTransforms(scrollYProgress, isMobile);
  const stickyTop = 80 + index * 32;

  return (
    <div
      ref={cardRef}
      className="h-[80vh] md:h-[70vh]"
      style={{ zIndex: index + 1 }}
    >
      <div className="sticky" style={{ top: stickyTop, perspective: '1200px' }}>
        <motion.div
          style={prefersReducedMotion ? {} : {
            ...transforms,
            transformOrigin: 'center top',
            willChange: 'transform, opacity, filter',
          }}
        >
          <div
            className="relative overflow-hidden p-8 md:p-12 rounded-[2rem] border border-[#7A8BA8]/10 shadow-[0_8px_60px_rgba(0,0,0,0.4)]"
            style={{ backgroundColor: CARD_COLORS[index % CARD_COLORS.length] }}
          >
            {/* Noise texture */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none rounded-[2rem]" style={{ backgroundImage: NOISE_BG }} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
              {/* Left: Info */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[#C8956C] border border-[#C8956C]/30 rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.15em]">
                    {pkg.duration}
                  </span>
                  {pkg.isPopular && (
                    <span className="bg-[#C8956C] text-[#1B3A5C] rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.15em] font-medium">
                      Популярное
                    </span>
                  )}
                </div>
                
                <h3 className="text-3xl md:text-4xl font-light text-[#E8DFD0] mb-3 tracking-tight">{pkg.title}</h3>
                <p className="text-[#7A8BA8] text-sm leading-relaxed mb-6 max-w-md">
                  {pkg.description}
                </p>
                
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-2xl md:text-3xl font-light text-[#C8956C]">{pkg.price}</span>
                </div>

                <CTAButton variant="primary" onClick={() => openBooking({
                  type: 'package',
                  name: pkg.title,
                  price: pkg.price,
                  duration: pkg.duration,
                })}>Забронировать</CTAButton>
              </div>

              {/* Right: Includes */}
              <motion.div 
                className="relative"
                variants={staggerContainer(MOTION.stagger.normal)}
                initial="initial"
                whileInView="animate"
                viewport={MOTION.viewport.once}
              >
                <ul className="space-y-0">
                  {pkg.includes.map((item, idx) => (
                    <motion.li 
                      key={idx}
                      variants={staggerChild}
                      className="flex items-center gap-4 text-[#E8DFD0]/75 text-sm border-b border-[#7A8BA8]/8 py-3.5 last:border-0 hover:text-[#E8DFD0] hover:pl-1 transition-all duration-300"
                    >
                      <span className="text-[#C8956C]/60 text-xs">✦</span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
            
            {/* Background gradient orb */}
            <div
              className="absolute -bottom-1/2 -right-1/4 w-[500px] h-[500px] rounded-full blur-[150px] opacity-10 pointer-events-none hidden md:block"
              style={{ backgroundColor: ORB_COLORS[index % ORB_COLORS.length] }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
