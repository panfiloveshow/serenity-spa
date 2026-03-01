'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useBooking } from '@/lib/booking-context';
import { useMediaQuery, useIsMobile } from '@/hooks/useMediaQuery';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// Hardcoded particle positions to avoid SSR hydration mismatch
const PARTICLES = [
  { id: 0, x: 12, y: 8, size: 2, duration: 14, delay: 1, opacity: 0.2 },
  { id: 1, x: 85, y: 22, size: 1.5, duration: 18, delay: 3, opacity: 0.15 },
  { id: 2, x: 34, y: 65, size: 3, duration: 12, delay: 0, opacity: 0.3 },
  { id: 3, x: 67, y: 45, size: 1, duration: 16, delay: 2, opacity: 0.25 },
  { id: 4, x: 91, y: 78, size: 2.5, duration: 20, delay: 4, opacity: 0.1 },
  { id: 5, x: 23, y: 92, size: 1.8, duration: 13, delay: 1.5, opacity: 0.35 },
  { id: 6, x: 56, y: 15, size: 2.2, duration: 17, delay: 0.5, opacity: 0.2 },
  { id: 7, x: 78, y: 55, size: 1.3, duration: 15, delay: 3.5, opacity: 0.15 },
  { id: 8, x: 45, y: 88, size: 2.8, duration: 19, delay: 2.5, opacity: 0.25 },
  { id: 9, x: 8, y: 35, size: 1.6, duration: 14, delay: 4.5, opacity: 0.3 },
  { id: 10, x: 62, y: 72, size: 2.1, duration: 16, delay: 1.2, opacity: 0.18 },
  { id: 11, x: 38, y: 28, size: 1.4, duration: 18, delay: 2.8, opacity: 0.22 },
  { id: 12, x: 95, y: 42, size: 2.6, duration: 13, delay: 0.8, opacity: 0.12 },
  { id: 13, x: 17, y: 58, size: 1.9, duration: 15, delay: 3.2, opacity: 0.28 },
  { id: 14, x: 73, y: 12, size: 2.3, duration: 17, delay: 1.8, opacity: 0.16 },
  { id: 15, x: 50, y: 95, size: 1.2, duration: 19, delay: 4.2, opacity: 0.32 },
  { id: 16, x: 29, y: 48, size: 2.7, duration: 12, delay: 0.3, opacity: 0.14 },
  { id: 17, x: 82, y: 68, size: 1.7, duration: 16, delay: 2.2, opacity: 0.26 },
  { id: 18, x: 6, y: 82, size: 2.4, duration: 14, delay: 3.8, opacity: 0.2 },
  { id: 19, x: 58, y: 5, size: 1.1, duration: 18, delay: 1.5, opacity: 0.24 },
];

