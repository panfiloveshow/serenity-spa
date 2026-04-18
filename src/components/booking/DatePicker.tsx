'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/lang-context';

export function DatePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const { dictionary } = useLang();
  const months = dictionary.booking.months;
  const days = dictionary.booking.days;

  const [open, setOpen] = useState(false);
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
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

  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const isPast = (day: number) =>
    new Date(viewYear, viewMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isSelected = (day: number) => {
    if (!value) return false;
    const [dd, mm, yyyy] = value.split('.');
    return parseInt(dd) === day && parseInt(mm) === viewMonth + 1 && parseInt(yyyy) === viewYear;
  };

  const canGoPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  return (
    <div ref={ref} className="relative">
      <span id="booking-date-label" className="block text-[#A0B0C8] text-[10px] uppercase tracking-[0.15em] mb-1.5 ml-1">{label}</span>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-labelledby="booking-date-label"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[#1F4268]/40 border border-[#7A8BA8]/10 text-sm transition-all duration-300 cursor-pointer hover:border-[#C8956C]/20 focus:border-[#C8956C]/30 focus:outline-none focus:ring-1 focus:ring-[#C8956C]/15"
      >
        <span className={value ? 'text-[#E8DFD0]' : 'text-[#A0B0C8]/70'}>{value || dictionary.booking.datePlaceholder}</span>
        <svg className="w-4 h-4 text-[#7A8BA8]/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={prevMonth}
                disabled={!canGoPrev}
                aria-label="Предыдущий месяц"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#7A8BA8]/50 hover:text-[#E8DFD0] hover:bg-[#1F4268] disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <span className="text-[#E8DFD0] text-xs font-medium">{months[viewMonth]} {viewYear}</span>
              <button
                type="button"
                onClick={nextMonth}
                aria-label="Следующий месяц"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#7A8BA8]/50 hover:text-[#E8DFD0] hover:bg-[#1F4268] transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>

            <div className="grid grid-cols-7">
              {days.map((d: string) => (
                <span key={d} className="text-center text-[8px] uppercase tracking-wider text-[#7A8BA8]/40 py-0.5">{d}</span>
              ))}
            </div>

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
                    aria-disabled={past}
                    aria-pressed={sel}
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
