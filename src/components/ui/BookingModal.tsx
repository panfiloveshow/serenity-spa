'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useBooking } from '@/lib/booking-context';
import { SERVICES, PACKAGES, MEMBERSHIP_TIERS, CONTACTS } from '@/lib/constants';
import { collectVisitorData } from '@/lib/visitor-tracker';
import { NOISE_BG } from '@/lib/motion';

type Step = 'select' | 'form' | 'sending' | 'success';
type Tab = 'services' | 'packages' | 'memberships';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'services', label: 'Услуги', icon: '💆' },
  { id: 'packages', label: 'Программы', icon: '✨' },
  { id: 'memberships', label: 'Абонементы', icon: '🏊' },
];

export function BookingModal() {
  const { isOpen, selection, closeBooking } = useBooking();
  const [step, setStep] = useState<Step>('select');
  const [activeTab, setActiveTab] = useState<Tab>('services');
  const [activeServiceCat, setActiveServiceCat] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [comment, setComment] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

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
        setComment('');
      }, 400);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const pickItem = (label: string) => {
    setSelectedLabel(label);
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('sending');
    try {
      const visitor = collectVisitorData();
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          service: selectedLabel || 'Не выбрана',
          date: date || undefined,
          comment: comment || undefined,
          visitor,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setStep('success');
    } catch {
      // Fallback: open Telegram with pre-filled message
      const msg = [
        `🌿 Новая заявка — Serenity Spa`,
        ``,
        `👤 ${name}`,
        `📱 ${phone}`,
        `💆 ${selectedLabel || 'Не выбрана'}`,
        date ? `📅 ${date}` : '',
        comment ? `💬 ${comment}` : '',
      ].filter(Boolean).join('\n');
      const tgUrl = `${CONTACTS.social.telegramUrl}?text=${encodeURIComponent(msg)}`;
      window.open(tgUrl, '_blank');
      setStep('success');
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
              onClick={closeBooking}
              className="absolute top-5 right-5 z-30 w-10 h-10 rounded-full bg-[#1F4268]/80 backdrop-blur-sm border border-[#7A8BA8]/10 flex items-center justify-center text-[#7A8BA8]/50 hover:text-[#E8DFD0] hover:border-[#C8956C]/30 hover:bg-[#1F4268] transition-all duration-300 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Header — always visible */}
            <div className="relative z-10 px-8 pt-8 pb-0 flex-shrink-0">
              <div className="flex items-center gap-4 mb-1">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C8956C] to-[#A07550] flex items-center justify-center shadow-[0_4px_20px_rgba(200,149,108,0.3)]">
                  <svg className="w-5 h-5 text-[#1B3A5C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#E8DFD0] tracking-tight">Записаться</h2>
                  <p className="text-[#7A8BA8]/50 text-xs">
                    {step === 'select' ? 'Выберите услугу' : step === 'form' ? 'Заполните данные' : step === 'success' ? 'Готово!' : 'Отправляем...'}
                  </p>
                </div>
              </div>
            </div>

            {/* Content — scrollable */}
            <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto px-8 pb-8 pt-5 scrollbar-none">
              <AnimatePresence mode="wait">
                {step === 'select' && <ServiceSelector key="sel" activeTab={activeTab} setActiveTab={setActiveTab} activeServiceCat={activeServiceCat} setActiveServiceCat={setActiveServiceCat} onPick={pickItem} />}
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
                        <p className="text-[#7A8BA8]/50 text-[9px] uppercase tracking-[0.15em]">Выбранная услуга</p>
                        <p className="text-[#E8DFD0] text-sm truncate">{selectedLabel}</p>
                      </div>
                      {selection?.price && <span className="text-[#C8956C] text-sm font-medium whitespace-nowrap">{selection.price}</span>}
                      {!selection && (
                        <svg className="w-4 h-4 text-[#7A8BA8]/30 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
                      )}
                    </button>

                    {/* Name + Phone row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <InputField label="Ваше имя" required value={name} onChange={setName} placeholder="Имя" />
                      <PhoneInput label="Телефон" value={phone} onChange={setPhone} />
                    </div>

                    {/* Date */}
                    <DatePicker label="Желаемая дата" value={date} onChange={setDate} />

                    {/* Comment */}
                    <div>
                      <label className="block text-[#7A8BA8]/50 text-[9px] uppercase tracking-[0.15em] mb-1.5 ml-1">Комментарий</label>
                      <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Пожелания..."
                        rows={2}
                        className="w-full px-4 py-3 rounded-2xl bg-[#1F4268]/40 border border-[#7A8BA8]/10 text-[#E8DFD0] text-sm placeholder:text-[#7A8BA8]/25 focus:border-[#C8956C]/30 focus:outline-none focus:ring-1 focus:ring-[#C8956C]/15 transition-all duration-300 resize-none"
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
                            Отправляем...
                          </>
                        ) : (
                          <>
                            Отправить заявку
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent z-0" />
                    </motion.button>

                    <p className="text-center text-[#7A8BA8]/30 text-[10px]">
                      Или позвоните: <a href={`tel:${CONTACTS.phone}`} className="text-[#C8956C]/50 hover:text-[#C8956C] transition-colors">{CONTACTS.phone}</a>
                    </p>
                  </motion.form>
                )}
                {step === 'success' && <SuccessView key="success" />}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ─── Service Selector ─── */
