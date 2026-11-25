import { MEMBERSHIP_TIERS, PACKAGES, SERVICES } from '@/lib/constants';
import { getPackageOptions } from '@/lib/package-options';
import ruDict from '@/dictionaries/ru.json';
import enDict from '@/dictionaries/en.json';
import uzDict from '@/dictionaries/uz.json';
import { isWeekendYmd } from './time';

export interface ServiceResolution {
  category: string;
  priceUzs: number | null;
}

interface LookupEntry {
  category: string;
  priceUzs: number | null;
  isDayPass?: boolean;
}

const DAY_PASS_WEEKDAY_UZS = parsePrice(MEMBERSHIP_TIERS[0].price);
const DAY_PASS_WEEKEND_UZS = parsePrice(MEMBERSHIP_TIERS[0].priceNote ?? '700000');

function parsePrice(value: string): number {
  const digits = Number(value.replace(/\D/g, ''));
  return Number.isFinite(digits) && digits > 0 ? digits : 0;
}

function normKey(value: string): string {
  return value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[«»"'`ʻʼʽ]/g, '')
    .replace(/[—–]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

const DICTS = [ruDict, enDict, uzDict] as const;

const { exactMap, categoryPrefixes } = (() => {
  const map = new Map<string, LookupEntry>();
  const prefixes: { prefix: string; category: string }[] = [];

  const register = (rawKey: string, entry: LookupEntry) => {
    const key = normKey(rawKey);
    if (key && !map.has(key)) {
      map.set(key, entry);
    }
  };

  for (const dict of DICTS) {
    // 1. Services
    SERVICES.forEach((cat, catIdx) => {
      const dictCat = dict.services.categories[catIdx];
      const ruCatTitle = SERVICES[catIdx].title;
      const catTitle = dictCat?.title ?? ruCatTitle;
      prefixes.push({ prefix: normKey(catTitle), category: ruCatTitle });

      const nameCounts = new Map<string, number>();
      cat.items.forEach((item, itemIdx) => {
        const itemName = dictCat?.items[itemIdx]?.name ?? item.name;
        const k = normKey(itemName);
        nameCounts.set(k, (nameCounts.get(k) ?? 0) + 1);
      });

      cat.items.forEach((item, itemIdx) => {
        const dictItem = dictCat?.items[itemIdx];
        const itemName = dictItem?.name ?? item.name;
        const itemDur = dictItem?.duration ?? item.duration;
        const priceUzs = parsePrice(item.price) || null;
        const entry: LookupEntry = { category: ruCatTitle, priceUzs };

        if (itemDur) {
          register(`${catTitle} — ${itemName} (${itemDur})`, entry);
          register(`${itemName} (${itemDur})`, entry);
          register(`${catTitle} - ${itemName} (${itemDur})`, entry);
        } else {
          register(`${catTitle} — ${itemName}`, entry);
          register(`${catTitle} - ${itemName}`, entry);
        }

        // Only register bare itemName if unique within this category
        if ((nameCounts.get(normKey(itemName)) ?? 0) === 1) {
          register(itemName, entry);
        }
      });
    });

    // 2. Packages
    const progPrefix = dict.booking.programPrefix;
    prefixes.push({ prefix: normKey(progPrefix), category: 'SPA-программы' });
    PACKAGES.forEach((pkg, pkgIdx) => {
      const dictPkg = dict.packages.items[pkgIdx];
      const pkgTitle = dictPkg?.title ?? pkg.title;
      const options = getPackageOptions(pkg, pkgTitle, dict.packages);
      for (const opt of options) {
        const priceUzs = parsePrice(opt.price) || null;
        const entry: LookupEntry = { category: 'SPA-программы', priceUzs };
        register(`${progPrefix} ${opt.name} — ${opt.price}`, entry);
        register(`${progPrefix} ${opt.name}`, entry);
        register(`${opt.name} — ${opt.price}`, entry);
        register(opt.name, entry);
      }
    });

    // 3. Memberships & Day Pass
    const memPrefix = dict.booking.membershipPrefix;
    MEMBERSHIP_TIERS.forEach((tier, tierIdx) => {
      const tierName = dict.membership.tiers[tierIdx]?.name ?? tier.name;
      const isDayPass = tier.id === 'one-time';
      const isVariableFrom = /^от\s+/i.test(tier.price) || /^from\s+/i.test(tier.price);
      const priceUzs = isDayPass
        ? DAY_PASS_WEEKDAY_UZS
        : isVariableFrom
          ? null
          : (parsePrice(tier.price) || null);
      const category = isDayPass ? 'Разовое посещение' : 'Абонементы';
      const entry: LookupEntry = { category, priceUzs, isDayPass };

      register(`${memPrefix} ${tierName}`, entry);
      register(`${memPrefix} ${tierName} — ${tier.price}`, entry);
      register(tierName, entry);
      if (isDayPass) {
        register(`${memPrefix} ${tierName} (выходные)`, { ...entry, priceUzs: DAY_PASS_WEEKEND_UZS });
      }
    });

    // 4. Consultation / generic
    register(dict.booking.consultation, { category: 'Консультация', priceUzs: null });
    prefixes.push({ prefix: normKey(memPrefix), category: 'Абонементы' });
  }

  return { exactMap: map, categoryPrefixes: prefixes };
})();

export function resolveServiceInfo(
  serviceRaw: string | undefined | null,
  visitDateYmd?: string | null,
): ServiceResolution {
  if (!serviceRaw || !serviceRaw.trim()) {
    return { category: 'Не выбрана', priceUzs: null };
  }
  const normalized = normKey(serviceRaw);
  if (
    normalized === 'не выбрана'
    || normalized === 'not selected'
    || normalized === 'tanlanmagan'
  ) {
    return { category: 'Не выбрана', priceUzs: null };
  }

  const exact = exactMap.get(normalized);
  if (exact) {
    if (exact.isDayPass) {
      const priceUzs = visitDateYmd && isWeekendYmd(visitDateYmd)
        ? DAY_PASS_WEEKEND_UZS
        : DAY_PASS_WEEKDAY_UZS;
      return { category: exact.category, priceUzs };
    }
    return { category: exact.category, priceUzs: exact.priceUzs };
  }

  // Fallback: match without trailing " - 1 800 000 uzs" or check category prefix
  const withoutTrailingPrice = normalized.replace(/\s*-\s*(?:от\s+|from\s+)?[\d\s]+\s*uzs$/i, '').trim();
  if (withoutTrailingPrice && withoutTrailingPrice !== normalized) {
    const baseMatch = exactMap.get(withoutTrailingPrice);
    if (baseMatch) {
      if (baseMatch.isDayPass) {
        const priceUzs = visitDateYmd && isWeekendYmd(visitDateYmd)
          ? DAY_PASS_WEEKEND_UZS
          : DAY_PASS_WEEKDAY_UZS;
        return { category: baseMatch.category, priceUzs };
      }
      return { category: baseMatch.category, priceUzs: baseMatch.priceUzs };
    }
  }

  // Explicit trailing UZS amount (if not "от ..." / "from ...")
  const explicitPriceMatch = serviceRaw.match(/(?:^|[\s—–-])(?!от\s+|from\s+)([\d][\d\s\u00a0]{4,})\s*uzs\b/i);
  const explicitPrice = explicitPriceMatch ? parsePrice(explicitPriceMatch[1]) || null : null;

  for (const { prefix, category } of categoryPrefixes) {
    if (normalized.startsWith(prefix)) {
      return { category, priceUzs: explicitPrice };
    }
  }

  if (/массаж|massage|massaj/i.test(normalized)) return { category: 'Массажи', priceUzs: explicitPrice };
  if (/обёртыван|пилинг|wrap|peel|o['’]?rash|piling/i.test(normalized)) return { category: 'Уходы за телом', priceUzs: explicitPrice };
  if (/рук|парафин|hand|qo['’]?l/i.test(normalized)) return { category: 'Уход за руками', priceUzs: explicitPrice };
  if (/пакет|программ|package|dastur/i.test(normalized)) return { category: 'SPA-программы', priceUzs: explicitPrice };
  if (/разов|single visit|bir martalik/i.test(normalized)) {
    const priceUzs = visitDateYmd && isWeekendYmd(visitDateYmd)
      ? DAY_PASS_WEEKEND_UZS
      : DAY_PASS_WEEKDAY_UZS;
    return { category: 'Разовое посещение', priceUzs };
  }
  if (/абонемент|membership|abonement/i.test(normalized)) return { category: 'Абонементы', priceUzs: explicitPrice };

  return { category: serviceRaw.trim(), priceUzs: explicitPrice };
}

export function normalizeSourceBucket(sourceLabel: string | undefined | null): string {
  const s = (sourceLabel ?? '').trim();
  if (!s) return 'Прямые';
  const low = s.toLowerCase();

  if (
    low === 'google реклама'
    || low === 'google реклама · google поиск'
    || low === 'google поиск'
    || low === 'google (поиск)'
    || low === 'google (cpc)'
    || low === 'google'
  ) {
    return 'Google Поиск';
  }
  if (low.includes('chatgpt')) return 'ChatGPT';
  if (low.includes('perplexity')) return 'Perplexity';
  if (low.includes('gemini')) return 'Gemini';
  if (low.includes('copilot')) return 'Copilot';
  if (low.includes('claude')) return 'Claude';
  if (low.includes('tripadvisor')) return 'TripAdvisor';
  if (low === 'прямой переход' || low === 'переход внутри сайта') return 'Прямые';

  return s;
}
