'use client';

import { useEffect, useState } from 'react';
import { useBooking } from '@/lib/booking-context';
import { useLang } from '@/lib/lang-context';
import { CONTACTS } from '@/lib/constants';
import { sanitizePhoneHref } from '@/lib/analytics';

/**
 * Sticky bottom CTA for mobile devices.
 * - Hidden above 768px (desktop nav already has a persistent Book button)
 * - Revealed after the user scrolls past the hero (~60vh) so it doesn't compete with the initial CTA
 * - Respects safe-area-inset-bottom for iPhone / gesture bars
 */
export function MobileStickyCTA() {
  const { openBooking, isOpen } = useBooking();
  const { dictionary } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const threshold = typeof window !== 'undefined' ? window.innerHeight * 0.6 : 600;
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (isOpen) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 md:hidden transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-hidden={!visible}
    >
      <div className="mx-3 mb-3 rounded-2xl bg-[#152E4A]/95 backdrop-blur-lg border border-[#C8956C]/20 shadow-[0_8px_40px_rgba(0,0,0,0.5)] p-2 flex items-center gap-2">
        <a
          href={sanitizePhoneHref(CONTACTS.phone)}
          aria-label={dictionary.a11y.call}
          className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#1F4268] border border-[#7A8BA8]/15 flex items-center justify-center text-[#C8956C] hover:bg-[#2A5580] transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </a>
        <button
          type="button"
          onClick={() => openBooking()}
          className="flex-1 min-h-[48px] rounded-xl bg-gradient-to-r from-[#C8956C] to-[#A07550] text-[#1B3A5C] font-semibold text-sm tracking-wide shadow-[0_4px_20px_rgba(200,149,108,0.3)] active:scale-[0.98] transition-transform"
        >
          {dictionary.hero.ctaBook}
        </button>
      </div>
    </div>
  );
}
