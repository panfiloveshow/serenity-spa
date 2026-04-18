'use client';

import { useEffect, useRef, useState, useId } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLang } from '@/lib/lang-context';
import { LOCALE_DISPLAY } from '@/lib/locale-display';
import { SUPPORTED_LOCALES } from '@/types/i18n';
import { buildLangSwitchHref } from '@/lib/lang-routes';

export { buildLangSwitchHref } from '@/lib/lang-routes';

export function LanguageSwitcher({ variant = 'navbar' }: { variant?: 'navbar' | 'menu' }) {
  const { locale, dictionary } = useLang();
  const ariaOpenMenu = `${dictionary.nav.language}: ${LOCALE_DISPLAY[locale].native}`;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = LOCALE_DISPLAY[locale];
  const short = dictionary.languageSwitcher[locale];

  return (
    <div ref={rootRef} className={`relative ${variant === 'menu' ? 'w-full' : ''}`}>
      <button
        type="button"
        aria-label={ariaOpenMenu}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 rounded-full border transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#C8956C]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B3A5C] ${
          variant === 'menu'
            ? 'w-full justify-between px-4 py-3 border-[#7A8BA8]/20 bg-[#152E4A]/50 hover:border-[#C8956C]/25'
            : 'pl-3 pr-2.5 py-1.5 border-[#7A8BA8]/20 bg-[#152E4A]/35 hover:border-[#C8956C]/30 hover:bg-[#1F4268]/40'
        }`}
      >
        <span className="flex items-center gap-2 min-w-0">
          <span className="text-lg leading-none shrink-0" aria-hidden>
            {current.flag}
          </span>
          <span className="flex flex-col items-start min-w-0 text-left">
            <span className="text-[13px] font-semibold text-[#E8DFD0] leading-tight truncate max-w-[7rem]">
              {current.native}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#C8956C]/90">{short}</span>
          </span>
        </span>
        <svg
          className={`w-4 h-4 text-[#A0B0C8] shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={listId}
            role="listbox"
            aria-label="Language"
            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className={`z-[80] ${
              variant === 'menu'
                ? 'relative mt-2 w-full'
                : 'absolute right-0 top-[calc(100%+10px)] min-w-[220px]'
            }`}
          >
            <div
              className={`rounded-2xl border border-[#7A8BA8]/20 bg-[#1B3A5C]/95 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.45)] p-1.5 ${
                variant === 'menu' ? '' : ''
              }`}
            >
              {SUPPORTED_LOCALES.map((loc) => {
                const isActive = loc === locale;
                const { native, flag } = LOCALE_DISPLAY[loc];
                const href = buildLangSwitchHref(pathname, loc);
                return (
                  <Link
                    key={loc}
                    href={href}
                    scroll={false}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      isActive
                        ? 'bg-[#C8956C]/15 text-[#E8DFD0] ring-1 ring-[#C8956C]/25'
                        : 'text-[#E8DFD0]/85 hover:bg-[#152E4A]/80'
                    }`}
                  >
                    <span className="text-lg leading-none" aria-hidden>
                      {flag}
                    </span>
                    <span className="flex-1 font-medium">{native}</span>
                    <span className="text-[10px] uppercase tracking-wider text-[#A0B0C8]">{loc}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
