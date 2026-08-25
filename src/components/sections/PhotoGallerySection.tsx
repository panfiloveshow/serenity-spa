'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useBooking } from '@/lib/booking-context';
import { useLang } from '@/lib/lang-context';
import type { Locale } from '@/types/i18n';

type GalleryCategory = 'all' | 'pool' | 'sauna' | 'treatment' | 'fitness';
type GalleryVariant = 'feature' | 'wide' | 'tall' | 'square';

type GalleryItem = {
  slug: string;
  title: Record<Locale, string>;
  category: Exclude<GalleryCategory, 'all'>;
  label: Record<Locale, string>;
  variant: GalleryVariant;
  alt: Record<Locale, string>;
  focus?: string;
};

const COPY: Record<Locale, {
  label: string;
  title: string;
  intro: string;
  photoWord: string;
  filters: Record<GalleryCategory, string>;
  book: string;
  close: string;
  previous: string;
  next: string;
}> = {
  ru: {
    label: 'Serenity Spa',
    title: 'Пространство для мягкого восстановления',
    intro: 'Вода, дерево, камень и приглушенный свет собраны в тихую фотохронику spa-пространства.',
    photoWord: 'фото',
    filters: {
      all: 'Все',
      pool: 'Бассейн',
      sauna: 'Тепло',
      treatment: 'Процедуры',
      fitness: 'Фитнес',
    },
    book: 'Записаться',
    close: 'Закрыть просмотр',
    previous: 'Предыдущее фото',
    next: 'Следующее фото',
  },
  en: {
    label: 'Serenity Spa',
    title: 'A softer way back to balance',
    intro: 'Water, cedar, stone and low light come together in a quiet visual story of the spa.',
    photoWord: 'photos',
    filters: {
      all: 'All',
      pool: 'Pool',
      sauna: 'Heat',
      treatment: 'Treatments',
      fitness: 'Fitness',
    },
    book: 'Book a visit',
    close: 'Close preview',
    previous: 'Previous photo',
    next: 'Next photo',
  },
  uz: {
    label: 'Serenity Spa',
    title: 'Yumshoq tiklanish makoni',
    intro: 'Suv, yogoch, tosh va sokin yoruglik spa makonining nafis foto hikoyasiga aylanadi.',
    photoWord: 'foto',
    filters: {
      all: 'Barchasi',
      pool: 'Hovuz',
      sauna: 'Issiqlik',
      treatment: 'Muolajalar',
      fitness: 'Fitnes',
    },
    book: 'Bron qilish',
    close: 'Korishni yopish',
    previous: 'Oldingi foto',
    next: 'Keyingi foto',
  },
};

