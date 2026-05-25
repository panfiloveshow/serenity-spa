'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useLang } from '@/lib/lang-context';

const TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
];

export function TimePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = useId();
  const { dictionary } = useLang();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOnPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', closeOnPointerDown);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnPointerDown);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  const displayValue = value || dictionary.booking.timePlaceholder;

  return (
    <div ref={rootRef} className="relative z-20">
      <label id={`${id}-label`} className="block text-[#A0B0C8] text-[10px] uppercase tracking-[0.15em] mb-1.5 ml-1">
        {label}
      </label>
      <div className="relative">
        <button
          id={id}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={`${id}-label ${id}`}
          onClick={() => setOpen((current) => !current)}
          className={`w-full px-4 py-3 pr-10 rounded-2xl bg-[#1F4268]/40 border border-[#7A8BA8]/10 text-left text-sm transition-all duration-300 cursor-pointer hover:border-[#C8956C]/20 focus:border-[#C8956C]/30 focus:outline-none focus:ring-1 focus:ring-[#C8956C]/15 ${
            value ? 'text-[#E8DFD0]' : 'text-[#A0B0C8]/70'
          }`}
        >
          {displayValue}
        </button>
        <svg className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8BA8]/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
        {open && (
          <div
            role="listbox"
            aria-labelledby={`${id}-label`}
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[140] max-h-52 overflow-y-auto rounded-2xl border border-[#C8956C]/20 bg-[#152E4A] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.5)]"
          >
            <button
              type="button"
              role="option"
              aria-selected={!value}
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
              className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-[#A0B0C8]/75 transition-colors hover:bg-[#1F4268]/70 hover:text-[#E8DFD0] focus:bg-[#1F4268]/70 focus:outline-none"
            >
              {dictionary.booking.timePlaceholder}
            </button>
            {TIME_SLOTS.map((slot) => {
              const selected = slot === value;

              return (
                <button
                  key={slot}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(slot);
                    setOpen(false);
                  }}
                  className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    selected
                      ? 'bg-[#C8956C] text-[#152E4A] font-semibold'
                      : 'text-[#E8DFD0] hover:bg-[#1F4268]/70 focus:bg-[#1F4268]/70 focus:outline-none'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
