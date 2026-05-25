'use client';

import { motion } from 'framer-motion';
import { MEMBERSHIP_TIERS } from '@/lib/constants';
import { KineticText } from '../ui/KineticText';
import { MOTION, staggerContainer, staggerChild, NOISE_BG } from '@/lib/motion';
import { useBooking } from '@/lib/booking-context';
import { useLang } from '@/lib/lang-context';

export function ModernMembership() {
  const { dictionary } = useLang();

  // Split into two rows: basic (first 3) and premium (last 5)
  const basicPlans = MEMBERSHIP_TIERS.slice(0, 3);
  const premiumPlans = MEMBERSHIP_TIERS.slice(3);

  return (
    <section className="py-24 md:py-32 px-5 md:px-6 bg-[#1B3A5C] relative overflow-hidden scroll-mt-24 md:scroll-mt-28" id="membership">
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#C8956C]/3 blur-[200px] rounded-full pointer-events-none hidden md:block" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#7A8BA8]/3 blur-[180px] rounded-full pointer-events-none hidden md:block" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-5 md:gap-8"
          variants={staggerContainer()}
          initial="initial"
          whileInView="animate"
          viewport={MOTION.viewport.once}
        >
          <div>
            <motion.span className="text-[#C8956C] uppercase tracking-[0.18em] md:tracking-[0.25em] text-[11px] md:text-xs block mb-3 md:mb-4" variants={staggerChild}>
              Членство в клубе
            </motion.span>
            <KineticText className="text-[clamp(2.75rem,15vw,4rem)] md:text-7xl leading-[0.95] font-light text-[#E8DFD0] tracking-tight justify-start">{dictionary.membership.sectionTitle}</KineticText>
          </div>
          <motion.p className="text-[#A0B0C8] max-w-md text-sm md:text-base leading-relaxed md:text-right" variants={staggerChild}>
            {dictionary.membership.sectionSubtitle}
          </motion.p>
        </motion.div>

        {/* Row 1: Basic plans — 3 columns */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4"
          variants={staggerContainer(MOTION.stagger.fast)}
          initial="initial"
          whileInView="animate"
          viewport={MOTION.viewport.once}
        >
          {basicPlans.map((tier, i) => (
            <MembershipCard key={tier.id} tier={tier} dictTier={dictionary.membership.tiers[i]} bookLabel={dictionary.nav.bookButton} />
          ))}
        </motion.div>

        {/* Row 2: Premium plans — 5 columns */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          variants={staggerContainer(MOTION.stagger.fast)}
          initial="initial"
          whileInView="animate"
          viewport={MOTION.viewport.once}
        >
          {premiumPlans.map((tier, i) => (
            <MembershipCard key={tier.id} tier={tier} dictTier={dictionary.membership.tiers[i + 3]} bookLabel={dictionary.nav.bookButton} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

interface MembershipCardProps {
  tier: typeof MEMBERSHIP_TIERS[number];
  dictTier: { name: string; price: string; priceNote?: string; period: string; features: string[] };
  bookLabel: string;
}

function MembershipCard({ tier, dictTier, bookLabel }: MembershipCardProps) {
  const isHighlighted = tier.isPopular;
  const { openBooking } = useBooking();

  return (
    <motion.div
      className={`relative rounded-2xl border transition-all duration-500 hover:-translate-y-1 group overflow-hidden flex flex-col
        ${isHighlighted 
          ? 'bg-[#C8956C] border-[#C8956C] text-[#1B3A5C] shadow-[0_0_40px_rgba(200,149,108,0.15)]' 
          : 'bg-[#1F4268]/40 border-[#7A8BA8]/8 text-[#E8DFD0] hover:border-[#C8956C]/25 backdrop-blur-sm'
        }
      `}
      variants={staggerChild}
    >
      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none rounded-2xl" style={{ backgroundImage: NOISE_BG }} />

      <div className="relative z-10 p-6 flex flex-col flex-1">
        {/* Period badge */}
        <div className="mb-4">
          <span className={`inline-block text-[9px] uppercase tracking-[0.2em] px-3 py-1 rounded-full
            ${isHighlighted 
              ? 'bg-[#1B3A5C]/15 text-[#1B3A5C]' 
              : 'bg-[#C8956C]/10 text-[#C8956C]'
            }
          `}>
            {dictTier.period}
          </span>
          {isHighlighted && (
            <span className="inline-block ml-2 bg-[#1B3A5C] text-[#E8DFD0] text-[8px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full">
              Популярный
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className={`text-xl font-medium tracking-wide mb-3 ${isHighlighted ? 'text-[#1B3A5C]' : 'text-[#E8DFD0]'}`}>
          {dictTier.name}
        </h3>

        {/* Price */}
        <div className="mb-5">
          <p className={`text-2xl font-light ${isHighlighted ? 'text-[#1B3A5C]' : 'text-[#E8DFD0]'}`}>
            {dictTier.price}
          </p>
          {dictTier.priceNote && (
            <p className={`text-[10px] mt-1.5 leading-relaxed ${isHighlighted ? 'text-[#1B3A5C]/60' : 'text-[#C8956C]/60'}`}>
              {dictTier.priceNote}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className={`h-px mb-5 ${isHighlighted ? 'bg-[#1B3A5C]/15' : 'bg-[#7A8BA8]/10'}`} />

        {/* Features */}
        <ul className="space-y-2.5 flex-1">
          {dictTier.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <svg className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${isHighlighted ? 'text-[#1B3A5C]/70' : 'text-[#C8956C]/60'}`} viewBox="0 0 16 16" fill="none">
                <path d="M13.5 4.5L6.5 11.5L2.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className={`text-[11px] leading-snug ${isHighlighted ? 'text-[#1B3A5C]/80' : 'text-[#E8DFD0]/60'}`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA — pushed to bottom via flex-1 on features */}
        <button
          onClick={() => openBooking({
            type: 'membership',
            name: dictTier.name,
            price: dictTier.price,
          })}
          className={`w-full py-3 mt-6 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold transition-all duration-400 cursor-pointer
          ${isHighlighted 
            ? 'bg-[#1B3A5C] text-[#E8DFD0] hover:bg-[#1B3A5C]/85 hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]' 
            : 'bg-[#E8DFD0]/0 border border-[#7A8BA8]/15 hover:bg-[#E8DFD0] hover:text-[#1B3A5C] hover:border-[#E8DFD0] hover:shadow-[0_4px_20px_rgba(232,223,208,0.1)]'
          }
        `}>
          {bookLabel}
        </button>
      </div>
    </motion.div>
  );
}