const GALLERY_ITEMS: GalleryItem[] = [
  {
    slug: 'pool-day-wide',
    category: 'pool',
    label: { ru: 'Бассейн', en: 'Pool', uz: 'Hovuz' },
    title: { ru: 'Дневной бассейн', en: 'Day pool', uz: 'Kunduzgi hovuz' },
    variant: 'feature',
    alt: {
      ru: 'Светлый крытый бассейн Serenity Spa с панорамными окнами',
      en: 'Bright indoor Serenity Spa pool with panoramic windows',
      uz: 'Panoramali oynali yorug Serenity Spa yopiq hovuzi',
    },
  },
  {
    slug: 'sauna-warm-wood',
    category: 'sauna',
    label: { ru: 'Тепло', en: 'Heat', uz: 'Issiqlik' },
    title: { ru: 'Теплая сауна', en: 'Warm sauna', uz: 'Iliq sauna' },
    variant: 'tall',
    alt: {
      ru: 'Деревянная сауна с мягким настенным светом',
      en: 'Wood sauna with soft wall lighting',
      uz: 'Yumshoq devor yoritgichli yogoch sauna',
    },
  },
  {
    slug: 'couples-treatment',
    category: 'treatment',
    label: { ru: 'Процедуры', en: 'Treatments', uz: 'Muolajalar' },
    title: { ru: 'Ритуал для двоих', en: 'Ritual for two', uz: 'Ikki kishi uchun ritual' },
    variant: 'tall',
    alt: {
      ru: 'Два гостя на spa-процедуре в приглушенном свете',
      en: 'Two guests during a spa treatment in low light',
      uz: 'Sokin yoruglikda spa muolajasidagi ikki mehmon',
    },
  },
  {
    slug: 'pool-night-glass',
    category: 'pool',
    label: { ru: 'Бассейн', en: 'Pool', uz: 'Hovuz' },
    title: { ru: 'Вода после заката', en: 'Water after sunset', uz: 'Quyosh botgandan keyin suv' },
    variant: 'wide',
    alt: {
      ru: 'Ночной крытый бассейн с голубой подсветкой и стеклянными стенами',
      en: 'Indoor night pool with blue lighting and glass walls',
      uz: 'Moviy yoritilgan, oynali devorlarga ega tungi yopiq hovuz',
    },
  },
  {
    slug: 'treatment-room-tub',
    category: 'treatment',
    label: { ru: 'Процедуры', en: 'Treatments', uz: 'Muolajalar' },
    title: { ru: 'Комната восстановления', en: 'Recovery room', uz: 'Tiklanish xonasi' },
    variant: 'square',
    alt: {
      ru: 'Treatment room с круглой ванной и массажной зоной',
      en: 'Treatment room with a round tub and massage area',
      uz: 'Dumaloq vanna va massaj hududiga ega muolaja xonasi',
    },
  },
  {
    slug: 'fitness-panoramic',
    category: 'fitness',
    label: { ru: 'Фитнес', en: 'Fitness', uz: 'Fitnes' },
    title: { ru: 'Фитнес с видом', en: 'Fitness with a view', uz: 'Manzarali fitnes' },
    variant: 'wide',
    alt: {
      ru: 'Кардио-зона с беговыми дорожками у панорамных окон',
      en: 'Cardio area with treadmills beside panoramic windows',
      uz: 'Panoramali oynalar yonidagi yugurish yolakchali kardio hudud',
    },
  },
  {
    slug: 'hammam-stone-shower',
    category: 'sauna',
    label: { ru: 'Тепло', en: 'Heat', uz: 'Issiqlik' },
    title: { ru: 'Каменный хаммам', en: 'Stone hammam', uz: 'Tosh hammom' },
    variant: 'square',
    alt: {
      ru: 'Каменный хаммам с теплой подсветкой',
      en: 'Stone hammam with warm lighting',
      uz: 'Iliq yoritilgan tosh hammom',
    },
  },
  {
    slug: 'relaxation-loungers',
    category: 'sauna',
    label: { ru: 'Тепло', en: 'Heat', uz: 'Issiqlik' },
    title: { ru: 'Зона тишины', en: 'Quiet lounge', uz: 'Sokin dam olish hududi' },
    variant: 'wide',
    alt: {
      ru: 'Релакс-зона с шезлонгами и деревянными панелями',
      en: 'Relaxation area with loungers and wood panels',
      uz: 'Shezlonglar va yogoch panellarga ega dam olish hududi',
    },
  },
  {
    slug: 'lounge-reception-wide',
    category: 'treatment',
    label: { ru: 'Пространство', en: 'Space', uz: 'Makon' },
    title: { ru: 'Лаунж Serenity', en: 'Serenity lounge', uz: 'Serenity lounge' },
    variant: 'wide',
    alt: {
      ru: 'Просторный лаунж Serenity Spa с креслами и мягким светом',
      en: 'Spacious Serenity Spa lounge with armchairs and soft light',
      uz: 'Kreslolar va yumshoq yoruglikli keng Serenity Spa lounge',
    },
  },
  {
    slug: 'pool-reflection',
    category: 'pool',
    label: { ru: 'Бассейн', en: 'Pool', uz: 'Hovuz' },
    title: { ru: 'Отражения воды', en: 'Water reflections', uz: 'Suv akslari' },
    variant: 'wide',
    alt: {
      ru: 'Бассейн с отражением окон и потолочной конструкции',
      en: 'Pool reflecting windows and ceiling structure',
      uz: 'Oynalar va shift konstruksiyasini aks ettirgan hovuz',
    },
  },
  {
    slug: 'gym-strength-zone',
    category: 'fitness',
    label: { ru: 'Фитнес', en: 'Fitness', uz: 'Fitnes' },
    title: { ru: 'Силовая зона', en: 'Strength zone', uz: 'Kuch mashqlari hududi' },
    variant: 'square',
    alt: {
      ru: 'Фитнес-зал с тренажерами и панорамным дневным светом',
      en: 'Gym with strength equipment and panoramic daylight',
      uz: 'Trenajorlar va panoramali kunduzgi yoruglikka ega sport zali',
    },
  },
  {
    slug: 'treatment-suite',
    category: 'treatment',
    label: { ru: 'Процедуры', en: 'Treatments', uz: 'Muolajalar' },
    title: { ru: 'Treatment suite', en: 'Treatment suite', uz: 'Muolaja xonasi' },
    variant: 'square',
    alt: {
      ru: 'Спокойная treatment-комната с массажной кушеткой',
      en: 'Calm treatment room with a massage bed',
      uz: 'Massaj kushetkali sokin muolaja xonasi',
    },
  },
  {
    slug: 'pool-city-view',
    category: 'pool',
    label: { ru: 'Бассейн', en: 'Pool', uz: 'Hovuz' },
    title: { ru: 'Бассейн и город', en: 'Pool and city', uz: 'Hovuz va shahar' },
    variant: 'wide',
    alt: {
      ru: 'Крытый бассейн с видом на город через большие окна',
      en: 'Indoor pool overlooking the city through large windows',
      uz: 'Katta oynalar orqali shaharga qaragan yopiq hovuz',
    },
  },
  {
    slug: 'lounge-floral-table',
    category: 'treatment',
    label: { ru: 'Пространство', en: 'Space', uz: 'Makon' },
    title: { ru: 'Мягкая встреча', en: 'Soft arrival', uz: 'Yumshoq kutib olish' },
    variant: 'square',
    alt: {
      ru: 'Лаунж-зона с декоративным столиком и цветами',
      en: 'Lounge area with a decorative table and flowers',
      uz: 'Dekorativ stol va gullarga ega lounge hududi',
    },
  },
  {
    slug: 'pool-day-lanes',
    category: 'pool',
    label: { ru: 'Бассейн', en: 'Pool', uz: 'Hovuz' },
    title: { ru: 'Линии воды', en: 'Water lines', uz: 'Suv chiziqlari' },
    variant: 'wide',
    alt: {
      ru: 'Дневной бассейн с отражениями и лежаками',
      en: 'Day pool with reflections and loungers',
      uz: 'Akslar va shezlonglarga ega kunduzgi hovuz',
    },
  },
  {
    slug: 'fitness-cardio-day',
    category: 'fitness',
    label: { ru: 'Фитнес', en: 'Fitness', uz: 'Fitnes' },
    title: { ru: 'Кардио-ритм', en: 'Cardio rhythm', uz: 'Kardio ritm' },
    variant: 'wide',
    alt: {
      ru: 'Кардио-зал с беговыми дорожками вдоль окон',
      en: 'Cardio gym with treadmills along the windows',
      uz: 'Oynalar boylab yugurish yolakchali kardio zal',
    },
  },
  {
    slug: 'pool-night-loungers',
    category: 'pool',
    label: { ru: 'Бассейн', en: 'Pool', uz: 'Hovuz' },
    title: { ru: 'Ночная вода', en: 'Night water', uz: 'Tungi suv' },
    variant: 'wide',
    alt: {
      ru: 'Ночной бассейн с лежаками и синей подсветкой',
      en: 'Night pool with loungers and blue lighting',
      uz: 'Shezlonglar va moviy yoritishga ega tungi hovuz',
    },
  },
  {
    slug: 'sauna-cedar-benches',
    category: 'sauna',
    label: { ru: 'Тепло', en: 'Heat', uz: 'Issiqlik' },
    title: { ru: 'Кедровое тепло', en: 'Cedar warmth', uz: 'Kedr iliqligi' },
    variant: 'square',
    alt: {
      ru: 'Кедровые скамьи сауны с аккуратно сложенным полотенцем',
      en: 'Cedar sauna benches with a neatly folded towel',
      uz: 'Chiroyli taxlangan sochiqli kedr sauna orinlari',
    },
  },
];

