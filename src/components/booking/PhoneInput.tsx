'use client';

import { useCallback, useId } from 'react';
import { useLang } from '@/lib/lang-context';

export function PhoneInput({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const { dictionary } = useLang();
  const b = dictionary.booking;
  const reactId = useId();
  const inputId = `${reactId}-phone`;
  const errorId = `${reactId}-phone-error`;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (!raw.startsWith('998')) {
      raw = '998' + raw.replace(/^998/, '');
    }
    raw = raw.slice(0, 12);

    let formatted = '+998';
    const after = raw.slice(3);
    if (after.length > 0) formatted += ' ' + after.slice(0, 2);
    if (after.length > 2) formatted += ' ' + after.slice(2, 5);
    if (after.length > 5) formatted += ' ' + after.slice(5, 7);
    if (after.length > 7) formatted += ' ' + after.slice(7, 9);
    onChange(formatted);
  }, [onChange]);

  const phoneDigits = value.replace(/\D/g, '');
  const progress = phoneDigits.length > 3 ? phoneDigits.length - 3 : 0;
  const isComplete = phoneDigits.length === 12;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-[#A0B0C8] text-[10px] uppercase tracking-[0.15em] mb-1.5 ml-1"
      >
        {label} *
        {!isComplete && progress > 0 && (
          <span className="ml-2 text-[#A0B0C8]/80 text-[9px] font-normal normal-case tracking-normal">
            {progress} {b.digitsOf}
          </span>
        )}
        {isComplete && (
          <span className="ml-2 text-[#C8956C] text-[9px] font-normal" aria-label="complete">✓</span>
        )}
      </label>
      <input
        id={inputId}
        type="tel"
        required
        value={value || '+998'}
        onChange={handleChange}
        placeholder="+998 XX XXX XX XX"
        inputMode="numeric"
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`w-full px-4 py-3 rounded-2xl bg-[#1F4268]/40 border text-[#E8DFD0] text-sm placeholder:text-[#A0B0C8]/70 focus:outline-none focus:ring-1 transition-all duration-300 tabular-nums tracking-wide ${
          error
            ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20'
            : isComplete
            ? 'border-[#C8956C]/30 focus:border-[#C8956C]/50 focus:ring-[#C8956C]/20'
            : 'border-[#7A8BA8]/10 focus:border-[#C8956C]/30 focus:ring-[#C8956C]/15'
        }`}
      />
      {error && (
        <p id={errorId} role="alert" aria-live="polite" className="mt-1.5 ml-1 text-red-400 text-xs">{error}</p>
      )}
    </div>
  );
}
