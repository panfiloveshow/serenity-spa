'use client';

import { useId } from 'react';

export function InputField({
  label,
  required,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}) {
  const reactId = useId();
  const inputId = `${reactId}-input`;
  const errorId = `${reactId}-error`;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-[#A0B0C8] text-[10px] uppercase tracking-[0.15em] mb-1.5 ml-1"
      >
        {label}{required && ' *'}
      </label>
      <input
        id={inputId}
        type={type}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`w-full px-4 py-3 rounded-2xl bg-[#1F4268]/40 border text-[#E8DFD0] text-sm placeholder:text-[#A0B0C8]/70 focus:outline-none focus:ring-1 transition-all duration-300 ${
          error
            ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20'
            : 'border-[#7A8BA8]/10 focus:border-[#C8956C]/30 focus:ring-[#C8956C]/15'
        }`}
      />
      {error && (
        <p id={errorId} role="alert" aria-live="polite" className="mt-1.5 ml-1 text-red-400 text-xs">{error}</p>
      )}
    </div>
  );
}
