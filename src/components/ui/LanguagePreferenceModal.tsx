'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLang } from '@/lib/lang-context';
import { LOCALE_DISPLAY } from '@/lib/locale-display';
import { SUPPORTED_LOCALES, type Locale } from '@/types/i18n';
import { buildLangSwitchHref } from '@/lib/lang-routes';

const STORAGE_KEY = 'serenity_lang_prompt_v1';

function markPromptSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* private mode */
  }
}

export function LanguagePreferenceModal() {
  const { locale, dictionary } = useLang();
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(false);
    }
  }, [mounted]);

  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  const dismiss = useCallback(() => {
    markPromptSeen();
    setVisible(false);
  }, []);

  const choose = useCallback(
    (target: Locale) => {
      markPromptSeen();
      setVisible(false);
      if (target === locale) return;
      const href = buildLangSwitchHref(pathname, target);
      router.push(href);
    },
    [locale, pathname, router]
  );

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible, dismiss]);

  const t = dictionary.languagePrompt;

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            role="presentation"
            aria-hidden="true"
            className="fixed inset-0 z-[200] bg-[#0a1628]/85 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.35 }}
          />
          <div
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 md:p-6 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lang-prompt-title"
            aria-describedby="lang-prompt-subtitle"
          >
            <motion.div
              className="pointer-events-auto w-full max-w-lg rounded-[1.75rem] border border-[#7A8BA8]/25 bg-[#1B3A5C]/95 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.55),0_0_0_1px_rgba(200,149,108,0.12)] overflow-hidden"
              initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            >
              <div className="px-8 pt-10 pb-2 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C8956C]/25 to-[#7A8BA8]/10 border border-[#C8956C]/20 mb-5 text-2xl" aria-hidden>
                  🌐
                </div>
                <h2
                  id="lang-prompt-title"
                  className="text-xl md:text-2xl font-semibold text-[#E8DFD0] tracking-tight"
                >
                  {t.title}
                </h2>
                <p id="lang-prompt-subtitle" className="mt-2 text-sm text-[#A0B0C8]">
                  {t.subtitle}
                </p>
              </div>

              <div className="px-5 pb-6 pt-4 space-y-2.5">
                {SUPPORTED_LOCALES.map((loc) => {
                  const { native, flag } = LOCALE_DISPLAY[loc];
                  const active = loc === locale;
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => choose(loc)}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer group ${
                        active
                          ? 'border-[#C8956C]/50 bg-[#C8956C]/10 shadow-[0_0_24px_rgba(200,149,108,0.12)]'
                          : 'border-[#7A8BA8]/15 bg-[#152E4A]/40 hover:border-[#C8956C]/30 hover:bg-[#1F4268]/35'
                      }`}
                    >
                      <span className="text-2xl shrink-0" aria-hidden>
                        {flag}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[15px] font-medium text-[#E8DFD0]">{native}</span>
                        <span className="text-[11px] uppercase tracking-widest text-[#7A8BA8]/80">
                          {loc}
                        </span>
                      </span>
                      {active && (
                        <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#C8956C] text-[#1B3A5C]" aria-hidden>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="px-5 pb-8 pt-0">
                <button
                  type="button"
                  onClick={dismiss}
                  className="w-full py-3 text-sm font-medium text-[#A0B0C8] hover:text-[#E8DFD0]/80 transition-colors cursor-pointer"
                >
                  {t.continueCurrent}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
