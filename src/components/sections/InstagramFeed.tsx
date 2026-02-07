'use client';

import { motion } from 'framer-motion';
import { CONTACTS } from '@/lib/constants';
import { KineticText } from '../ui/KineticText';
import { MOTION, staggerContainer, staggerChild } from '@/lib/motion';

const FEED_ITEMS = [
  { id: 1, gradient: 'from-[#C8956C]/20 to-[#1F4268]', icon: '🧖‍♀️', caption: 'Релакс-массаж' },
  { id: 2, gradient: 'from-[#234A72] to-[#C8956C]/15', icon: '🌿', caption: 'Ароматерапия' },
  { id: 3, gradient: 'from-[#1F4268] to-[#234A72]', icon: '💆‍♀️', caption: 'Уход за лицом' },
  { id: 4, gradient: 'from-[#C8956C]/15 to-[#1F4268]', icon: '🏊', caption: 'Бассейн' },
  { id: 5, gradient: 'from-[#234A72] to-[#1F4268]', icon: '🧴', caption: 'SPA-ритуалы' },
  { id: 6, gradient: 'from-[#1F4268] to-[#C8956C]/20', icon: '🕯️', caption: 'Атмосфера' },
  { id: 7, gradient: 'from-[#C8956C]/20 to-[#234A72]', icon: '💎', caption: 'Премиум уход' },
  { id: 8, gradient: 'from-[#1F4268] to-[#234A72]', icon: '🌸', caption: 'Лотос-терапия' },
];

const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export function InstagramFeed() {
  return (
    <section className="bg-[#1B3A5C] relative py-24 px-6 overflow-hidden" id="instagram">
      {/* Background glows */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#C8956C]/3 blur-[200px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#7A8BA8]/3 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          variants={staggerContainer()}
          initial="initial"
          whileInView="animate"
          viewport={MOTION.viewport.once}
        >
          <motion.div variants={staggerChild}>
            <KineticText as="h2" className="text-4xl md:text-5xl font-light text-[#E8DFD0] mb-4">
              Наш Instagram
            </KineticText>
          </motion.div>
          <motion.p variants={staggerChild} className="text-[#7A8BA8] text-sm max-w-md mx-auto mb-6">
            Следите за нашими обновлениями, акциями и закулисной жизнью Serenity Spa
          </motion.p>
          <motion.a
            variants={staggerChild}
            href={CONTACTS.social.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-[#C8956C]/25 text-[#C8956C] text-sm font-medium hover:bg-[#C8956C] hover:text-[#1B3A5C] transition-all duration-500"
          >
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            {CONTACTS.social.instagram}
          </motion.a>
        </motion.div>

        {/* Feed Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
          variants={staggerContainer(0.06)}
          initial="initial"
          whileInView="animate"
          viewport={MOTION.viewport.once}
        >
          {FEED_ITEMS.map((item) => (
            <motion.a
              key={item.id}
              href={CONTACTS.social.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              variants={staggerChild}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Gradient placeholder background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />

              {/* Noise texture */}
              <div
                className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
                style={{ backgroundImage: NOISE_BG }}
              />

              {/* Decorative icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl md:text-6xl opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500 select-none">
                  {item.icon}
                </span>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#C8956C]/0 group-hover:bg-[#C8956C]/20 transition-all duration-500" />

              {/* Caption on hover */}
              <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                <p className="text-[#E8DFD0] text-xs font-medium text-center">{item.caption}</p>
              </div>

              {/* Instagram icon on hover */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-4 h-4 text-[#E8DFD0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </div>

              {/* Border */}
              <div className="absolute inset-0 rounded-2xl border border-[#7A8BA8]/8 group-hover:border-[#C8956C]/25 transition-colors duration-400" />
            </motion.a>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={MOTION.viewport.once}
          transition={{ delay: 0.4 }}
        >
          <a
            href={CONTACTS.social.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#7A8BA8]/60 text-xs hover:text-[#C8956C] transition-colors duration-300"
          >
            <span>Смотреть все публикации</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
