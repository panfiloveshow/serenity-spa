'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/lib/booking-context';
import { sanitizePhoneHref, trackBookingFormSubmission } from '@/lib/analytics';
import { CONTACTS } from '@/lib/constants';
import { collectVisitorData } from '@/lib/visitor-tracker';
import { NOISE_BG } from '@/lib/motion';
import { useLang } from '@/lib/lang-context';
import { InputField } from '@/components/booking/InputField';
import { PhoneInput } from '@/components/booking/PhoneInput';
import { DatePicker } from '@/components/booking/DatePicker';
import { TimePicker } from '@/components/booking/TimePicker';
import { ServiceSelector, type BookingTab } from '@/components/booking/ServiceSelector';
import { ErrorView } from '@/components/booking/ErrorView';
import { SuccessView } from '@/components/booking/SuccessView';

type Step = 'select' | 'form' | 'sending' | 'success' | 'error';
type Tab = BookingTab;

export function BookingModal() {
  const { isOpen, selection, closeBooking } = useBooking();
  const { dictionary, locale } = useLang();
  const b = dictionary.booking;
  const router = useRouter();

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'services', label: b.tabs.services, icon: '💆' },
    { id: 'packages', label: b.tabs.packages, icon: '✨' },
    { id: 'memberships', label: b.tabs.memberships, icon: '🏊' },
  ];

  const [step, setStep] = useState<Step>('select');
  const [activeTab, setActiveTab] = useState<Tab>('services');
  const [activeServiceCat, setActiveServiceCat] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [comment, setComment] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot field
  const [formOpenedAt, setFormOpenedAt] = useState<number>(0);
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // If opened with a pre-selection, skip to form
  useEffect(() => {
    if (selection) {
      const label = selection.category
        ? `${selection.category} — ${selection.name}${selection.duration ? ` (${selection.duration})` : ''}`
        : selection.name;
      setSelectedLabel(label);
      setStep('form');
    } else {
      setStep('select');
    }
  }, [selection]);

  // Track when form is opened
  useEffect(() => {
    if (step === 'form' && formOpenedAt === 0) {
      setFormOpenedAt(Date.now());
    }
  }, [step, formOpenedAt]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep('select');
        setActiveTab('services');
        setActiveServiceCat(0);
        setSelectedLabel('');
        setName('');
        setPhone('');
        setDate('');
        setTime('');
        setComment('');
        setWebsite('');
        setFormOpenedAt(0);
        setNameError('');
        setPhoneError('');
      }, 400);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // a11y: focus trap + Escape to close
  useEffect(() => {
    if (!isOpen) return;

    // Remember which element had focus before opening so we can restore it on close
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Move focus into the modal on open
    const focusTimeout = setTimeout(() => {
      const node = modalRef.current;
      if (!node) return;
      const focusable = node.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      (focusable[0] ?? closeButtonRef.current)?.focus();
    }, 100);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeBooking();
        return;
      }
      if (e.key !== 'Tab') return;

      const node = modalRef.current;
      if (!node) return;
      const focusable = Array.from(node.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )).filter(el => el.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => {
      clearTimeout(focusTimeout);
      document.removeEventListener('keydown', handleKey);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, closeBooking]);

  const pickItem = (label: string) => {
    setSelectedLabel(label);
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setNameError('');
    setPhoneError('');
    
    // Validate name: letters (Cyrillic/Latin/Uzbek), spaces, hyphens, apostrophe-like chars (oʻ, gʻ)
    const nameRegex = /^[а-яА-ЯёЁa-zA-Zʻʼʽ''`\s\-]+$/;
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setNameError(b.nameMinError);
      return;
    }
    if (!nameRegex.test(trimmedName)) {
      setNameError(b.nameCharsError);
      return;
    }
    
    // Validate phone: must be exactly +998 XX XXX XX XX (12 digits total)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 12) {
      setPhoneError(b.phoneError);
      return;
    }
    
    setStep('sending');
    try {
      const visitor = collectVisitorData();
      
      // Add timeout to fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
      
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          phone,
          service: selectedLabel || b.notSelected,
          date: date || undefined,
          time: time || undefined,
          comment: comment || undefined,
          website, // Honeypot
          formOpenedAt,
          pageLocale: locale,
          visitor,
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Неизвестная ошибка' }));
        throw new Error(errorData.error || 'Failed');
      }
      
      // Success — fire confetti unless the user prefers reduced motion.
      // canvas-confetti is ~100KB; lazy-load only on the happy path.
      const prefersReduced = typeof window !== 'undefined'
        && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReduced) {
        import('canvas-confetti').then(m => {
          m.default({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#C8956C', '#E8DFD0', '#7A8BA8'],
          });
        }).catch(() => {
          // Confetti is cosmetic — failure is non-fatal
        });
      }
      trackBookingFormSubmission({
        service: selectedLabel || b.notSelected,
        date,
        time,
        hasComment: Boolean(comment),
        source: 'booking_modal',
      });

      closeBooking();
      router.push(`/${locale}/thank-you`);
    } catch (error: unknown) {
      console.error('Booking submission error:', error);
      // Network error or timeout — show error so user can retry or contact via Telegram.
      // We cannot fake success here: the server never saw the request, so the fallback
      // queue on the server side is not triggered.
      setStep('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[#070d18]/85 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBooking}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            className="relative w-full max-w-[520px] max-h-[92vh] flex flex-col rounded-[2rem] border border-[#C8956C]/10 bg-gradient-to-b from-[#1B3A5C] to-[#152E4A] shadow-[0_32px_100px_rgba(0,0,0,0.7),0_0_0_1px_rgba(200,149,108,0.05)]"
            initial={{ opacity: 0, scale: 0.92, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 30 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Noise */}
            <div className="absolute inset-0 opacity-[0.025] mix-blend-overlay pointer-events-none rounded-[2rem]" style={{ backgroundImage: NOISE_BG }} />

            {/* Ambient glows */}
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#C8956C]/6 blur-[120px] rounded-full pointer-events-none hidden md:block" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#234A72]/30 blur-[100px] rounded-full pointer-events-none hidden md:block" />

            {/* Close */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeBooking}
              aria-label="Закрыть форму записи"
              className="absolute top-5 right-5 z-30 w-10 h-10 rounded-full bg-[#1F4268]/80 backdrop-blur-sm border border-[#7A8BA8]/10 flex items-center justify-center text-[#7A8BA8]/50 hover:text-[#E8DFD0] hover:border-[#C8956C]/30 hover:bg-[#1F4268] focus:outline-none focus:ring-2 focus:ring-[#C8956C]/60 focus:ring-offset-2 focus:ring-offset-[#1B3A5C] transition-all duration-300 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Header — always visible */}
            <div className="relative z-10 px-5 sm:px-8 pt-7 sm:pt-8 pr-16 sm:pr-20 pb-0 flex-shrink-0">
              <div className="flex items-center gap-4 mb-1">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C8956C] to-[#A07550] flex items-center justify-center shadow-[0_4px_20px_rgba(200,149,108,0.3)]">
                  <svg className="w-5 h-5 text-[#1B3A5C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                  </svg>
                </div>
                <div>
                  <h2 id="booking-modal-title" className="text-xl font-semibold text-[#E8DFD0] tracking-tight">{b.title}</h2>
                  <p className="text-[#7A8BA8]/50 text-xs">
                    {step === 'select' ? b.stepSelect : step === 'form' ? b.stepForm : step === 'success' ? b.stepSuccess : step === 'error' ? b.stepError : b.stepSending}
                  </p>
                </div>
              </div>
            </div>

            {/* Content — scrollable */}
            <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto px-5 sm:px-8 pb-6 sm:pb-8 pt-5 scrollbar-none">
              <AnimatePresence mode="wait">
                {step === 'select' && <ServiceSelector key="sel" activeTab={activeTab} setActiveTab={setActiveTab} activeServiceCat={activeServiceCat} setActiveServiceCat={setActiveServiceCat} onPick={pickItem} tabs={TABS} />}
                {(step === 'form' || step === 'sending') && (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    {/* Selected service chip */}
                    <button
                      type="button"
                      onClick={() => { if (!selection) setStep('select'); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300 text-left ${
                        selection ? 'bg-[#C8956C]/8 border-[#C8956C]/20 cursor-default' : 'bg-[#1F4268]/40 border-[#7A8BA8]/10 hover:border-[#C8956C]/25 cursor-pointer'
                      }`}
                    >
                      <span className="w-8 h-8 rounded-xl bg-[#C8956C]/15 flex items-center justify-center text-[#C8956C] text-sm flex-shrink-0">✦</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[#7A8BA8]/50 text-[9px] uppercase tracking-[0.15em]">{b.selectedService}</p>
                        <p className="text-[#E8DFD0] text-sm truncate">{selectedLabel}</p>
                      </div>
                      {selection?.price && <span className="text-[#C8956C] text-sm font-medium whitespace-nowrap">{selection.price}</span>}
                      {!selection && (
                        <svg className="w-4 h-4 text-[#7A8BA8]/30 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
                      )}
                    </button>

                    {/* Name + Phone row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <InputField label={b.nameLabel} required value={name} onChange={setName} placeholder={b.namePlaceholder} error={nameError} />
                      <PhoneInput label={b.phoneLabel} value={phone} onChange={setPhone} error={phoneError} />
                    </div>

                    {/* Date + Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <DatePicker label={b.dateLabel} value={date} onChange={setDate} />
                      <TimePicker label={b.timeLabel} value={time} onChange={setTime} />
                    </div>

                    {/* Honeypot field - hidden from users */}
                    <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
                      <label htmlFor="website">Website</label>
                      <input
                        type="text"
                        id="website"
                        name="website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    {/* Comment */}
                    <div>
                      <label htmlFor="booking-comment" className="block text-[#A0B0C8] text-[10px] uppercase tracking-[0.15em] mb-1.5 ml-1">{b.commentLabel}</label>
                      <textarea
                        id="booking-comment"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder={b.commentPlaceholder}
                        rows={2}
                        className="w-full px-4 py-3 rounded-2xl bg-[#1F4268]/40 border border-[#7A8BA8]/10 text-[#E8DFD0] text-sm placeholder:text-[#A0B0C8]/70 focus:border-[#C8956C]/30 focus:outline-none focus:ring-1 focus:ring-[#C8956C]/15 transition-all duration-300 resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={step === 'sending'}
                      className="group w-full py-4 rounded-2xl bg-gradient-to-r from-[#C8956C] to-[#A07550] text-[#1B3A5C] font-semibold text-sm tracking-wide shadow-[0_8px_30px_rgba(200,149,108,0.25)] hover:shadow-[0_12px_40px_rgba(200,149,108,0.35)] transition-all duration-500 cursor-pointer disabled:opacity-60 disabled:cursor-wait relative overflow-hidden"
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {step === 'sending' ? (
                          <>
                            <motion.div className="w-4 h-4 border-2 border-[#1B3A5C]/30 border-t-[#1B3A5C] rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                            {b.sendingButton}
                          </>
                        ) : (
                          <>
                            {b.submitButton}
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent z-0" />
                    </motion.button>

                    <p className="text-center text-[#A0B0C8] text-xs">
                      {b.orCall} <a href={sanitizePhoneHref(CONTACTS.phone)} data-analytics-location="booking_modal" className="text-[#C8956C] hover:text-[#E0B590] underline-offset-2 hover:underline transition-colors">{CONTACTS.phone}</a>
                    </p>
                  </motion.form>
                )}
                {step === 'success' && <SuccessView key="success" />}
                {step === 'error' && <ErrorView key="error" onRetry={() => setStep('form')} onTelegram={() => { const msg = [`🌿 Новая заявка — Serenity Spa`, ``, `👤 ${name}`, `📱 ${phone}`, `💆 ${selectedLabel || b.notSelected}`, date ? `📅 ${date}` : '', time ? `⏰ ${time}` : '', comment ? `💬 ${comment}` : ''].filter(Boolean).join('\n'); window.open(`${CONTACTS.social.telegramUrl}?text=${encodeURIComponent(msg)}`, '_blank'); }} />}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
