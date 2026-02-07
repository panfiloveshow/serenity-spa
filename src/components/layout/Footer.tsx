'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { CONTACTS } from '@/lib/constants';
import { MOTION } from '@/lib/motion';

const NAV_COLUMNS = [
  {
    title: 'Навигация',
    links: [
      { label: 'Инфраструктура', href: '#infrastructure' },
      { label: 'Авторские услуги', href: '#services' },
      { label: 'Программы', href: '#packages' },
      { label: 'Абонементы', href: '#membership' },
      { label: 'Контакты', href: '#contacts' },
    ],
  },
  {
    title: 'Услуги',
    links: [
      { label: 'Массажи', href: '#services' },
      { label: 'Уходы за телом', href: '#services' },
      { label: 'SPA пакеты', href: '#packages' },
      { label: 'Бассейн и сауны', href: '#infrastructure' },
    ],
  },
];

const SOCIAL = [
  {
    name: 'Instagram',
    href: CONTACTS.social.instagramUrl,
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    name: 'Telegram',
    href: CONTACTS.social.telegramUrl,
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 2-7 20-4-9-9-4z" />
        <path d="M22 2 11 13" />
      </svg>
    ),
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#152E4A] relative overflow-hidden">
      {/* Giant watermark text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[18vw] font-light tracking-[0.15em] text-[#E8DFD0]/[0.015] uppercase whitespace-nowrap">
          SERENITY
        </span>
      </div>

      {/* Gradient divider — seamless transition from contacts */}
      <div className="relative h-px">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C8956C]/30 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={MOTION.viewport.once}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Main footer content */}
      <div className="relative z-10 px-6 pt-20 pb-8">
        <div className="container mx-auto max-w-7xl">
          {/* Top section: 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.2fr] gap-12 md:gap-8 mb-20">
            {/* Nav columns */}
            {NAV_COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#C8956C]/60 mb-6">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[#E8DFD0]/40 text-sm font-light hover:text-[#E8DFD0] hover:pl-1 transition-all duration-300 block"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Brand column */}
            <div className="flex flex-col items-start md:items-end">
              <Image
                src="/logo.svg"
                alt="Serenity Spa"
                width={200}
                height={70}
                className="w-[160px] h-auto opacity-30 hover:opacity-50 transition-opacity duration-500 mb-6"
              />
              <p className="text-[#7A8BA8]/30 text-xs leading-relaxed max-w-[240px] md:text-right mb-6">
                Оздоровительный центр в&nbsp;Ташкенте. Бассейн, сауны, массажи и&nbsp;авторские SPA&nbsp;программы.
              </p>

              {/* Social icons */}
              <div className="flex gap-2">
                {SOCIAL.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="w-10 h-10 rounded-full border border-[#7A8BA8]/10 flex items-center justify-center text-[#7A8BA8]/30 hover:text-[#C8956C] hover:border-[#C8956C]/30 transition-all duration-300"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="relative">
            {/* Thin line */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#7A8BA8]/8 to-transparent mb-6" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[#7A8BA8]/20 text-[10px] tracking-[0.15em] uppercase">
                &copy; {year} Serenity Spa. Все права защищены.
              </p>

              <div className="flex items-center gap-6">
                <a href="#" className="text-[#7A8BA8]/20 text-[10px] tracking-[0.15em] uppercase hover:text-[#7A8BA8]/50 transition-colors duration-300">
                  Конфиденциальность
                </a>
                <span className="w-0.5 h-0.5 rounded-full bg-[#7A8BA8]/15" />
                <a href="#" className="text-[#7A8BA8]/20 text-[10px] tracking-[0.15em] uppercase hover:text-[#7A8BA8]/50 transition-colors duration-300">
                  Условия
                </a>
              </div>
            </div>
          </div>

          {/* Scroll to top */}
          <div className="flex justify-center mt-10">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex flex-col items-center gap-2 text-[#7A8BA8]/20 hover:text-[#C8956C]/50 transition-colors duration-500 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
                <svg className="w-3.5 h-3.5 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </div>
              <span className="text-[9px] uppercase tracking-[0.3em]">Наверх</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
