import type { Locale } from '@/types/i18n';
import { BUSINESS_CONTACT, BUSINESS_ID, BUSINESS_NAME, SITE_URL } from '@/lib/seo';

export type OrganicPageSlug =
  | 'massage-tashkent'
  | 'spa-with-pool-tashkent'
  | 'sauna-hammam-tashkent'
  | 'spa-packages-tashkent'
  | 'wellness-membership-tashkent';

export interface OrganicPageContent {
  slug: OrganicPageSlug;
  title: string;
  metaTitle: string;
  description: string;
  eyebrow: string;
  h1: string;
  lead: string;
  image: string;
  primaryCta: string;
  secondaryCta: string;
  sections: Array<{
    title: string;
    body: string;
    bullets: string[];
  }>;
  facts: Array<{ label: string; value: string }>;
  faq: Array<{ question: string; answer: string }>;
  relatedLabel: string;
}

export const ORGANIC_SLUGS: OrganicPageSlug[] = [
  'massage-tashkent',
  'spa-with-pool-tashkent',
  'sauna-hammam-tashkent',
  'spa-packages-tashkent',
  'wellness-membership-tashkent',
];

export const ORGANIC_PAGES: Record<OrganicPageSlug, Record<Locale, OrganicPageContent>> = {
  'massage-tashkent': {
    ru: {
      slug: 'massage-tashkent',
      title: 'Массаж в Ташкенте',
      metaTitle: 'Массаж в Ташкенте — Serenity Spa',
      description: 'Авторские массажи Serenity Spa в Ташкенте: балийский, лимфодренажный, горячие камни, спина и шея. Запись ежедневно с 07:00 до 23:00.',
      eyebrow: 'Авторские техники',
      h1: 'Массаж в Ташкенте для расслабления, восстановления и снятия напряжения',
      lead: 'Serenity Spa предлагает массажи в Ташкенте с разной интенсивностью: от мягкого расслабления до глубокого мышечного восстановления. Гость может выбрать балийский массаж, лимфодренаж, терапию горячими камнями, массаж спины, шеи и плеч или авторскую программу Signature of Serenity.',
      image: '/images/gallery/full/couples-treatment.webp',
      primaryCta: 'Записаться на массаж',
      secondaryCta: 'Смотреть все услуги',
      sections: [
        {
          title: 'Как выбрать массаж',
          body: 'Если цель — снять стресс и перезагрузиться, подойдёт балийский массаж или Signature of Serenity. Для ощущения лёгкости и работы с отёками выбирают лимфодренаж. При напряжении в спине, шее и плечах лучше начать с локального массажа или глубокого мышечного ухода.',
          bullets: ['Балийский массаж 60 или 90 минут', 'Лимфодренажный детокс-массаж 90 минут', 'Терапия горячими камнями 90 минут', 'Массаж спины, шеи и плеч 30 минут'],
        },
        {
          title: 'Почему Serenity Spa',
          body: 'Массаж проходит в спокойной spa-среде с доступом к общей wellness-инфраструктуре центра. После процедуры можно совместить отдых с бассейном, сауной или джакузи, если выбран подходящий пакет или формат посещения.',
          bullets: ['Ежедневная запись', 'Центр в Ташкенте', 'SPA программы для одного или двоих', 'Телефон для записи: +998 71 210 88 95'],
        },
      ],
      facts: [
        { label: 'Локация', value: 'Укчи 1, Ташкент' },
        { label: 'Форматы', value: '30, 60, 90 и 120 минут' },
        { label: 'Популярно', value: 'Балийский массаж и Signature of Serenity' },
      ],
      faq: [
        { question: 'Какой массаж выбрать в Serenity Spa?', answer: 'Для расслабления подойдёт балийский массаж, для глубокого мышечного восстановления — «Дыхание тела», для мягкого детокса — лимфодренажный массаж.' },
        { question: 'Можно ли записаться на массаж в день обращения?', answer: 'Да, запись возможна через форму сайта или по телефону. Администратор подтвердит ближайшее доступное время.' },
        { question: 'Сколько длится массаж?', answer: 'В меню есть процедуры на 30, 60, 90 и 120 минут. Продолжительность зависит от выбранной техники.' },
      ],
      relatedLabel: 'Другие spa-направления',
    },
    en: {
      slug: 'massage-tashkent',
      title: 'Massage in Tashkent',
      metaTitle: 'Massage in Tashkent — Serenity Spa',
      description: 'Signature massages in Tashkent: Balinese, lymphatic drainage, hot stone therapy, back and neck massage. Book daily from 07:00 to 23:00.',
      eyebrow: 'Signature techniques',
      h1: 'Massage in Tashkent for relaxation, recovery and tension relief',
      lead: 'Serenity Spa offers massages in Tashkent for different needs, from soft relaxation to deep muscular recovery. Guests can choose Balinese massage, lymphatic drainage, hot stone therapy, back and neck massage or the Signature of Serenity program.',
      image: '/images/gallery/full/couples-treatment.webp',
      primaryCta: 'Book a massage',
      secondaryCta: 'View all services',
      sections: [
        {
          title: 'How to choose a massage',
          body: 'For stress relief, choose Balinese massage or Signature of Serenity. For lightness and detox, lymphatic drainage is a good fit. For back, neck and shoulder tension, start with local massage or deep muscle work.',
          bullets: ['Balinese massage 60 or 90 minutes', 'Lymphatic drainage detox massage 90 minutes', 'Hot stone therapy 90 minutes', 'Back, neck and shoulder massage 30 minutes'],
        },
        {
          title: 'Why Serenity Spa',
          body: 'The treatment takes place in a calm spa environment with access to the wellness facilities when included in your visit or package.',
          bullets: ['Daily bookings', 'Located in Tashkent', 'Spa programs for one or two guests', 'Booking phone: +998 71 210 88 95'],
        },
      ],
      facts: [
        { label: 'Location', value: 'Ukchi 1, Tashkent' },
        { label: 'Duration', value: '30, 60, 90 and 120 minutes' },
        { label: 'Popular', value: 'Balinese and Signature of Serenity' },
      ],
      faq: [
        { question: 'Which massage should I choose at Serenity Spa?', answer: 'Choose Balinese massage for relaxation, Body Breath for deeper muscle work, and lymphatic drainage massage for a softer detox effect.' },
        { question: 'Can I book a massage for today?', answer: 'Yes. Submit the website form or call the spa, and the administrator will confirm the nearest available time.' },
        { question: 'How long does a massage take?', answer: 'The menu includes treatments of 30, 60, 90 and 120 minutes depending on the chosen technique.' },
      ],
      relatedLabel: 'Related spa directions',
    },
    uz: {
      slug: 'massage-tashkent',
      title: 'Toshkentda massaj',
      metaTitle: 'Toshkentda massaj — Serenity Spa',
      description: 'Toshkentdagi Serenity Spa massajlari: Bali massaji, limfodrenaj, issiq toshlar, bel va bo‘yin massaji. Har kuni 07:00–23:00 yozilish mumkin.',
      eyebrow: 'Mualliflik texnikalari',
      h1: 'Toshkentda dam olish, tiklanish va taranglikni kamaytirish uchun massaj',
      lead: 'Serenity Spa Toshkentda turli ehtiyojlar uchun massajlarni taklif qiladi: yumshoq relaksatsiyadan chuqur mushak tiklanishigacha. Bali massaji, limfodrenaj, issiq toshlar terapiyasi, bel-bo‘yin massaji yoki Signature of Serenity dasturini tanlash mumkin.',
      image: '/images/gallery/full/couples-treatment.webp',
      primaryCta: 'Massajga yozilish',
      secondaryCta: 'Xizmatlarni ko‘rish',
      sections: [
        {
          title: 'Qaysi massajni tanlash kerak',
          body: 'Stressni kamaytirish uchun Bali massaji yoki Signature of Serenity mos keladi. Yengillik va detoks uchun limfodrenaj, bel va bo‘yin tarangligi uchun lokal yoki chuqur massaj tanlanadi.',
          bullets: ['Bali massaji 60 yoki 90 daqiqa', 'Limfodrenaj detoks massaji 90 daqiqa', 'Issiq toshlar terapiyasi 90 daqiqa', 'Bel, bo‘yin va yelka massaji 30 daqiqa'],
        },
        {
          title: 'Nima uchun Serenity Spa',
          body: 'Muolaja sokin spa muhitida o‘tadi. Tanlangan tashrif yoki paketga qarab basseyn, sauna va jakuzi bilan birlashtirish mumkin.',
          bullets: ['Har kuni yozilish', 'Toshkentdagi markaz', 'Bir yoki ikki kishi uchun spa dasturlar', 'Telefon: +998 71 210 88 95'],
        },
      ],
      facts: [
        { label: 'Manzil', value: 'Ukchi 1, Toshkent' },
        { label: 'Davomiylik', value: '30, 60, 90 va 120 daqiqa' },
        { label: 'Mashhur', value: 'Bali massaji va Signature of Serenity' },
      ],
      faq: [
        { question: 'Serenity Spa’da qaysi massajni tanlash kerak?', answer: 'Dam olish uchun Bali massaji, chuqur mushak tiklanishi uchun “Tana nafasi”, yumshoq detoks uchun limfodrenaj massaji mos keladi.' },
        { question: 'Bugunga massajga yozilish mumkinmi?', answer: 'Ha. Saytdagi forma orqali yoki telefon orqali yoziling, administrator eng yaqin vaqtni tasdiqlaydi.' },
        { question: 'Massaj qancha davom etadi?', answer: 'Menyuda 30, 60, 90 va 120 daqiqalik muolajalar mavjud.' },
      ],
      relatedLabel: 'Boshqa spa yo‘nalishlari',
    },
  },
  'spa-with-pool-tashkent': {
    ru: {
      slug: 'spa-with-pool-tashkent',
      title: 'SPA с бассейном в Ташкенте',
      metaTitle: 'SPA с бассейном в Ташкенте — Serenity Spa',
      description: 'Serenity Spa в Ташкенте: бассейн, джакузи, сауны, тренажёрный зал, массажи и абонементы. Разовое посещение и клубные форматы.',
      eyebrow: 'Бассейн и восстановление',
      h1: 'SPA с бассейном в Ташкенте для отдыха, плавания и восстановления',
      lead: 'Serenity Spa объединяет бассейн, джакузи, сауны, тренажёрный зал и spa-процедуры в одном wellness-пространстве. Формат подходит для разового отдыха, регулярного посещения по абонементу или дополнения к массажу и SPA программе.',
      image: '/hero-pool.webp',
      primaryCta: 'Записаться в spa',
      secondaryCta: 'Абонементы',
      sections: [
        {
          title: 'Что входит в wellness-зону',
          body: 'Гости используют бассейн, финскую и паровую сауны, джакузи и тренажёрный зал. Для регулярных посещений доступны абонементы на разные сроки.',
          bullets: ['Бассейн для плавания и отдыха', 'Финская и паровая сауны', 'Джакузи для восстановления', 'Тренажёрный зал'],
        },
        {
          title: 'Кому подходит',
          body: 'Формат spa с бассейном подходит тем, кто хочет совместить лёгкую физическую активность, термальную зону и спокойный отдых без поездки за город.',
          bullets: ['После рабочего дня', 'Для выходного восстановления', 'Для регулярного wellness-ритуала', 'Для сочетания с массажем'],
        },
      ],
      facts: [
        { label: 'Вода', value: 'Бассейн и джакузи' },
        { label: 'Тепло', value: 'Финская и паровая сауны' },
        { label: 'График', value: '07:00–23:00 ежедневно' },
      ],
      faq: [
        { question: 'Есть ли в Serenity Spa бассейн?', answer: 'Да, в Serenity Spa есть бассейн для плавания и отдыха, а также джакузи, финская сауна, паровая сауна и тренажёрный зал.' },
        { question: 'Можно ли прийти только в бассейн и сауны?', answer: 'Да, доступна разовая wellness-зона и абонементы. Детали и свободное время лучше уточнить у администратора.' },
        { question: 'Можно ли совместить бассейн с массажем?', answer: 'Да, бассейн и термальная зона хорошо сочетаются с массажами и SPA пакетами.' },
      ],
      relatedLabel: 'Ещё по теме',
    },
    en: {
      slug: 'spa-with-pool-tashkent',
      title: 'Spa with pool in Tashkent',
      metaTitle: 'Spa with pool in Tashkent — Serenity Spa',
      description: 'Serenity Spa in Tashkent: swimming pool, jacuzzi, saunas, fitness center, massages and memberships for day visits and regular wellness.',
      eyebrow: 'Pool and recovery',
      h1: 'Spa with pool in Tashkent for swimming, rest and recovery',
      lead: 'Serenity Spa combines a swimming pool, jacuzzi, saunas, fitness center and spa treatments in one wellness space. It works for day visits, regular memberships or as an addition to massage and spa programs.',
      image: '/hero-pool.webp',
      primaryCta: 'Book a spa visit',
      secondaryCta: 'Memberships',
      sections: [
        { title: 'What is included', body: 'Guests can use the swimming pool, Finnish and steam saunas, jacuzzi and fitness center. Memberships are available for regular visits.', bullets: ['Swimming pool', 'Finnish and steam saunas', 'Jacuzzi', 'Fitness center'] },
        { title: 'Who it suits', body: 'A spa with pool is ideal for combining gentle activity, thermal recovery and calm rest inside the city.', bullets: ['After work', 'Weekend recovery', 'Regular wellness routine', 'Together with massage'] },
      ],
      facts: [
        { label: 'Water', value: 'Pool and jacuzzi' },
        { label: 'Heat', value: 'Finnish and steam saunas' },
        { label: 'Hours', value: 'Daily 07:00–23:00' },
      ],
      faq: [
        { question: 'Does Serenity Spa have a swimming pool?', answer: 'Yes. Serenity Spa has a swimming pool, jacuzzi, Finnish sauna, steam sauna and fitness center.' },
        { question: 'Can I visit only the pool and saunas?', answer: 'Yes. Day access and memberships are available. The administrator can confirm availability.' },
        { question: 'Can I combine the pool with massage?', answer: 'Yes. The pool and thermal zone pair well with massages and spa packages.' },
      ],
      relatedLabel: 'Related topics',
    },
    uz: {
      slug: 'spa-with-pool-tashkent',
      title: 'Toshkentda basseynli spa',
      metaTitle: 'Toshkentda basseynli spa — Serenity Spa',
      description: 'Serenity Spa Toshkentda: basseyn, jakuzi, saunalar, sport zali, massajlar va abonementlar.',
      eyebrow: 'Basseyn va tiklanish',
      h1: 'Toshkentda suzish, dam olish va tiklanish uchun basseynli spa',
      lead: 'Serenity Spa basseyn, jakuzi, saunalar, sport zali va spa muolajalarini bitta wellness makonda birlashtiradi. Bir martalik tashrif, abonement yoki massaj bilan birga foydalanish mumkin.',
      image: '/hero-pool.webp',
      primaryCta: 'Spa tashrifga yozilish',
      secondaryCta: 'Abonementlar',
      sections: [
        { title: 'Nimalar kiradi', body: 'Mehmonlar basseyn, fin va bug‘ saunalari, jakuzi hamda sport zalidan foydalanishi mumkin. Doimiy tashriflar uchun abonementlar mavjud.', bullets: ['Basseyn', 'Fin va bug‘ saunalari', 'Jakuzi', 'Sport zali'] },
        { title: 'Kimlar uchun mos', body: 'Basseynli spa shahar ichida yengil faollik, termal tiklanish va sokin dam olishni birlashtirmoqchi bo‘lganlar uchun mos.', bullets: ['Ishdan keyin', 'Dam olish kunlari', 'Doimiy wellness odati', 'Massaj bilan birga'] },
      ],
      facts: [
        { label: 'Suv', value: 'Basseyn va jakuzi' },
        { label: 'Issiqlik', value: 'Fin va bug‘ saunalari' },
        { label: 'Vaqt', value: 'Har kuni 07:00–23:00' },
      ],
      faq: [
        { question: 'Serenity Spa’da basseyn bormi?', answer: 'Ha. Serenity Spa’da basseyn, jakuzi, fin saunasi, bug‘ saunasi va sport zali mavjud.' },
        { question: 'Faqat basseyn va saunalarga kelish mumkinmi?', answer: 'Ha. Bir martalik tashrif va abonementlar mavjud. Bo‘sh vaqtni administrator tasdiqlaydi.' },
        { question: 'Basseynni massaj bilan birlashtirish mumkinmi?', answer: 'Ha. Basseyn va termal zona massaj va spa paketlar bilan yaxshi uyg‘unlashadi.' },
      ],
      relatedLabel: 'O‘xshash mavzular',
    },
  },
  'sauna-hammam-tashkent': {
    ru: {
      slug: 'sauna-hammam-tashkent',
      title: 'Сауна и хаммам в Ташкенте',
      metaTitle: 'Сауна и хаммам в Ташкенте — Serenity Spa',
      description: 'Финская и паровая сауны Serenity Spa в Ташкенте: термальная зона, бассейн, джакузи, массажи и spa-пакеты.',
      eyebrow: 'Термальная зона',
      h1: 'Сауна и хаммам в Ташкенте в спокойном wellness-пространстве',
      lead: 'В Serenity Spa термальная зона включает финскую сауну и паровую сауну, которые можно сочетать с бассейном, джакузи, массажем или SPA пакетом. Это формат для расслабления мышц, восстановления после нагрузки и спокойного отдыха.',
      image: '/infra-sauna.webp',
      primaryCta: 'Уточнить посещение',
      secondaryCta: 'Смотреть spa-пакеты',
      sections: [
        { title: 'Финская и паровая сауна', body: 'Финская сауна даёт сухое тепло, паровая — более влажный мягкий прогрев. Вместе они помогают выстроить комфортный термальный ритуал.', bullets: ['Финская сауна', 'Паровая сауна', 'Джакузи после прогрева', 'Бассейн для контраста'] },
        { title: 'Как лучше сочетать', body: 'Термальную зону часто выбирают перед массажем или как часть комплексного SPA дня. Администратор поможет подобрать формат по времени и нагрузке.', bullets: ['Перед расслабляющим массажем', 'В составе абонемента', 'В парной программе', 'После тренировки'] },
      ],
      facts: [
        { label: 'Тепло', value: 'Финская и паровая сауны' },
        { label: 'Восстановление', value: 'Джакузи и бассейн' },
        { label: 'Адрес', value: 'Укчи 1, Ташкент' },
      ],
      faq: [
        { question: 'Какие сауны есть в Serenity Spa?', answer: 'В Serenity Spa есть финская сауна и паровая сауна. Также доступны бассейн и джакузи.' },
        { question: 'Можно ли посетить сауну без массажа?', answer: 'Да, сауна доступна в рамках wellness-посещения и абонементов. Уточните свободное время у администратора.' },
        { question: 'С чем сочетать сауну?', answer: 'Сауну удобно сочетать с бассейном, джакузи, расслабляющим массажем или SPA пакетом.' },
      ],
      relatedLabel: 'Связанные направления',
    },
    en: {
      slug: 'sauna-hammam-tashkent',
      title: 'Sauna and hammam in Tashkent',
      metaTitle: 'Sauna and hammam in Tashkent — Serenity Spa',
      description: 'Finnish and steam saunas at Serenity Spa in Tashkent with pool, jacuzzi, massages and spa packages.',
      eyebrow: 'Thermal zone',
      h1: 'Sauna and hammam in Tashkent in a calm wellness space',
      lead: 'Serenity Spa includes Finnish and steam saunas that can be combined with the pool, jacuzzi, massage or a full spa package.',
      image: '/infra-sauna.webp',
      primaryCta: 'Ask about a visit',
      secondaryCta: 'View spa packages',
      sections: [
        { title: 'Finnish and steam sauna', body: 'The Finnish sauna provides dry heat, while the steam sauna offers a softer humid warm-up.', bullets: ['Finnish sauna', 'Steam sauna', 'Jacuzzi after warming', 'Pool for contrast'] },
        { title: 'How to combine it', body: 'The thermal zone is often chosen before massage or as part of a complete spa day.', bullets: ['Before relaxing massage', 'With membership', 'As a couple program', 'After fitness'] },
      ],
      facts: [
        { label: 'Heat', value: 'Finnish and steam sauna' },
        { label: 'Recovery', value: 'Jacuzzi and pool' },
        { label: 'Address', value: 'Ukchi 1, Tashkent' },
      ],
      faq: [
        { question: 'What saunas does Serenity Spa have?', answer: 'Serenity Spa has a Finnish sauna and a steam sauna. Pool and jacuzzi are also available.' },
        { question: 'Can I visit the sauna without massage?', answer: 'Yes. The sauna is available through wellness visits and memberships, subject to availability.' },
        { question: 'What should I combine sauna with?', answer: 'Sauna pairs well with the pool, jacuzzi, relaxing massage or a spa package.' },
      ],
      relatedLabel: 'Related directions',
    },
    uz: {
      slug: 'sauna-hammam-tashkent',
      title: 'Toshkentda sauna va hammom',
      metaTitle: 'Toshkentda sauna va hammom — Serenity Spa',
      description: 'Serenity Spa Toshkentda fin va bug‘ saunalari, basseyn, jakuzi, massajlar va spa paketlar.',
      eyebrow: 'Termal zona',
      h1: 'Toshkentda sokin wellness makonda sauna va hammom',
      lead: 'Serenity Spa’da fin saunasi va bug‘ saunasi mavjud. Ularni basseyn, jakuzi, massaj yoki to‘liq spa paket bilan birlashtirish mumkin.',
      image: '/infra-sauna.webp',
      primaryCta: 'Tashrifni aniqlash',
      secondaryCta: 'Spa paketlar',
      sections: [
        { title: 'Fin va bug‘ saunasi', body: 'Fin saunasi quruq issiqlik beradi, bug‘ saunasi esa nam va yumshoqroq isitadi.', bullets: ['Fin saunasi', 'Bug‘ saunasi', 'Jakuzi', 'Basseyn'] },
        { title: 'Nima bilan birlashtirish kerak', body: 'Termal zona ko‘pincha massajdan oldin yoki to‘liq spa kuni tarkibida tanlanadi.', bullets: ['Massajdan oldin', 'Abonement bilan', 'Juftlik dasturida', 'Sportdan keyin'] },
      ],
      facts: [
        { label: 'Issiqlik', value: 'Fin va bug‘ saunasi' },
        { label: 'Tiklanish', value: 'Jakuzi va basseyn' },
        { label: 'Manzil', value: 'Ukchi 1, Toshkent' },
      ],
      faq: [
        { question: 'Serenity Spa’da qanday saunalar bor?', answer: 'Serenity Spa’da fin saunasi va bug‘ saunasi bor. Basseyn va jakuzi ham mavjud.' },
        { question: 'Massajsiz saunaga kelish mumkinmi?', answer: 'Ha. Sauna wellness tashrif va abonementlar doirasida mavjud.' },
        { question: 'Saunani nima bilan birlashtirish mumkin?', answer: 'Saunani basseyn, jakuzi, massaj yoki spa paket bilan birlashtirish qulay.' },
      ],
      relatedLabel: 'O‘xshash yo‘nalishlar',
    },
  },
  'spa-packages-tashkent': {
    ru: {
      slug: 'spa-packages-tashkent',
      title: 'SPA программы в Ташкенте',
      metaTitle: 'SPA программы и пакеты в Ташкенте — Serenity Spa',
      description: 'SPA программы Serenity Spa: мужской, женский, авторский Serenity и пакет для двоих. Массажи, пилинги, термальная зона и чайная церемония.',
      eyebrow: 'Комплексные программы',
      h1: 'SPA программы в Ташкенте для одного, пары или полного дня восстановления',
      lead: 'SPA пакеты Serenity Spa объединяют процедуры в готовый сценарий: бассейн, термальная зона, пилинг, массаж, обёртывание и чайная церемония. Такой формат удобен, когда хочется не выбирать отдельные услуги, а получить цельный spa-день.',
      image: '/images/gallery/full/treatment-suite.webp',
      primaryCta: 'Выбрать программу',
      secondaryCta: 'Смотреть услуги',
      sections: [
        { title: 'Какие пакеты есть', body: 'В меню есть мужской пакет, женский пакет, авторский пакет Serenity и программа для двоих. Каждый пакет отличается длительностью, набором процедур и настроением.', bullets: ['Мужской пакет', 'Женский пакет', 'Авторский пакет Serenity', 'Пакет для двоих'] },
        { title: 'Когда выбирать пакет', body: 'Пакет подходит для подарка, романтического отдыха, восстановления после нагрузки или первого знакомства с Serenity Spa.', bullets: ['Подарочный визит', 'Романтический формат', 'Глубокое восстановление', 'Первый spa-день'] },
      ],
      facts: [
        { label: 'Длительность', value: 'От 3 до 4,5 часов' },
        { label: 'Форматы', value: 'Для одного или двоих' },
        { label: 'Состав', value: 'Массаж, уходы, термальная зона' },
      ],
      faq: [
        { question: 'Какие SPA программы есть в Serenity Spa?', answer: 'Доступны мужской пакет, женский пакет, авторский пакет Serenity и пакет для двоих.' },
        { question: 'Сколько длится SPA программа?', answer: 'Программы длятся примерно от 3 до 4,5 часов в зависимости от выбранного пакета.' },
        { question: 'Можно ли подарить SPA программу?', answer: 'Да, SPA программа подходит как подарок. Детали оформления лучше уточнить у администратора.' },
      ],
      relatedLabel: 'Похожие запросы',
    },
    en: {
      slug: 'spa-packages-tashkent',
      title: 'Spa packages in Tashkent',
      metaTitle: 'Spa packages in Tashkent — Serenity Spa',
      description: 'Serenity Spa packages: men’s, women’s, Signature Serenity and couples package with massage, peels, thermal zone and tea ceremony.',
      eyebrow: 'Complete programs',
      h1: 'Spa packages in Tashkent for one guest, couples or full recovery days',
      lead: 'Serenity Spa packages combine treatments into a complete scenario: pool, thermal zone, peel, massage, wrap and tea ceremony.',
      image: '/images/gallery/full/treatment-suite.webp',
      primaryCta: 'Choose a package',
      secondaryCta: 'View services',
      sections: [
        { title: 'Available packages', body: 'The menu includes men’s, women’s, Signature Serenity and couples packages, each with its own duration and treatment set.', bullets: ['Men’s package', 'Women’s package', 'Signature Serenity', 'Couples package'] },
        { title: 'When to choose a package', body: 'A package works well as a gift, romantic visit, recovery day or first introduction to Serenity Spa.', bullets: ['Gift visit', 'Romantic format', 'Deep recovery', 'First spa day'] },
      ],
      facts: [
        { label: 'Duration', value: '3 to 4.5 hours' },
        { label: 'Formats', value: 'For one or two guests' },
        { label: 'Includes', value: 'Massage, treatments, thermal zone' },
      ],
      faq: [
        { question: 'What spa packages does Serenity Spa offer?', answer: 'Serenity Spa offers men’s, women’s, Signature Serenity and couples packages.' },
        { question: 'How long does a spa package take?', answer: 'Packages take about 3 to 4.5 hours depending on the selected program.' },
        { question: 'Can I give a spa package as a gift?', answer: 'Yes, spa packages work well as gifts. Ask the administrator for available formats.' },
      ],
      relatedLabel: 'Related searches',
    },
    uz: {
      slug: 'spa-packages-tashkent',
      title: 'Toshkentda spa dasturlar',
      metaTitle: 'Toshkentda spa dasturlar — Serenity Spa',
      description: 'Serenity Spa dasturlari: erkaklar, ayollar, Signature Serenity va juftlik paketi. Massaj, piling, termal zona va choy marosimi.',
      eyebrow: 'Kompleks dasturlar',
      h1: 'Toshkentda bir kishi, juftlik yoki to‘liq tiklanish kuni uchun spa dasturlar',
      lead: 'Serenity Spa paketlari muolajalarni tayyor ssenariyga birlashtiradi: basseyn, termal zona, piling, massaj, o‘rash va choy marosimi.',
      image: '/images/gallery/full/treatment-suite.webp',
      primaryCta: 'Dastur tanlash',
      secondaryCta: 'Xizmatlarni ko‘rish',
      sections: [
        { title: 'Qanday paketlar bor', body: 'Menyuda erkaklar paketi, ayollar paketi, Signature Serenity va juftlik paketi mavjud.', bullets: ['Erkaklar paketi', 'Ayollar paketi', 'Signature Serenity', 'Juftlik paketi'] },
        { title: 'Qachon paket tanlash kerak', body: 'Paket sovg‘a, romantik tashrif, tiklanish kuni yoki Serenity Spa bilan birinchi tanishuv uchun mos.', bullets: ['Sovg‘a', 'Romantik format', 'Chuqur tiklanish', 'Birinchi spa kuni'] },
      ],
      facts: [
        { label: 'Davomiylik', value: '3 dan 4,5 soatgacha' },
        { label: 'Format', value: 'Bir yoki ikki kishi uchun' },
        { label: 'Tarkib', value: 'Massaj, muolajalar, termal zona' },
      ],
      faq: [
        { question: 'Serenity Spa’da qanday spa dasturlar bor?', answer: 'Erkaklar, ayollar, Signature Serenity va juftlik paketlari mavjud.' },
        { question: 'Spa dastur qancha davom etadi?', answer: 'Tanlangan paketga qarab taxminan 3 dan 4,5 soatgacha davom etadi.' },
        { question: 'Spa paketni sovg‘a qilish mumkinmi?', answer: 'Ha, spa paket sovg‘a sifatida mos. Formatlarni administrator bilan aniqlang.' },
      ],
      relatedLabel: 'O‘xshash so‘rovlar',
    },
  },
  'wellness-membership-tashkent': {
    ru: {
      slug: 'wellness-membership-tashkent',
      title: 'Абонемент в бассейн и SPA в Ташкенте',
      metaTitle: 'Абонемент в бассейн и SPA в Ташкенте — Serenity Spa',
      description: 'Абонементы Serenity Spa в Ташкенте: бассейн, тренажёрный зал, сауны, джакузи, детокс вода и клубные преимущества.',
      eyebrow: 'Регулярный wellness',
      h1: 'Абонемент в бассейн и SPA в Ташкенте для регулярного восстановления',
      lead: 'Абонементы Serenity Spa подходят тем, кто хочет регулярно посещать бассейн, тренажёрный зал, финскую и паровую сауны, джакузи и wellness-зону. Есть форматы на 12 посещений, 1 месяц, 3 месяца, 6 месяцев и 12 месяцев.',
      image: '/images/gallery/full/pool-day-wide.webp',
      primaryCta: 'Подобрать абонемент',
      secondaryCta: 'Смотреть инфраструктуру',
      sections: [
        { title: 'Что входит', body: 'Большинство абонементов включает бассейн, тренажёрный зал, паровую и финскую сауны, джакузи, Wi‑Fi и детокс воду.', bullets: ['Бассейн', 'Тренажёрный зал', 'Паровая и финская сауны', 'Джакузи'] },
        { title: 'Как выбрать срок', body: 'Для знакомства подойдёт разовое посещение или 12 визитов. Для привычки и восстановления лучше рассмотреть месячные и годовые форматы.', bullets: ['Разовый визит', '12 посещений', '1, 3 и 6 месяцев', '12 месяцев и семейный формат'] },
      ],
      facts: [
        { label: 'Старт', value: 'Разовое посещение от 600 000 UZS' },
        { label: 'Сроки', value: '12 визитов, 1–12 месяцев' },
        { label: 'Клуб', value: 'Скидки и гостевые визиты в старших форматах' },
      ],
      faq: [
        { question: 'Какие абонементы есть в Serenity Spa?', answer: 'Есть разовое посещение, 12 посещений, стандартный, бронзовый, серебряный, золотой, семейный и детский форматы.' },
        { question: 'Что входит в абонемент?', answer: 'Обычно включены бассейн, тренажёрный зал, паровая сауна, финская сауна, джакузи, Wi‑Fi и детокс вода.' },
        { question: 'Есть ли семейный абонемент?', answer: 'Да, доступен семейный формат на 12 месяцев с условиями для детей и клубными преимуществами.' },
      ],
      relatedLabel: 'Также смотрят',
    },
    en: {
      slug: 'wellness-membership-tashkent',
      title: 'Pool and spa membership in Tashkent',
      metaTitle: 'Pool and spa membership in Tashkent — Serenity Spa',
      description: 'Serenity Spa memberships in Tashkent: pool, fitness center, saunas, jacuzzi, detox water and club benefits.',
      eyebrow: 'Regular wellness',
      h1: 'Pool and spa membership in Tashkent for regular recovery',
      lead: 'Serenity Spa memberships are designed for guests who want regular access to the pool, fitness center, Finnish and steam saunas, jacuzzi and wellness zone.',
      image: '/images/gallery/full/pool-day-wide.webp',
      primaryCta: 'Choose membership',
      secondaryCta: 'View facilities',
      sections: [
        { title: 'What is included', body: 'Most memberships include pool, fitness center, steam and Finnish sauna, jacuzzi, Wi‑Fi and detox water.', bullets: ['Pool', 'Fitness center', 'Steam and Finnish saunas', 'Jacuzzi'] },
        { title: 'How to choose duration', body: 'For a first visit choose day access or 12 visits. For a routine, monthly and annual formats work better.', bullets: ['Day visit', '12 visits', '1, 3 and 6 months', '12 months and family format'] },
      ],
      facts: [
        { label: 'Start', value: 'Day visit from 600,000 UZS' },
        { label: 'Terms', value: '12 visits, 1–12 months' },
        { label: 'Club', value: 'Discounts and guest visits in higher tiers' },
      ],
      faq: [
        { question: 'What memberships does Serenity Spa offer?', answer: 'Options include day visit, 12 visits, standard, bronze, silver, gold, family and kids formats.' },
        { question: 'What is included in a membership?', answer: 'Most plans include pool, fitness center, steam sauna, Finnish sauna, jacuzzi, Wi‑Fi and detox water.' },
        { question: 'Is there a family membership?', answer: 'Yes. A 12-month family format is available with child conditions and club benefits.' },
      ],
      relatedLabel: 'Also viewed',
    },
    uz: {
      slug: 'wellness-membership-tashkent',
      title: 'Toshkentda basseyn va spa abonementi',
      metaTitle: 'Toshkentda basseyn va spa abonementi — Serenity Spa',
      description: 'Serenity Spa abonementlari: basseyn, sport zali, saunalar, jakuzi, detoks suv va klub afzalliklari.',
      eyebrow: 'Doimiy wellness',
      h1: 'Toshkentda muntazam tiklanish uchun basseyn va spa abonementi',
      lead: 'Serenity Spa abonementlari basseyn, sport zali, fin va bug‘ saunalari, jakuzi va wellness zonaga muntazam kirishni xohlaydigan mehmonlar uchun mo‘ljallangan.',
      image: '/images/gallery/full/pool-day-wide.webp',
      primaryCta: 'Abonement tanlash',
      secondaryCta: 'Infratuzilmani ko‘rish',
      sections: [
        { title: 'Nimalar kiradi', body: 'Aksariyat abonementlarga basseyn, sport zali, bug‘ va fin saunasi, jakuzi, Wi‑Fi va detoks suv kiradi.', bullets: ['Basseyn', 'Sport zali', 'Bug‘ va fin saunalari', 'Jakuzi'] },
        { title: 'Muddatni qanday tanlash kerak', body: 'Tanishish uchun bir martalik tashrif yoki 12 tashrif, odat uchun esa oylik va yillik formatlar qulay.', bullets: ['Bir martalik tashrif', '12 tashrif', '1, 3 va 6 oy', '12 oy va oilaviy format'] },
      ],
      facts: [
        { label: 'Boshlanish', value: 'Bir martalik tashrif 600 000 UZS dan' },
        { label: 'Muddat', value: '12 tashrif, 1–12 oy' },
        { label: 'Klub', value: 'Yuqori tariflarda chegirmalar va mehmon tashriflari' },
      ],
      faq: [
        { question: 'Serenity Spa’da qanday abonementlar bor?', answer: 'Bir martalik tashrif, 12 tashrif, standart, bronza, kumush, oltin, oilaviy va bolalar formatlari mavjud.' },
        { question: 'Abonementga nimalar kiradi?', answer: 'Odatda basseyn, sport zali, bug‘ saunasi, fin saunasi, jakuzi, Wi‑Fi va detoks suv kiradi.' },
        { question: 'Oilaviy abonement bormi?', answer: 'Ha, bolalar shartlari va klub afzalliklari bilan 12 oylik oilaviy format mavjud.' },
      ],
      relatedLabel: 'Shuningdek ko‘riladi',
    },
  },
};

