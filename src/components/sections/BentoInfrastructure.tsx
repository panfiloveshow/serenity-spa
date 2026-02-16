'use client';

import { motion, useInView } from 'framer-motion';
import { TiltCard } from '../ui/TiltCard';
import { KineticText } from '../ui/KineticText';
import { INFRASTRUCTURE } from '@/lib/constants';
import { MOTION, staggerContainer, staggerChild } from '@/lib/motion';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

// Extended data for hover-reveal "second layer"
const EXTRA_DATA: Record<string, { stat: string; label: string; detail: string }> = {
  pool: { stat: '28°', label: 'Температура воды', detail: 'Современный бассейн для плавания и отдыха' },
  gym: { stat: '24/7', label: 'Доступ к залу', detail: 'Оборудование от ведущего производителя' },
  sauna: { stat: '95°', label: 'Финская сауна', detail: 'Финская и паровая сауна для полного расслабления' },
  jacuzzi: { stat: '38°', label: 'Гидромассаж', detail: 'Гидромассажная ванна для восстановления' },
};

const INFRA_IMAGES: Record<string, string> = {
  pool: '/infra-pool.webp',
  gym: '/infra-gym.webp',
  sauna: '/infra-sauna.jpg',
  jacuzzi: '/infra-jacuzzi.webp',
};

// Animated counter component
function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const parsedValue = Number.parseInt(value, 10);
  const [display, setDisplay] = useState(() => (Number.isNaN(parsedValue) ? value : '0'));
  
  useEffect(() => {
    if (!isInView) return;
    if (Number.isNaN(parsedValue)) return;
    
    let start = 0;
    const duration = 1500;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * parsedValue).toString());
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, parsedValue]);

  return <span ref={ref}>{display}{suffix}</span>;
}

