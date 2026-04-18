'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/lang-context';
import { SERVICES, PACKAGES, MEMBERSHIP_TIERS } from '@/lib/constants';

export type BookingTab = 'services' | 'packages' | 'memberships';

export function ServiceSelector({
  activeTab,
  setActiveTab,
  activeServiceCat,
  setActiveServiceCat,
  onPick,
  tabs,
}: {
  activeTab: BookingTab;
  setActiveTab: (t: BookingTab) => void;
  activeServiceCat: number;
  setActiveServiceCat: (n: number) => void;
  onPick: (label: string) => void;
  tabs: { id: BookingTab; label: string; icon: string }[];
}) {
  const { dictionary } = useLang();
  const b = dictionary.booking;
  const dictCategories = dictionary.services.categories;
  const dictPackages = dictionary.packages.items;
  const dictTiers = dictionary.membership.tiers;

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Tabs */}
      <div className="flex gap-1.5 p-1 rounded-2xl bg-[#1F4268]/40 border border-[#7A8BA8]/8 mb-5" role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-0 min-h-[44px] flex items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-2 py-2.5 rounded-xl text-[11px] sm:text-xs font-medium transition-all duration-300 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#C8956C] text-[#1B3A5C] shadow-[0_2px_12px_rgba(200,149,108,0.3)]'
                : 'text-[#7A8BA8]/60 hover:text-[#E8DFD0]'
            }`}
          >
            <span className="text-sm flex-shrink-0" aria-hidden="true">{tab.icon}</span>
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'services' && (
          <motion.div key="svc" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
              {SERVICES.map((cat, i) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveServiceCat(i)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-[11px] font-medium transition-all duration-300 cursor-pointer border ${
                    activeServiceCat === i
                      ? 'bg-[#C8956C]/15 text-[#C8956C] border-[#C8956C]/25'
                      : 'text-[#7A8BA8]/50 border-[#7A8BA8]/8 hover:text-[#E8DFD0] hover:border-[#7A8BA8]/20'
                  }`}
                >
                  {dictCategories[i]?.title ?? cat.title}
                </button>
              ))}
            </div>
            <div className="space-y-1.5 max-h-[40vh] overflow-y-auto pr-1 scrollbar-none">
              {SERVICES[activeServiceCat].items.map((item, i) => {
                const dictItem = dictCategories[activeServiceCat]?.items[i];
                const itemName = dictItem?.name ?? item.name;
                const catTitle = dictCategories[activeServiceCat]?.title ?? SERVICES[activeServiceCat].title;
                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => onPick(`${catTitle} — ${itemName} (${item.duration})`)}
                    className="w-full group flex items-center gap-3 px-4 py-3 rounded-2xl border border-[#7A8BA8]/6 bg-[#1F4268]/20 hover:bg-[#C8956C]/8 hover:border-[#C8956C]/20 transition-all duration-300 cursor-pointer text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[#E8DFD0]/85 text-sm group-hover:text-[#E8DFD0] transition-colors truncate">{itemName}</p>
                      <p className="text-[#7A8BA8]/40 text-[10px] mt-0.5">{item.duration}{item.desc ? ` · ${item.desc.slice(0, 50)}...` : ''}</p>
                    </div>
                    <span className="text-[#C8956C]/70 text-xs font-medium whitespace-nowrap">{item.price} <span className="text-[#C8956C]/40 text-[9px]">UZS</span></span>
                    <svg className="w-3.5 h-3.5 text-[#7A8BA8]/20 group-hover:text-[#C8956C]/50 transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'packages' && (
          <motion.div key="pkg" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1 scrollbar-none">
              {PACKAGES.map((pkg, i) => {
                const dictPkg = dictPackages[i];
                const pkgTitle = dictPkg?.title ?? pkg.title;
                return (
                  <motion.button
                    key={pkg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => onPick(`${b.programPrefix} ${pkgTitle}`)}
                    className="w-full group p-4 rounded-2xl border border-[#7A8BA8]/8 bg-[#1F4268]/25 hover:bg-[#C8956C]/8 hover:border-[#C8956C]/20 transition-all duration-300 cursor-pointer text-left"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="text-[#E8DFD0] text-sm font-medium group-hover:text-[#E8DFD0] transition-colors">{pkgTitle}</p>
                        <p className="text-[#7A8BA8]/40 text-[10px] mt-0.5">{pkg.duration}</p>
                      </div>
                      <span className="text-[#C8956C] text-sm font-medium whitespace-nowrap">{pkg.price}</span>
                    </div>
                    <p className="text-[#7A8BA8]/40 text-[11px] leading-relaxed line-clamp-2">{dictPkg?.description ?? pkg.description}</p>
                    {pkg.isPopular && (
                      <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-[#C8956C]/15 text-[#C8956C] text-[9px] uppercase tracking-wider font-medium">{b.popularLabel}</span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'memberships' && (
          <motion.div key="mem" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            <div className="grid grid-cols-2 gap-2 max-h-[45vh] overflow-y-auto pr-1 scrollbar-none">
              {MEMBERSHIP_TIERS.map((tier, i) => {
                const dictTier = dictTiers[i];
                const tierName = dictTier?.name ?? tier.name;
                return (
                  <motion.button
                    key={tier.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => onPick(`${b.membershipPrefix} ${tierName}`)}
                    className={`group p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
                      tier.isPopular
                        ? 'bg-[#C8956C]/12 border-[#C8956C]/25 hover:bg-[#C8956C]/18'
                        : 'bg-[#1F4268]/25 border-[#7A8BA8]/8 hover:bg-[#C8956C]/8 hover:border-[#C8956C]/20'
                    }`}
                  >
                    <p className="text-[#E8DFD0] text-sm font-medium mb-1">{tierName}</p>
                    <p className="text-[#C8956C]/70 text-xs font-medium mb-1">{tier.price}</p>
                    <p className="text-[#7A8BA8]/40 text-[10px]">{tier.period}</p>
                    {tier.isPopular && <span className="inline-block mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C8956C]" />}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => onPick(b.consultation)}
        className="w-full mt-4 py-2.5 text-[#7A8BA8]/40 text-[11px] hover:text-[#C8956C]/60 transition-colors cursor-pointer"
      >
        {b.skipSelection}
      </button>
    </motion.div>
  );
}
