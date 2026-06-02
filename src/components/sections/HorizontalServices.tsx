'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { SERVICES } from '@/lib/constants';
import { KineticText } from '../ui/KineticText';
import { MOTION, staggerContainer, staggerChild, NOISE_BG } from '@/lib/motion';
import { useBooking } from '@/lib/booking-context';
import { useLang } from '@/lib/lang-context';

export function HorizontalServices() {
  const [activeTab, setActiveTab] = useState(0);
  const { openBooking } = useBooking();
  const { dictionary } = useLang();

  const dictCategories = dictionary.services.categories;
  const activeCategory = SERVICES[activeTab];
  const activeDictCategory = dictCategories[activeTab];

  return (
    <section className="bg-[#1B3A5C] relative py-24 md:py-32 px-5 md:px-6 overflow-hidden scroll-mt-24 md:scroll-mt-28" id="services">
      {/* Background glows */}
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-[#C8956C]/3 blur-[200px] rounded-full pointer-events-none hidden md:block" />
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-[#7A8BA8]/3 blur-[150px] rounded-full pointer-events-none hidden md:block" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div 
          className="mb-10 md:mb-16"
          variants={staggerContainer()}
          initial="initial"
          whileInView="animate"
          viewport={MOTION.viewport.once}
        >
          <motion.span className="text-[#C8956C] uppercase tracking-[0.18em] md:tracking-[0.25em] text-[11px] md:text-xs block mb-3 md:mb-4" variants={staggerChild}>
            Меню процедур
          </motion.span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 md:gap-6">
            <KineticText className="text-[clamp(2.75rem,15vw,4rem)] md:text-7xl leading-[0.95] font-light text-[#E8DFD0] tracking-tight justify-start">{dictionary.services.sectionTitle}</KineticText>
            <motion.p className="text-[#A0B0C8] max-w-sm text-sm leading-relaxed md:text-right" variants={staggerChild}>
              {activeDictCategory.subtitle}
            </motion.p>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-10 md:mb-12 overflow-x-auto pb-2 -mx-5 md:mx-0 px-5 md:px-0 scrollbar-none">
          {SERVICES.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(i)}
              className={`relative px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-400 cursor-pointer
                ${activeTab === i 
                  ? 'bg-[#C8956C] text-[#1B3A5C]' 
                  : 'bg-[#1F4268]/60 text-[#A0B0C8] hover:text-[#E8DFD0] hover:bg-[#1F4268] border border-[#7A8BA8]/10'
                }
              `}
            >
              {activeTab === i && (
                <motion.div
                  layoutId="services-tab"
                  className="absolute inset-0 bg-[#C8956C] rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-[10px] opacity-60">0{i + 1}</span>
                {dictCategories[i].title}
              </span>
            </button>
          ))}
        </div>

        {/* Active Category Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
              {/* Left: Category info */}
              <div className="relative">
                <div className="lg:sticky lg:top-32">
                  {/* Big decorative number */}
                  <span className="text-[96px] md:text-[200px] font-bold text-[#234A72]/15 font-serif leading-none select-none block -mb-10 md:-mb-24">
                    0{activeTab + 1}
                  </span>
                  <div className="relative z-10">
                    <h3 className="text-3xl md:text-4xl font-light text-[#E8DFD0] mb-3">{activeDictCategory.title}</h3>
                    <p className="text-[#A0B0C8] text-sm leading-relaxed mb-6">{activeDictCategory.subtitle}</p>
                    <div className="flex items-center gap-4 text-[#7A8BA8]/50 text-xs">
                      <span>{activeCategory.items.length} процедур</span>
                      <span className="w-1 h-1 rounded-full bg-[#7A8BA8]/30" />
                      <span>от {Math.min(...activeCategory.items.map(i => parseInt(i.price.replace(/\s/g, ''))))} UZS</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Menu items */}
              <div className="relative rounded-2xl border border-[#7A8BA8]/8 bg-[#1F4268]/30 backdrop-blur-sm overflow-hidden">
                {/* Noise */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: NOISE_BG }} />

                <div className="relative z-10 divide-y divide-[#7A8BA8]/8">
                  {activeCategory.items.map((item, idx) => {
                    const dictItem = activeDictCategory.items[idx];
                    return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${dictItem.name} — ${dictItem.duration}, ${item.price} UZS. Записаться`}
                      className="group/item px-6 md:px-8 py-5 hover:bg-[#C8956C]/8 focus:bg-[#C8956C]/8 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#C8956C]/40 transition-all duration-300 cursor-pointer"
                      onClick={() => openBooking({
                        type: 'service',
                        category: activeDictCategory.title,
                        name: dictItem.name,
                        price: `${item.price} UZS`,
                        duration: dictItem.duration,
                      })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openBooking({
                            type: 'service',
                            category: activeDictCategory.title,
                            name: dictItem.name,
                            price: `${item.price} UZS`,
                            duration: dictItem.duration,
                          });
                        }
                      }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        {/* Left: name + duration */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-3">
                            <span className="text-[#E8DFD0]/90 text-base font-light group-hover/item:text-[#E8DFD0] transition-colors truncate">
                              {dictItem.name}
                            </span>
                            <span className="hidden sm:inline text-[#7A8BA8]/40 text-[10px] flex-shrink-0">
                              {'· · · · · · · · · · · · · · · · · · · · · ·'}
                            </span>
                          </div>
                        </div>

                        {/* Right: duration + price */}
                        <div className="flex items-baseline gap-4 flex-shrink-0">
                          <span className="text-[#A0B0C8] text-xs hidden sm:block tabular-nums">{dictItem.duration}</span>
                          <span className="text-[#C8956C] text-base font-medium tabular-nums">
                            {item.price}
                            <span className="text-[9px] text-[#C8956C]/40 ml-1">UZS</span>
                          </span>
                        </div>
                      </div>

                      {/* Description — expand on hover */}
                      {dictItem.desc && (
                        <div className="max-h-0 opacity-0 group-hover/item:max-h-96 group-hover/item:opacity-100 group-focus/item:max-h-96 group-focus/item:opacity-100 transition-all duration-400 overflow-hidden">
                          <p className="text-[#D8E1EF]/80 text-sm mt-3 leading-relaxed pr-0 sm:pr-10">
                            {dictItem.desc}
                          </p>
                        </div>
                      )}

                      {/* Mobile duration */}
                      <span className="text-[#A0B0C8] text-xs sm:hidden mt-1.5 block tabular-nums">{dictItem.duration}</span>
                    </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={MOTION.viewport.once}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => openBooking()}
            className="px-8 py-4 border border-[#7A8BA8]/15 text-[#E8DFD0]/70 rounded-full text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#E8DFD0] hover:text-[#1B3A5C] hover:border-[#E8DFD0] transition-all duration-500 cursor-pointer"
          >
            {dictionary.nav.bookButton}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