export function BentoInfrastructure() {
  const items = INFRASTRUCTURE.map((item) => ({
    ...item,
    title: item.titleRu || item.title,
    extra: EXTRA_DATA[item.id],
  }));

  return (
    <section id="infrastructure" className="py-32 px-6 bg-[#1B3A5C] relative overflow-hidden">
      {/* Section background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#C8956C]/3 blur-[200px] rounded-full pointer-events-none hidden md:block" />
      
      <div className="container mx-auto relative z-10">
        <motion.div 
          className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8"
          variants={staggerContainer()}
          initial="initial"
          whileInView="animate"
          viewport={MOTION.viewport.once}
        >
          <div>
            <motion.span 
              className="text-[#C8956C] uppercase tracking-[0.25em] text-xs block mb-4"
              variants={staggerChild}
            >
              Оздоровительный центр
            </motion.span>
            <KineticText className="text-4xl md:text-6xl font-light text-[#E8DFD0]">Инфраструктура</KineticText>
          </div>
          <motion.p 
            className="text-[#7A8BA8] max-w-sm text-lg font-light leading-relaxed"
            variants={staggerChild}
          >
            Современное оборудование от ведущего производителя для вашего комфорта и здоровья.
          </motion.p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5"
          variants={staggerContainer(MOTION.stagger.slow)}
          initial="initial"
          whileInView="animate"
          viewport={MOTION.viewport.once}
        >
          {/* Large card (2 cols) */}
          <motion.div className="md:col-span-2 h-[300px] md:h-[480px]" variants={staggerChild}>
            <TiltCard className="h-full" tiltAmount={4} glowColor="#C8956C">
              <div className="relative h-full rounded-2xl border border-[#7A8BA8]/10 bg-gradient-to-br from-[#1F4268] to-[#234A72] overflow-hidden group cursor-pointer">
                {/* Background image */}
                <Image src={INFRA_IMAGES[items[0].id]} alt={items[0].title} fill className="object-cover opacity-40 group-hover:opacity-55 group-hover:scale-105 transition-all duration-700" sizes="(min-width: 768px) 66vw, 100vw" loading="lazy" />
                {/* Noise texture */}
                <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B3A5C] via-[#1B3A5C]/40 to-transparent opacity-90" />
                
                {/* Default content */}
                <div className="relative z-10 h-full p-8 md:p-10 flex flex-col justify-end">
                  <h3 className="text-3xl md:text-4xl font-light text-[#E8DFD0] mb-2">{items[0].title}</h3>
                  <p className="text-[#7A8BA8] text-lg group-hover:text-[#E8DFD0]/60 transition-colors duration-500">{items[0].description}</p>
                  
                  {/* Hover reveal — second layer */}
                  <div className="mt-4 overflow-hidden">
                    <div className="translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out flex items-baseline gap-4 pt-4 border-t border-[#C8956C]/20">
                      <span className="text-4xl md:text-5xl font-light text-[#C8956C]">
                        <AnimatedCounter value={items[0].extra?.stat || ''} />
                      </span>
                      <div>
                        <p className="text-[#E8DFD0]/80 text-sm font-medium">{items[0].extra?.label}</p>
                        <p className="text-[#7A8BA8] text-xs mt-0.5">{items[0].extra?.detail}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Right column: 2 stacked cards */}
          <div className="flex flex-col gap-4 md:gap-5">
            {[items[1], items[2]].map((item) => (
              <motion.div key={item.id} className="h-[220px] md:flex-1" variants={staggerChild}>
                <TiltCard className="h-full" tiltAmount={5} glowColor="#C8956C">
                  <div className="relative h-full rounded-2xl border border-[#7A8BA8]/10 bg-gradient-to-br from-[#1F4268]/80 to-[#263A5E]/60 overflow-hidden group cursor-pointer backdrop-blur-sm">
                    <Image src={INFRA_IMAGES[item.id]} alt={item.title} fill className="object-cover opacity-35 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700" sizes="(min-width: 768px) 33vw, 100vw" loading="lazy" />
                    <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1B3A5C] via-[#1B3A5C]/50 to-transparent" />
                    
                    <div className="relative z-10 h-full p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-light text-[#E8DFD0] mb-1">{item.title}</h3>
                        <p className="text-[#7A8BA8] text-sm group-hover:text-[#E8DFD0]/50 transition-colors duration-500">{item.description}</p>
                        
                        {/* Hover reveal */}
                        <div className="overflow-hidden">
                          <div className="translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out flex items-baseline gap-3 pt-3 mt-2 border-t border-[#C8956C]/15">
                            <span className="text-2xl font-light text-[#C8956C]">
                              <AnimatedCounter value={item.extra?.stat || ''} />
                            </span>
                            <span className="text-[#7A8BA8] text-xs">{item.extra?.label}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          {/* Full-width card with metrics */}
          <motion.div className="md:col-span-3 h-[200px] md:h-[180px]" variants={staggerChild}>
            <TiltCard className="h-full" tiltAmount={3} glowColor="#C8956C">
              <div className="relative h-full rounded-2xl border border-[#7A8BA8]/10 bg-gradient-to-r from-[#1F4268] to-[#234A72] overflow-hidden group cursor-pointer">
                <Image src={INFRA_IMAGES[items[3].id]} alt={items[3].title} fill className="object-cover object-[30%_75%] opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700" sizes="100vw" loading="lazy" />
                <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1B3A5C]/70 via-transparent to-[#1B3A5C]/60" />
                
                <div className="relative z-10 h-full p-8 md:p-10 flex items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div>
                      <h3 className="text-2xl font-light text-[#E8DFD0] mb-1">{items[3].title}</h3>
                      <p className="text-[#7A8BA8] group-hover:text-[#E8DFD0]/50 transition-colors duration-500">{items[3].description}</p>
                    </div>
                  </div>
                  
                  {/* Inline metrics */}
                  <div className="hidden md:flex items-center gap-10">
                    {[
                      { val: '1200', suffix: 'м²', label: 'Площадь' },
                      { val: '7', suffix: '', label: 'Зон отдыха' },
                      { val: '12', suffix: 'ч', label: 'Работаем' },
                    ].map((m, i) => (
                      <div key={i} className="text-center">
                        <p className="text-2xl font-light text-[#C8956C]">
                          <AnimatedCounter value={m.val} suffix={m.suffix} />
                        </p>
                        <p className="text-[#7A8BA8] text-xs mt-1 uppercase tracking-wider">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
