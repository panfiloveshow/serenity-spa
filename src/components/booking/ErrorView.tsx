'use client';

import { useLang } from '@/lib/lang-context';

export function ErrorView({ onRetry, onTelegram }: { onRetry: () => void; onTelegram: () => void }) {
  const { dictionary } = useLang();
  const b = dictionary.booking;

  return (
    <div className="text-center py-10 anim-fade-scale">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/20 flex items-center justify-center mx-auto mb-6 shadow-[0_8px_30px_rgba(239,68,68,0.1)] anim-fade-scale">
        <svg className="w-9 h-9 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <h3 className="text-2xl font-semibold text-[#E8DFD0] mb-2 tracking-tight">{b.errorTitle}</h3>
      <p className="text-[#7A8BA8]/60 text-sm leading-relaxed max-w-xs mx-auto mb-6">
        {b.errorMessage}
      </p>
      <div className="flex flex-col gap-3 max-w-xs mx-auto">
        <button
          onClick={onRetry}
          className="w-full min-h-[44px] py-3 rounded-2xl bg-gradient-to-r from-[#C8956C] to-[#A07550] text-[#1B3A5C] font-semibold text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C8956C]/60"
        >
          {b.retryButton}
        </button>
        <button
          onClick={onTelegram}
          className="w-full min-h-[44px] py-3 rounded-2xl bg-[#1F4268]/60 border border-[#7A8BA8]/15 text-[#E8DFD0]/70 text-sm cursor-pointer hover:border-[#C8956C]/25 focus:outline-none focus:ring-2 focus:ring-[#C8956C]/60 transition-colors"
        >
          {b.telegramButton}
        </button>
      </div>
    </div>
  );
}
