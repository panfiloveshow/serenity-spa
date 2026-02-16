'use client';

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useBooking } from '@/lib/booking-context';

const navItems = [
  { name: 'Услуги', href: '#services' },
  { name: 'Программы', href: '#packages' },
  { name: 'Абонементы', href: '#membership' },
  { name: 'Контакты', href: '#contacts' },
];

export function IslandNavbar() {
  const [active, setActive] = useState('');
  const [showLogo, setShowLogo] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const { openBooking } = useBooking();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldShow = latest > 500;
    if (shouldShow !== showLogo) {
      setShowLogo(shouldShow);
    }
  });

  return (
    <>
      {/* Desktop navbar */}
      <div className="fixed top-6 left-0 right-0 z-50 hidden md:flex justify-center pointer-events-none">
        <motion.nav 
          className="pointer-events-auto bg-[#1B3A5C]/80 backdrop-blur-xl border border-[#7A8BA8]/20 rounded-full px-3 py-2 shadow-2xl shadow-black/20"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <ul className="flex items-center gap-1">
            {/* Logo - Hides at top to avoid duplication with Hero logo */}
            <AnimatePresence>
              {showLogo && (
                <motion.li
                  initial={{ width: 0, opacity: 0, marginRight: 0 }}
                  animate={{ width: 'auto', opacity: 1, marginRight: 0 }}
                  exit={{ width: 0, opacity: 0, marginRight: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <Link 
                    href="#hero" 
                    onClick={() => setActive('')}
                    className="flex items-center px-2 py-1"
                  >
                    <Image 
                      src="/logo.svg" 
                      alt="Serenity Spa" 
                      width={120} 
                      height={40} 
                      className="h-8 w-auto opacity-90 hover:opacity-100 transition-opacity"
                    />
                  </Link>
                </motion.li>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showLogo && (
                <motion.li 
                  initial={{ width: 0, opacity: 0, margin: 0 }}
                  animate={{ width: '1px', opacity: 1, marginLeft: '0.25rem', marginRight: '0.25rem' }}
                  exit={{ width: 0, opacity: 0, margin: 0 }}
                  className="h-5 bg-[#7A8BA8]/20" 
                />
              )}
            </AnimatePresence>

            {navItems.map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  onClick={() => setActive(item.name)}
                  className="relative px-4 py-2.5 block text-sm font-medium transition-colors"
                >
                  {active === item.name && (
                    <motion.div 
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-[#C8956C] rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 ${active === item.name ? 'text-[#1B3A5C]' : 'text-[#E8DFD0] hover:text-[#C8956C]'}`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
            <li className="ml-1 pl-1 border-l border-[#7A8BA8]/20">
              <button
                onClick={() => openBooking()}
                aria-label="Открыть форму записи"
                className="px-5 py-2.5 bg-[#E8DFD0] text-[#1B3A5C] rounded-full text-sm font-bold hover:bg-white transition-colors cursor-pointer"
              >
                Записаться
              </button>
            </li>
          </ul>
        </motion.nav>
      </div>

      {/* Mobile navbar */}
      <div className="fixed top-4 left-4 right-4 z-50 md:hidden pointer-events-none">
        <motion.div
          className="pointer-events-auto flex items-center justify-between bg-[#1B3A5C]/85 backdrop-blur-xl border border-[#7A8BA8]/15 rounded-2xl px-4 py-2.5 shadow-2xl shadow-black/20"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="#hero" onClick={() => { setActive(''); setMobileOpen(false); }}>
            <Image src="/logo.svg" alt="Serenity Spa" width={100} height={32} className="h-7 w-auto opacity-90" />
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openBooking()}
              aria-label="Открыть форму записи"
              className="px-4 py-2 bg-[#C8956C] text-[#1B3A5C] rounded-xl text-xs font-bold cursor-pointer"
            >
              Записаться
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
              className="w-9 h-9 rounded-xl border border-[#7A8BA8]/15 flex items-center justify-center text-[#E8DFD0]/70 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <><path d="M4 8h16" /><path d="M4 16h16" /></>}
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto mt-2 bg-[#1B3A5C]/95 backdrop-blur-xl border border-[#7A8BA8]/12 rounded-2xl p-2 shadow-[0_16px_50px_rgba(0,0,0,0.4)]"
            >
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => { setActive(item.name); setMobileOpen(false); }}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active === item.name
                      ? 'bg-[#C8956C]/15 text-[#C8956C]'
                      : 'text-[#E8DFD0]/80 hover:bg-[#1F4268]/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