const categories: GalleryCategory[] = ['all', 'pool', 'sauna', 'treatment', 'fitness'];

function imagePath(kind: 'full' | 'thumb', slug: string) {
  return `/images/gallery/${kind}/${slug}.webp`;
}

export function PhotoGallerySection() {
  const { locale } = useLang();
  const { openBooking } = useBooking();
  const copy = COPY[locale] ?? COPY.ru;
  const [activeFilter, setActiveFilter] = useState<GalleryCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visibleItems = useMemo(
    () => GALLERY_ITEMS.filter((item) => activeFilter === 'all' || item.category === activeFilter),
    [activeFilter]
  );

  const fallbackItem = GALLERY_ITEMS[0]!;
  const selectedItem = visibleItems[selectedIndex] ?? visibleItems[0] ?? fallbackItem;
  const lightboxItem = lightboxIndex === null ? null : visibleItems[lightboxIndex] ?? null;
  const highlightItems = visibleItems.slice(0, 6);

  useEffect(() => {
    if (!lightboxItem) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxIndex(null);
      if (event.key === 'ArrowLeft') {
        setLightboxIndex((current) => current === null ? null : (current - 1 + visibleItems.length) % visibleItems.length);
      }
      if (event.key === 'ArrowRight') {
        setLightboxIndex((current) => current === null ? null : (current + 1) % visibleItems.length);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxItem, visibleItems.length]);

  const openLightbox = (item: GalleryItem = selectedItem) => {
    const nextIndex = visibleItems.findIndex((visibleItem) => visibleItem.slug === item.slug);
    setLightboxIndex(nextIndex < 0 ? 0 : nextIndex);
  };

  const moveLightbox = (direction: -1 | 1) => {
    setLightboxIndex((current) => current === null ? null : (current + direction + visibleItems.length) % visibleItems.length);
  };

  const selectItem = (item: GalleryItem) => {
    const nextIndex = visibleItems.findIndex((visibleItem) => visibleItem.slug === item.slug);
    setSelectedIndex(nextIndex < 0 ? 0 : nextIndex);
  };

  return (
    <section id="gallery" className="relative scroll-mt-28 overflow-hidden bg-[#142E4A] px-4 py-12 text-[#E8DFD0] md:scroll-mt-32 md:px-6 md:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(200,149,108,0.12),transparent_32%),radial-gradient(circle_at_84%_8%,rgba(122,139,168,0.12),transparent_30%)]" />
      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="mb-5 flex flex-col gap-4 md:mb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-[#C8956C]">
              {copy.label}
            </span>
            <h2 className="font-serif text-[clamp(2.15rem,5vw,3.8rem)] font-light leading-[0.96] tracking-normal">
              {copy.title}
            </h2>
          </div>
          <div className="max-w-md lg:text-right">
            <p className="text-sm leading-relaxed text-[#A0B0C8] md:text-base">{copy.intro}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#C8956C]/80">
              {visibleItems.length} {copy.photoWord}
            </p>
          </div>
        </div>

        <div className="grid gap-3 rounded-[24px] border border-[#7A8BA8]/14 bg-[#1B3A5C]/88 p-2.5 shadow-[0_28px_90px_rgba(0,0,0,0.24)] md:p-3 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.7fr)]">
          <button
            type="button"
            onClick={() => openLightbox()}
            className="group relative min-h-[280px] overflow-hidden rounded-[20px] bg-[#0E2135] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8956C] md:min-h-[360px] lg:min-h-[450px]"
            aria-label={`${selectedItem.label[locale]}: ${selectedItem.title[locale]}`}
          >
            <Image
              key={selectedItem.slug}
              src={imagePath('thumb', selectedItem.slug)}
              alt={selectedItem.alt[locale]}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.018]"
              style={{ objectPosition: selectedItem.focus ?? 'center' }}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-[#07111C]/82 via-[#07111C]/14 to-transparent" />
            <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/24 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
              {selectedItem.label[locale]}
            </span>
            <span className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-4 rounded-2xl border border-white/14 bg-[#07111C]/48 p-3 backdrop-blur-md md:inset-x-4 md:bottom-4 md:p-4">
              <span>
                <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#C8956C]">
                  {String(selectedIndex + 1).padStart(2, '0')} / {String(visibleItems.length).padStart(2, '0')}
                </span>
                <span className="block font-serif text-2xl font-light leading-none md:text-4xl">
                  {selectedItem.title[locale]}
                </span>
              </span>
              <span className="hidden size-11 place-items-center rounded-full border border-white/15 text-xl text-white/78 md:grid">+</span>
            </span>
          </button>

          <div className="flex min-w-0 flex-col gap-2.5">
            <div className="rounded-2xl border border-[#7A8BA8]/12 bg-[#102844]/72 p-1.5">
              <div className="no-scrollbar flex gap-1 overflow-x-auto" aria-label="Gallery filters">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={activeFilter === category}
                    onClick={() => {
                      setActiveFilter(category);
                      setSelectedIndex(0);
                      setLightboxIndex(null);
                    }}
                    className={`min-h-9 shrink-0 rounded-xl px-3.5 text-sm font-semibold transition duration-200 ${
                      activeFilter === category
                        ? 'bg-[#C8956C] text-[#142E4A]'
                        : 'text-[#A0B0C8] hover:bg-[#1F4268] hover:text-[#E8DFD0] focus-visible:bg-[#1F4268]'
                    }`}
                  >
                    {copy.filters[category]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {highlightItems.map((item) => {
                const itemIndex = visibleItems.findIndex((visibleItem) => visibleItem.slug === item.slug);
                const isSelected = item.slug === selectedItem.slug;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => selectItem(item)}
                    aria-pressed={isSelected}
                    className={`group relative h-24 overflow-hidden rounded-2xl border text-left transition duration-200 md:h-28 ${
                      isSelected
                        ? 'border-[#C8956C] shadow-[0_0_0_1px_rgba(200,149,108,0.35)]'
                        : 'border-[#7A8BA8]/12 hover:border-[#C8956C]/60'
                    }`}
                  >
                    <Image
                      src={imagePath('thumb', item.slug)}
                      alt={item.alt[locale]}
                      fill
                      sizes="(min-width: 768px) 180px, 50vw"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.025]"
                      style={{ objectPosition: item.focus ?? 'center' }}
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-[#07111C]/74 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                      <span className="min-w-0">
                        <span className="block truncate text-[10px] font-bold uppercase tracking-[0.12em] text-[#C8956C]">
                          {item.label[locale]}
                        </span>
                        <span className="block truncate text-sm font-semibold text-white">
                          {item.title[locale]}
                        </span>
                      </span>
                      <span className="font-serif text-xl text-white/80">
                        {String(itemIndex + 1).padStart(2, '0')}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl border border-[#7A8BA8]/12 bg-[#102844]/62 p-3">
              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1" aria-label="Gallery thumbnails">
                {visibleItems.map((item) => {
                  const isSelected = item.slug === selectedItem.slug;
                  return (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => selectItem(item)}
                      aria-label={item.title[locale]}
                      className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border transition duration-200 ${
                        isSelected ? 'border-[#C8956C]' : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={imagePath('thumb', item.slug)}
                        alt=""
                        fill
                        sizes="80px"
                        decoding="async"
                        className="h-full w-full object-cover"
                        style={{ objectPosition: item.focus ?? 'center' }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => openBooking()}
              className="min-h-11 rounded-2xl bg-[#C8956C] px-6 text-sm font-bold text-[#142E4A] shadow-[0_16px_42px_rgba(200,149,108,0.18)] transition hover:-translate-y-0.5 hover:bg-[#D4A574] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8DFD0]"
            >
              {copy.book}
            </button>
          </div>
        </div>
      </div>

      {typeof document !== 'undefined'
        ? createPortal(
            lightboxItem ? (
              <div
                className="fixed inset-0 z-[10000] grid bg-[#0D1414]/90 p-4 text-[#F7F2E8] backdrop-blur-xl md:grid-cols-[64px_minmax(0,1fr)_64px] md:items-center md:gap-4 md:p-8"
                role="dialog"
                aria-modal="true"
                aria-label={lightboxItem.title[locale]}
                onClick={() => setLightboxIndex(null)}
              >
                <button
                  type="button"
                  aria-label={copy.close}
                  onClick={() => setLightboxIndex(null)}
                  className="absolute right-4 top-4 z-10 grid size-12 place-items-center rounded-full border border-white/20 bg-white/10 text-2xl leading-none transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8956C]"
                >
                  ×
                </button>
                <button
                  type="button"
                  aria-label={copy.previous}
                  onClick={(event) => {
                    event.stopPropagation();
                    moveLightbox(-1);
                  }}
                  className="order-2 mx-auto mt-4 grid size-12 place-items-center rounded-full border border-white/20 bg-white/10 transition hover:bg-white/20 md:order-none md:mt-0"
                >
                  ‹
                </button>
                <figure className="order-1 mx-auto grid w-full max-w-6xl gap-4 md:order-none" onClick={(event) => event.stopPropagation()}>
                  <div className="relative h-[54vh] overflow-hidden rounded-xl bg-white/5 md:h-[76vh]">
                    <Image
                      src={imagePath('full', lightboxItem.slug)}
                      alt={lightboxItem.alt[locale]}
                      fill
                      sizes="100vw"
                      className="h-full w-full object-contain"
                      decoding="async"
                    />
                  </div>
                  <figcaption className="flex items-center justify-between gap-4">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                      {lightboxItem.label[locale]} {(lightboxIndex ?? 0) + 1}/{visibleItems.length}
                    </span>
                    <strong className="font-serif text-2xl font-light md:text-4xl">
                      {lightboxItem.title[locale]}
                    </strong>
                  </figcaption>
                </figure>
                <button
                  type="button"
                  aria-label={copy.next}
                  onClick={(event) => {
                    event.stopPropagation();
                    moveLightbox(1);
                  }}
                  className="order-3 mx-auto mt-4 grid size-12 place-items-center rounded-full border border-white/20 bg-white/10 transition hover:bg-white/20 md:order-none md:mt-0"
                >
                  ›
                </button>
              </div>
            ) : null,
            document.body
          )
        : null}
    </section>
  );
}
