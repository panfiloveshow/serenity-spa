'use client';

import { motion } from 'framer-motion';
import { CONTACTS } from '@/lib/constants';
import { KineticText } from '../ui/KineticText';
import { MOTION, staggerContainer, staggerChild } from '@/lib/motion';
import { useBooking } from '@/lib/booking-context';

const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const CONTACT_ITEMS = [
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: 'Адрес',
    value: CONTACTS.address,
    href: 'https://www.google.com/maps/dir/?api=1&destination=41.3111,69.2797',
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    label: 'Часы работы',
    value: CONTACTS.hours,
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: 'Телефон',
    value: CONTACTS.phone,
    href: `tel:${CONTACTS.phone}`,
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    label: 'Email',
    value: CONTACTS.email,
    href: `mailto:${CONTACTS.email}`,
  },
];

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    handle: CONTACTS.social.instagram,
    href: CONTACTS.social.instagramUrl,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    name: 'Telegram',
    handle: CONTACTS.social.telegram,
    href: CONTACTS.social.telegramUrl,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 2-7 20-4-9-9-4z" />
        <path d="M22 2 11 13" />
      </svg>
    ),
  },
];

export function ContactsSection() {
  const { openBooking } = useBooking();

  return (
    <section className="bg-[#152E4A] relative py-32 px-6 overflow-hidden" id="contacts">
      {/* Background glows */}
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-[#C8956C]/3 blur-[200px] rounded-full pointer-events-none hidden md:block" />
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[#7A8BA8]/3 blur-[150px] rounded-full pointer-events-none hidden md:block" />

      {/* Decorative corner lines */}
      <div className="absolute top-12 left-12 w-20 h-20 border-t border-l border-[#C8956C]/10 rounded-tl-2xl pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-20 h-20 border-b border-r border-[#C8956C]/10 rounded-br-2xl pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div 
          className="mb-20"
          variants={staggerContainer()}
          initial="initial"
          whileInView="animate"
          viewport={MOTION.viewport.once}
        >
          <motion.span className="text-[#C8956C] uppercase tracking-[0.25em] text-xs block mb-4" variants={staggerChild}>
            Свяжитесь с нами
          </motion.span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <KineticText className="text-5xl md:text-7xl font-light text-[#E8DFD0] tracking-tight">Контакты</KineticText>
            <motion.p className="text-[#7A8BA8] max-w-sm text-sm leading-relaxed md:text-right" variants={staggerChild}>
              Мы находимся в Ташкенте и работаем ежедневно. Ждём вас!
            </motion.p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8">
          {/* Left: Contact cards */}
          <motion.div
            className="flex flex-col gap-3"
            variants={staggerContainer(MOTION.stagger.fast)}
            initial="initial"
            whileInView="animate"
            viewport={MOTION.viewport.once}
          >
            {/* Contact items */}
            {CONTACT_ITEMS.map((item, i) => {
              const Wrapper = item.href ? 'a' : 'div';
              const wrapperProps = item.href ? { href: item.href, target: item.href.startsWith('http') ? '_blank' : undefined, rel: item.href.startsWith('http') ? 'noopener noreferrer' : undefined } : {};
              return (
                <motion.div key={i} variants={staggerChild}>
                  <Wrapper
                    {...wrapperProps}
                    className="group flex items-center gap-5 p-5 rounded-xl border border-[#7A8BA8]/8 bg-[#1F4268]/20 hover:border-[#C8956C]/25 hover:bg-[#1F4268]/40 transition-all duration-400 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full border border-[#C8956C]/20 flex items-center justify-center text-[#C8956C]/60 group-hover:text-[#C8956C] group-hover:border-[#C8956C]/40 transition-all duration-300 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[#7A8BA8]/50 text-[10px] uppercase tracking-[0.2em] mb-0.5">{item.label}</p>
                      <p className="text-[#E8DFD0] text-sm font-light group-hover:text-[#C8956C] transition-colors duration-300 truncate">
                        {item.value}
                      </p>
                    </div>
                    {item.href && (
                      <svg className="w-4 h-4 text-[#7A8BA8]/20 group-hover:text-[#C8956C]/50 ml-auto flex-shrink-0 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    )}
                  </Wrapper>
                </motion.div>
              );
            })}

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#7A8BA8]/10 to-transparent my-2" />

            {/* Social links */}
            <motion.div className="flex gap-3" variants={staggerChild}>
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex-1 flex items-center gap-3 p-4 rounded-xl border border-[#7A8BA8]/8 bg-[#1F4268]/20 hover:border-[#C8956C]/25 hover:bg-[#1F4268]/40 transition-all duration-400"
                >
                  <div className="text-[#7A8BA8]/40 group-hover:text-[#C8956C] transition-colors duration-300">
                    {social.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#E8DFD0]/80 text-xs font-light truncate">{social.name}</p>
                    <p className="text-[#7A8BA8]/40 text-[10px] truncate">{social.handle}</p>
                  </div>
                </a>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div className="mt-3" variants={staggerChild}>
              <button
                onClick={() => openBooking()}
                className="group flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-[#C8956C] text-[#1B3A5C] font-semibold text-sm tracking-wide hover:shadow-[0_0_40px_rgba(200,149,108,0.25)] transition-all duration-500 cursor-pointer"
              >
                <span>Записаться</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          </motion.div>

          {/* Right: Map */}
          <motion.div
            className="relative rounded-3xl overflow-hidden border border-[#7A8BA8]/10 min-h-[500px] lg:min-h-0 group/map"
            initial={{ opacity: 0, scale: 0.96, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={MOTION.viewport.once}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Noise overlay */}
            <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none z-20 rounded-3xl" style={{ backgroundImage: NOISE_BG }} />

            {/* Map iframe — non-interactive to keep marker aligned */}
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=69.2717%2C41.3066%2C69.2877%2C41.3156&layer=mapnik&marker=41.3111%2C69.2797"
              className="w-full h-full absolute inset-0 pointer-events-none"
              style={{ border: 0, filter: 'brightness(0.25) contrast(1.3) saturate(0.2) hue-rotate(190deg) sepia(0.15)' }}
              loading="lazy"
              title="Serenity Spa Location"
            />

            {/* Subtle edge gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1929]/90 via-transparent to-[#0a1929]/30 pointer-events-none z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1929]/40 via-transparent to-[#0a1929]/20 pointer-events-none z-10" />

            {/* Custom pin — centered */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-30 pointer-events-none flex flex-col items-center">
              {/* Tooltip card */}
              <motion.div
                className="mb-3 px-5 py-3 rounded-2xl bg-[#1B3A5C]/95 backdrop-blur-xl border border-[#C8956C]/20 shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(200,149,108,0.08)]"
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C8956C] to-[#A07550] flex items-center justify-center flex-shrink-0 shadow-[0_2px_10px_rgba(200,149,108,0.3)]">
                    <svg className="w-4 h-4 text-[#1B3A5C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#E8DFD0] text-sm font-semibold tracking-tight">Serenity Spa</p>
                    <p className="text-[#C8956C]/70 text-[10px]">ул. Ислама Каримова 2</p>
                  </div>
                </div>
                {/* Arrow */}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1B3A5C]/95 border-r border-b border-[#C8956C]/20 rotate-45" />
              </motion.div>

              {/* Animated pin */}
              <div className="relative">
                <div className="w-5 h-5 rounded-full bg-[#C8956C] border-[3px] border-[#1B3A5C] shadow-[0_0_0_3px_rgba(200,149,108,0.3),0_4px_15px_rgba(200,149,108,0.4)]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#C8956C]/15 animate-ping" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#C8956C]/5 animate-[ping_2s_ease-in-out_infinite_0.5s]" />
              </div>
            </div>

            {/* Bottom floating bar */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-3 sm:p-5">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-[#1B3A5C]/90 backdrop-blur-xl border border-[#7A8BA8]/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                <div className="min-w-0 hidden sm:block">
                  <p className="text-[#E8DFD0] text-sm font-medium truncate">3-4 этаж, Укчи 1</p>
                  <p className="text-[#7A8BA8]/50 text-[10px] mt-0.5">Ежедневно 07:00 — 23:00</p>
                </div>
                <div className="flex gap-2">
                  <a
                    href="https://yandex.uz/maps/?rtext=~41.3111,69.2797&rtt=auto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl bg-[#1F4268]/80 border border-[#7A8BA8]/10 text-[#E8DFD0]/70 text-[11px] font-medium hover:border-[#C8956C]/25 hover:text-[#C8956C] transition-all duration-300"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z" /></svg>
                    Маршрут
                  </a>
                  <a
                    href={`tel:${CONTACTS.phone}`}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#C8956C] to-[#A07550] text-[#1B3A5C] text-[11px] font-semibold shadow-[0_4px_15px_rgba(200,149,108,0.25)] hover:shadow-[0_6px_20px_rgba(200,149,108,0.35)] transition-all duration-300"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
                    Позвонить
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