export function ModernHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { openBooking } = useBooking();
  const isMobile = useIsMobile();
  const isLargeDesktop = useMediaQuery('(min-width: 1800px)');
  const isUltraWide = useMediaQuery('(min-width: 1920px)');
  const enableMouseTilt = !isMobile && !isUltraWide;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Multi-speed parallax layers — simplified on mobile
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', isMobile ? '10%' : '25%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, isMobile ? 1.05 : 1.15]);
  const imgRotate = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : 2]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const contentScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const orbY1 = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const orbY2 = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 0.6]);

  // Mouse-tracking 3D tilt — disabled on mobile
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 50, damping: 30 };
  const rotateXSpring = useSpring(mouseY, springConfig);
  const rotateYSpring = useSpring(mouseX, springConfig);
  const contentRotateX = useTransform(rotateXSpring, (value) => value * 0.35);
  const contentRotateY = useTransform(rotateYSpring, (value) => value * 0.35);

  const tiltYLimit = isLargeDesktop ? 1.4 : 2.4;
  const tiltXLimit = isLargeDesktop ? 0.9 : 1.6;

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!enableMouseTilt) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    if (centerX <= 0 || centerY <= 0) return;

    const rawX = (e.clientX - rect.left - centerX) / centerX;
    const rawY = (e.clientY - rect.top - centerY) / centerY;

    const normalizedX = clamp(Number.isFinite(rawX) ? rawX : 0, -1, 1);
    const normalizedY = clamp(Number.isFinite(rawY) ? rawY : 0, -1, 1);

    mouseX.set(normalizedX * tiltYLimit);
    mouseY.set(-normalizedY * tiltXLimit);
  }, [enableMouseTilt, mouseX, mouseY, tiltYLimit, tiltXLimit]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (enableMouseTilt) return;

    mouseX.set(0);
    mouseY.set(0);
  }, [enableMouseTilt, mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#152E4A]"
      id="hero"
      onMouseMove={enableMouseTilt ? handleMouseMove : undefined}
      onMouseLeave={enableMouseTilt ? handleMouseLeave : undefined}
    >
      {/* Layer 0: Deep background glow orbs — simplified on mobile */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {isMobile ? (
          <>
            <div className="absolute -top-[20%] -right-[10%] w-[300px] h-[300px] rounded-full bg-[#C8956C]/8 blur-[60px]" />
            <div className="absolute -bottom-[30%] -left-[15%] w-[350px] h-[350px] rounded-full bg-[#263A5E]/30 blur-[60px]" />
          </>
        ) : (
          <>
            <motion.div
              className="absolute -top-[20%] -right-[10%] w-[700px] h-[700px] rounded-full bg-[#C8956C]/8 blur-[120px]"
              style={{ y: orbY1, scale: orbScale }}
            />
            <motion.div
              className="absolute -bottom-[30%] -left-[15%] w-[800px] h-[800px] rounded-full bg-[#263A5E]/30 blur-[150px]"
              style={{ y: orbY2 }}
            />
            <motion.div
              className="absolute top-[30%] left-[40%] w-[400px] h-[400px] rounded-full bg-[#C8956C]/5 blur-[100px]"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </>
        )}
      </div>

      {/* Layer 1: Photo with 3D tilt + parallax */}
      <motion.div
        className="absolute top-0 right-0 bottom-0 w-full lg:w-[65%] z-[2]"
        style={enableMouseTilt ? {
          y: imgY,
          scale: imgScale,
          rotateY: rotateYSpring,
          rotateX: rotateXSpring,
          rotateZ: imgRotate,
          transformPerspective: 1200,
        } : {
          y: imgY,
          scale: imgScale,
          rotateZ: imgRotate,
        }}
      >
        <Image
          src="/hero-woman.webp"
          alt="Serenity Spa"
          fill
          className="object-cover object-[50%_15%]"
          priority
          quality={76}
          sizes="(min-width: 1024px) 65vw, 100vw"
        />
        <div className="absolute inset-0 bg-[#152E4A]/30 mix-blend-color" />
        {/* Photo edge glow */}
        <div className="absolute inset-0 shadow-[inset_0_0_100px_40px_#152E4A]" />
      </motion.div>

      {/* Layer 2: Floating golden particles — desktop only */}
      {!isMobile && (
        <div className="absolute inset-0 z-[3] pointer-events-none">
          {PARTICLES.slice(0, 10).map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-[#C8956C]"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.sin(p.id) * 15, 0],
                opacity: [0, p.opacity, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Layer 3: Overlays for depth */}
      <div className="absolute inset-0 z-[4] pointer-events-none">
        <div className="absolute inset-0 bg-[#152E4A]/50 lg:hidden" />
        <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-[#152E4A] via-[#152E4A]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#152E4A] via-[#152E4A]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#152E4A]/60 via-transparent to-transparent" />
        {/* Radial vignette for cinematic feel */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_30%,transparent_20%,#152E4A_80%)] opacity-50" />
      </div>

      {/* Layer 4: Animated decorative lines */}
      <div className="absolute inset-0 z-[5] pointer-events-none hidden lg:block">
        {/* Vertical golden line */}
        <motion.div
          className="absolute left-[8%] top-0 w-px h-full bg-gradient-to-b from-transparent via-[#C8956C]/20 to-transparent"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 2, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'top' }}
        />
        {/* Horizontal accent line */}
        <motion.div
          className="absolute left-[5%] right-[60%] top-[75%] h-px bg-gradient-to-r from-[#C8956C]/30 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'left' }}
        />
        {/* Corner accent */}
        <motion.div
          className="absolute right-[35%] top-[15%] w-24 h-24 border-t border-r border-[#C8956C]/15 rounded-tr-3xl"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
        />
      </div>

      {/* Layer 5: Content with 3D tilt */}
      <motion.div
        className="relative z-[6] h-full flex items-center"
        style={isMobile ? {
          opacity: contentOpacity,
          y: contentY,
        } : enableMouseTilt ? {
          opacity: contentOpacity,
          y: contentY,
          scale: contentScale,
          rotateY: contentRotateY,
          rotateX: contentRotateX,
          transformPerspective: 1500,
        } : {
          opacity: contentOpacity,
          y: contentY,
          scale: contentScale,
        }}
      >
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-xl lg:max-w-lg">
            {/* Tagline with glow */}
            <motion.span
              className="block text-[#C8956C] tracking-[0.35em] uppercase text-[11px] md:text-xs mb-8 font-medium"
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ textShadow: '0 0 30px rgba(200,149,108,0.3)' }}
            >
              Оздоровительный центр &middot; Ташкент
            </motion.span>

            {/* Logo with glow effect */}
            <motion.div
              initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8 relative"
            >
              {/* Logo glow behind */}
              <div className="absolute -inset-8 bg-[#C8956C]/5 blur-[40px] rounded-full" />
              <Image
                src="/logo.svg"
                alt="Serenity Spa"
                width={500}
                height={282}
                className="w-[260px] md:w-[340px] lg:w-[420px] h-auto relative z-10 drop-shadow-[0_0_30px_rgba(200,149,108,0.15)]"
              />
            </motion.div>

            {/* Animated divider */}
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <motion.div
                className="h-px bg-gradient-to-r from-[#C8956C] to-[#C8956C]/0 flex-1 max-w-[60px]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.9 }}
                style={{ transformOrigin: 'left' }}
              />
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[#C8956C]/60"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              />
            </motion.div>

            {/* Description with blur reveal */}
            <motion.p
              className="text-[#E8DFD0]/60 text-base md:text-lg font-light leading-relaxed mb-10"
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 1 }}
            >
              Центр отдыха и&nbsp;релаксации, оснащённый современным оборудованием. Бассейн, тренажёрный зал, сауны, джакузи&nbsp;&mdash; всё для&nbsp;вашего здоровья.
            </motion.p>

            {/* CTA with enhanced styling */}
            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <button
                onClick={() => openBooking()}
                className="group relative px-8 py-4 bg-[#C8956C] text-[#152E4A] rounded-full text-sm font-semibold tracking-wide overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(200,149,108,0.4)] cursor-pointer"
              >
                <span className="relative z-10">Записаться</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4A574] to-[#C8956C] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
              <a
                href="#packages"
                className="px-8 py-4 border border-[#E8DFD0]/15 text-[#E8DFD0]/70 rounded-full text-sm font-medium tracking-wide hover:border-[#C8956C]/40 hover:text-[#C8956C] hover:shadow-[0_0_30px_rgba(200,149,108,0.15)] transition-all duration-500 backdrop-blur-sm text-center"
              >
                Программы
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Layer 6: Scroll-triggered dark overlay for exit */}
      <motion.div
        className="absolute inset-0 z-[7] bg-[#152E4A] pointer-events-none"
        style={{ opacity: overlayOpacity }}
      />

      {/* Layer 7: Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[8] flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.span
          className="text-[10px] uppercase tracking-[0.3em] text-[#7A8BA8]/50"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Scroll
        </motion.span>
        <motion.div
          className="w-5 h-9 rounded-full border border-[#E8DFD0]/15 flex items-start justify-center p-1.5"
        >
          <motion.div
            className="w-1 h-2 bg-[#C8956C] rounded-full"
            animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