export function getOrganicPage(slug: string, locale: Locale) {
  return ORGANIC_PAGES[slug as OrganicPageSlug]?.[locale];
}

export function getOrganicPageUrl(locale: Locale, slug: OrganicPageSlug) {
  return `${SITE_URL}/${locale}/services/${slug}`;
}

export function getOrganicPageAlternates(slug: OrganicPageSlug) {
  return {
    ru: getOrganicPageUrl('ru', slug),
    en: getOrganicPageUrl('en', slug),
    uz: getOrganicPageUrl('uz', slug),
    'x-default': getOrganicPageUrl('ru', slug),
  };
}

export function buildOrganicPageJsonLd(page: OrganicPageContent, locale: Locale) {
  const url = getOrganicPageUrl(locale, page.slug);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: page.metaTitle,
        description: page.description,
        inLanguage: locale === 'en' ? 'en' : `${locale}-UZ`,
        about: { '@id': BUSINESS_ID },
        isPartOf: { '@id': `${SITE_URL}/#website` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        mainEntity: { '@id': `${url}#service` },
      },
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: page.title,
        description: page.lead,
        provider: {
          '@type': 'HealthAndBeautyBusiness',
          '@id': BUSINESS_ID,
          name: BUSINESS_NAME,
          telephone: BUSINESS_CONTACT.phone,
        },
        areaServed: [
          { '@type': 'City', name: 'Ташкент' },
          { '@type': 'City', name: 'Tashkent' },
        ],
        url,
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: page.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: BUSINESS_NAME,
            item: `${SITE_URL}/${locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: page.title,
            item: url,
          },
        ],
      },
    ],
  };
}
