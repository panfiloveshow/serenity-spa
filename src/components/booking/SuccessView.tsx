'use client';

import { useLang } from '@/lib/lang-context';

export function SuccessView() {
  const { dictionary } = useLang();
  const b = dictionary.booking;

  return (
    <div className="text-center py-10 anim-fade-scale">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#C8956C]/20 to-[#C8956C]/5 border border-[#C8956C]/20 flex items-center justify-center mx-auto mb-6 shadow-[0_8px_30px_rgba(200,149,108,0.15)] anim-fade-scale">
        <svg className="w-9 h-9 text-[#C8956C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h3 className="text-2xl font-semibold text-[#E8DFD0] mb-2 tracking-tight">{b.successTitle}</h3>
      <p className="text-[#7A8BA8]/60 text-sm leading-relaxed max-w-xs mx-auto mb-1">
        {b.successMessage}
      </p>
      <p className="text-[#7A8BA8]/30 text-xs">{b.successThanks}</p>
    </div>
  );
}