function ServiceSelector({ activeTab, setActiveTab, activeServiceCat, setActiveServiceCat, onPick }: {
  activeTab: Tab; setActiveTab: (t: Tab) => void;
  activeServiceCat: number; setActiveServiceCat: (n: number) => void;
  onPick: (label: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Tabs */}
      <div className="flex gap-1.5 p-1 rounded-2xl bg-[#1F4268]/40 border border-[#7A8BA8]/8 mb-5">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#C8956C] text-[#1B3A5C] shadow-[0_2px_12px_rgba(200,149,108,0.3)]'
                : 'text-[#7A8BA8]/60 hover:text-[#E8DFD0]'
            }`}
          >
            <span className="text-sm">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'services' && (
          <motion.div key="svc" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            {/* Category pills */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
              {SERVICES.map((cat, i) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveServiceCat(i)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-[11px] font-medium transition-all duration-300 cursor-pointer border ${
                    activeServiceCat === i
                      ? 'bg-[#C8956C]/15 text-[#C8956C] border-[#C8956C]/25'
                      : 'text-[#7A8BA8]/50 border-[#7A8BA8]/8 hover:text-[#E8DFD0] hover:border-[#7A8BA8]/20'
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
            {/* Items */}
            <div className="space-y-1.5 max-h-[40vh] overflow-y-auto pr-1 scrollbar-none">
              {SERVICES[activeServiceCat].items.map((item, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => onPick(`${SERVICES[activeServiceCat].title} — ${item.name} (${item.duration})`)}
                  className="w-full group flex items-center gap-3 px-4 py-3 rounded-2xl border border-[#7A8BA8]/6 bg-[#1F4268]/20 hover:bg-[#C8956C]/8 hover:border-[#C8956C]/20 transition-all duration-300 cursor-pointer text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[#E8DFD0]/85 text-sm group-hover:text-[#E8DFD0] transition-colors truncate">{item.name}</p>
                    <p className="text-[#7A8BA8]/40 text-[10px] mt-0.5">{item.duration}{item.desc ? ` · ${item.desc.slice(0, 50)}...` : ''}</p>
                  </div>
                  <span className="text-[#C8956C]/70 text-xs font-medium whitespace-nowrap">{item.price} <span className="text-[#C8956C]/40 text-[9px]">UZS</span></span>
                  <svg className="w-3.5 h-3.5 text-[#7A8BA8]/20 group-hover:text-[#C8956C]/50 transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'packages' && (
          <motion.div key="pkg" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1 scrollbar-none">
              {PACKAGES.map((pkg, i) => (
                <motion.button
                  key={pkg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => onPick(`Программа: ${pkg.title}`)}
                  className="w-full group p-4 rounded-2xl border border-[#7A8BA8]/8 bg-[#1F4268]/25 hover:bg-[#C8956C]/8 hover:border-[#C8956C]/20 transition-all duration-300 cursor-pointer text-left"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-[#E8DFD0] text-sm font-medium group-hover:text-[#E8DFD0] transition-colors">{pkg.title}</p>
                      <p className="text-[#7A8BA8]/40 text-[10px] mt-0.5">{pkg.duration}</p>
                    </div>
                    <span className="text-[#C8956C] text-sm font-medium whitespace-nowrap">{pkg.price}</span>
                  </div>
                  <p className="text-[#7A8BA8]/40 text-[11px] leading-relaxed line-clamp-2">{pkg.description}</p>
                  {pkg.isPopular && (
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-[#C8956C]/15 text-[#C8956C] text-[9px] uppercase tracking-wider font-medium">Популярное</span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'memberships' && (
          <motion.div key="mem" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            <div className="grid grid-cols-2 gap-2 max-h-[45vh] overflow-y-auto pr-1 scrollbar-none">
              {MEMBERSHIP_TIERS.map((tier, i) => (
                <motion.button
                  key={tier.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => onPick(`Абонемент: ${tier.name}`)}
                  className={`group p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
                    tier.isPopular
                      ? 'bg-[#C8956C]/12 border-[#C8956C]/25 hover:bg-[#C8956C]/18'
                      : 'bg-[#1F4268]/25 border-[#7A8BA8]/8 hover:bg-[#C8956C]/8 hover:border-[#C8956C]/20'
                  }`}
                >
                  <p className="text-[#E8DFD0] text-sm font-medium mb-1">{tier.name}</p>
                  <p className="text-[#C8956C]/70 text-xs font-medium mb-1">{tier.price}</p>
                  <p className="text-[#7A8BA8]/40 text-[10px]">{tier.period}</p>
                  {tier.isPopular && <span className="inline-block mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C8956C]" />}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip selection */}
      <button
        onClick={() => onPick('Консультация')}
        className="w-full mt-4 py-2.5 text-[#7A8BA8]/40 text-[11px] hover:text-[#C8956C]/60 transition-colors cursor-pointer"
      >
        Пропустить выбор — просто записаться
      </button>
    </motion.div>
  );
}

/* ─── Input Field ─── */
function InputField({ label, required, type = 'text', value, onChange, placeholder }: {
  label: string; required?: boolean; type?: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[#7A8BA8]/50 text-[9px] uppercase tracking-[0.15em] mb-1.5 ml-1">
        {label}{required && ' *'}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-2xl bg-[#1F4268]/40 border border-[#7A8BA8]/10 text-[#E8DFD0] text-sm placeholder:text-[#7A8BA8]/25 focus:border-[#C8956C]/30 focus:outline-none focus:ring-1 focus:ring-[#C8956C]/15 transition-all duration-300"
      />
    </div>
  );
}

/* ─── Phone Input with Mask ─── */
function PhoneInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    // Always start with 998
    if (!raw.startsWith('998')) {
      raw = '998' + raw.replace(/^998/, '');
    }
    // Limit to 12 digits (998 + 9 digits)
    raw = raw.slice(0, 12);
    // Format: +998 XX XXX XX XX
    let formatted = '+998';
    const after = raw.slice(3);
    if (after.length > 0) formatted += ' ' + after.slice(0, 2);
    if (after.length > 2) formatted += ' ' + after.slice(2, 5);
    if (after.length > 5) formatted += ' ' + after.slice(5, 7);
    if (after.length > 7) formatted += ' ' + after.slice(7, 9);
    onChange(formatted);
  }, [onChange]);

  return (
    <div>
      <label className="block text-[#7A8BA8]/50 text-[9px] uppercase tracking-[0.15em] mb-1.5 ml-1">{label} *</label>
      <input
        type="tel"
        required
        value={value || '+998'}
        onChange={handleChange}
        placeholder="+998 XX XXX XX XX"
        className="w-full px-4 py-3 rounded-2xl bg-[#1F4268]/40 border border-[#7A8BA8]/10 text-[#E8DFD0] text-sm placeholder:text-[#7A8BA8]/25 focus:border-[#C8956C]/30 focus:outline-none focus:ring-1 focus:ring-[#C8956C]/15 transition-all duration-300 tabular-nums tracking-wide"
      />
    </div>
  );
}

/* ─── Custom Date Picker ─── */
const MONTHS_RU = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const DAYS_RU = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

function DatePicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  // Monday-based: 0=Mon ... 6=Sun
  const firstDayRaw = new Date(viewYear, viewMonth, 1).getDay();
  const startOffset = firstDayRaw === 0 ? 6 : firstDayRaw - 1;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectDay = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    onChange(`${d}.${m}.${viewYear}`);
    setOpen(false);
  };

  const isToday = (day: number) => day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const isPast = (day: number) => new Date(viewYear, viewMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isSelected = (day: number) => {
    if (!value) return false;
    const [dd, mm, yyyy] = value.split('.');
    return parseInt(dd) === day && parseInt(mm) === viewMonth + 1 && parseInt(yyyy) === viewYear;
  };

  // Can't go before current month
  const canGoPrev = viewYear > today.getFullYear() || (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  return (
    <div ref={ref} className="relative">
      <label className="block text-[#7A8BA8]/50 text-[9px] uppercase tracking-[0.15em] mb-1.5 ml-1">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[#1F4268]/40 border border-[#7A8BA8]/10 text-sm transition-all duration-300 cursor-pointer hover:border-[#C8956C]/20 focus:border-[#C8956C]/30 focus:outline-none focus:ring-1 focus:ring-[#C8956C]/15"
      >
        <span className={value ? 'text-[#E8DFD0]' : 'text-[#7A8BA8]/25'}>{value || 'Выберите дату'}</span>
        <svg className="w-4 h-4 text-[#7A8BA8]/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 p-3 rounded-2xl bg-[#1B3A5C] border border-[#7A8BA8]/12 shadow-[0_16px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            {/* Month nav */}
            <div className="flex items-center justify-between mb-2">
              <button type="button" onClick={prevMonth} disabled={!canGoPrev} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#7A8BA8]/50 hover:text-[#E8DFD0] hover:bg-[#1F4268] disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <span className="text-[#E8DFD0] text-xs font-medium">{MONTHS_RU[viewMonth]} {viewYear}</span>
              <button type="button" onClick={nextMonth} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#7A8BA8]/50 hover:text-[#E8DFD0] hover:bg-[#1F4268] transition-all cursor-pointer">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7">
              {DAYS_RU.map(d => (
                <span key={d} className="text-center text-[8px] uppercase tracking-wider text-[#7A8BA8]/40 py-0.5">{d}</span>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-px">
              {Array.from({ length: startOffset }).map((_, i) => <span key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const past = isPast(day);
                const sel = isSelected(day);
                const tod = isToday(day);
                return (
                  <button
                    key={day}
                    type="button"
                    disabled={past}
                    onClick={() => selectDay(day)}
                    className={`h-8 rounded-lg text-[11px] font-medium transition-all duration-200 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center
                      ${sel ? 'bg-[#C8956C] text-[#1B3A5C] shadow-[0_2px_8px_rgba(200,149,108,0.4)]' : ''}
                      ${tod && !sel ? 'border border-[#C8956C]/40 text-[#C8956C]' : ''}
                      ${past ? 'text-[#7A8BA8]/15' : !sel && !tod ? 'text-[#E8DFD0]/70 hover:bg-[#1F4268] hover:text-[#E8DFD0]' : ''}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Quick actions */}
            <div className="flex justify-between mt-2 pt-2 border-t border-[#7A8BA8]/8">
              <button type="button" onClick={() => { onChange(''); setOpen(false); }} className="text-[10px] text-[#7A8BA8]/40 hover:text-[#C8956C]/60 transition-colors cursor-pointer">Очистить</button>
              <button type="button" onClick={() => selectDay(today.getDate())} disabled={viewMonth !== today.getMonth() || viewYear !== today.getFullYear()} className="text-[10px] text-[#C8956C]/60 hover:text-[#C8956C] transition-colors cursor-pointer disabled:opacity-30">Сегодня</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Success ─── */
function SuccessView() {
  return (
    <motion.div
      className="text-center py-10"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#C8956C]/20 to-[#C8956C]/5 border border-[#C8956C]/20 flex items-center justify-center mx-auto mb-6 shadow-[0_8px_30px_rgba(200,149,108,0.15)]"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, delay: 0.1, type: 'spring', stiffness: 200 }}
      >
        <svg className="w-9 h-9 text-[#C8956C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </motion.div>
      <h3 className="text-2xl font-semibold text-[#E8DFD0] mb-2 tracking-tight">Заявка отправлена</h3>
      <p className="text-[#7A8BA8]/60 text-sm leading-relaxed max-w-xs mx-auto mb-1">
        Мы свяжемся с вами для подтверждения записи
      </p>
      <p className="text-[#7A8BA8]/30 text-xs">Спасибо за обращение!</p>
    </motion.div>
  );
}
