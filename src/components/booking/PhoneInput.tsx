'use client';

import { useId } from 'react';
import { analyzePhone, normalizePhone } from '@/lib/phone-info';

export function PhoneInput({
  label,
  value,
  onChange,
  error,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
}) {
  const reactId = useId();
  const inputId = `${reactId}-phone`;
  const errorId = `${reactId}-phone-error`;

  const isComplete = analyzePhone(value).valid;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-[#A0B0C8] text-[10px] uppercase tracking-[0.15em] mb-1.5 ml-1"
      >
        {label}{required && ' *'}
        {isComplete && (
          <span className="ml-2 text-[#C8956C] text-[9px] font-normal" aria-label="complete">✓</span>
        )}
      </label>
      <input
        id={inputId}
        type="tel"
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={() => { if (isComplete) onChange(normalizePhone(value)); }}
        placeholder="+998 / +44 / +1 …"
        inputMode="tel"
        autoComplete="tel"
        maxLength={40}
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
