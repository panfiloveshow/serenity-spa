import type { Locale } from '@/types/i18n';
import { BUSINESS_CONTACT, BUSINESS_ID, BUSINESS_NAME, SITE_URL } from '@/lib/seo';

export type OrganicPageSlug =
  | 'massage-tashkent'
  | 'balinese-massage-tashkent'
  | 'lymphatic-drainage-massage-tashkent'
  | 'couples-spa-tashkent'
  | 'gift-certificate-spa-tashkent'
  | 'body-wrap-tashkent'
  | 'pool-day-pass-tashkent'
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
  'balinese-massage-tashkent',
  'lymphatic-drainage-massage-tashkent',
  'couples-spa-tashkent',
  'gift-certificate-spa-tashkent',
  'body-wrap-tashkent',
  'pool-day-pass-tashkent',
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
  'balinese-massage-tashkent': {
    ru: {
      slug: 'balinese-massage-tashkent',
      title: 'Балийский массаж в Ташкенте',
      metaTitle: 'Балийский массаж в Ташкенте — Serenity Spa',
      description: 'Балийский массаж Serenity Spa в Ташкенте: 60 или 90 минут, глубокое расслабление, мягкое восстановление и запись ежедневно.',
      eyebrow: 'Массаж всего тела',
      h1: 'Балийский массаж в Ташкенте для глубокого расслабления и восстановления',
      lead: 'Балийский массаж в Serenity Spa сочетает мягкие растягивающие движения, глубокую работу с мышцами и спокойный spa-ритм. Процедура подходит, когда нужно снять накопленное напряжение, улучшить ощущение тела и переключиться после интенсивного дня.',
      image: '/images/gallery/full/treatment-suite.webp',
      primaryCta: 'Записаться на балийский массаж',
      secondaryCta: 'Все массажи',
      sections: [
        { title: 'Что входит', body: 'В меню доступны форматы 60 и 90 минут. Мастер работает со всем телом, уделяя внимание зонам напряжения и общему расслаблению.', bullets: ['60 минут — 1 000 000 UZS', '90 минут — 1 300 000 UZS', 'Массаж всего тела', 'Спокойная spa-комната'] },
        { title: 'Кому подходит', body: 'Балийский массаж выбирают при стрессе, мышечной усталости, нарушенном ритме сна и желании получить мягкое, но ощутимое восстановление.', bullets: ['После рабочего дня', 'Для снятия мышечного напряжения', 'Для первого знакомства со spa', 'Можно совместить с бассейном'] },
      ],
      facts: [
        { label: 'Длительность', value: '60 или 90 минут' },
        { label: 'Цена', value: 'От 1 000 000 UZS' },
        { label: 'Адрес', value: 'Укчи 1, Ташкент' },
      ],
      faq: [
        { question: 'Сколько стоит балийский массаж?', answer: 'Балийский массаж 60 минут стоит 1 000 000 UZS, 90 минут — 1 300 000 UZS.' },
        { question: 'Балийский массаж подходит для первого визита?', answer: 'Да, это один из самых понятных форматов для первого знакомства с массажами Serenity Spa.' },
        { question: 'Можно ли выбрать длительность?', answer: 'Да, доступны варианты 60 и 90 минут. Администратор поможет выбрать формат по цели визита.' },
      ],
      relatedLabel: 'Похожие массажи',
    },
    en: {
      slug: 'balinese-massage-tashkent',
      title: 'Balinese massage in Tashkent',
      metaTitle: 'Balinese massage in Tashkent — Serenity Spa',
      description: 'Balinese massage at Serenity Spa in Tashkent: 60 or 90 minutes, full-body relaxation and daily booking.',
      eyebrow: 'Full-body massage',
      h1: 'Balinese massage in Tashkent for deep relaxation and recovery',
      lead: 'Balinese massage at Serenity Spa combines soft stretching movements, deeper muscle work and a calm spa rhythm. It is designed for stress relief, body awareness and recovery after a busy day.',
      image: '/images/gallery/full/treatment-suite.webp',
      primaryCta: 'Book Balinese massage',
      secondaryCta: 'All massages',
      sections: [
        { title: 'What is included', body: 'The menu includes 60 and 90 minute formats. The therapist works with the whole body and focuses on areas of tension.', bullets: ['60 minutes — 1,000,000 UZS', '90 minutes — 1,300,000 UZS', 'Full-body massage', 'Calm spa room'] },
        { title: 'Who it suits', body: 'Balinese massage is chosen for stress, muscle fatigue, poor sleep rhythm and a soft but noticeable recovery experience.', bullets: ['After work', 'For muscle tension', 'For a first spa visit', 'Can be combined with pool access'] },
      ],
      facts: [
        { label: 'Duration', value: '60 or 90 minutes' },
        { label: 'Price', value: 'From 1,000,000 UZS' },
        { label: 'Address', value: 'Ukchi 1, Tashkent' },
      ],
      faq: [
        { question: 'How much is Balinese massage?', answer: 'Balinese massage costs 1,000,000 UZS for 60 minutes and 1,300,000 UZS for 90 minutes.' },
        { question: 'Is Balinese massage good for a first visit?', answer: 'Yes, it is one of the clearest first-choice massage formats at Serenity Spa.' },
        { question: 'Can I choose the duration?', answer: 'Yes, 60 and 90 minute formats are available.' },
      ],
      relatedLabel: 'Related massages',
    },
    uz: {
      slug: 'balinese-massage-tashkent',
      title: 'Toshkentda Bali massaji',
      metaTitle: 'Toshkentda Bali massaji — Serenity Spa',
      description: 'Serenity Spa’da Bali massaji: 60 yoki 90 daqiqa, butun tana relaksi va har kuni yozilish.',
      eyebrow: 'Butun tana massaji',
      h1: 'Toshkentda chuqur dam olish va tiklanish uchun Bali massaji',
      lead: 'Serenity Spa’dagi Bali massaji yumshoq cho‘zish harakatlari, mushaklar bilan chuqur ishlash va sokin spa ritmini birlashtiradi. Muolaja stressni kamaytirish va band kundan keyin tiklanish uchun mos.',
      image: '/images/gallery/full/treatment-suite.webp',
      primaryCta: 'Bali massajiga yozilish',
      secondaryCta: 'Barcha massajlar',
      sections: [
        { title: 'Nimalar kiradi', body: 'Menyuda 60 va 90 daqiqalik formatlar bor. Mutaxassis butun tana bilan ishlaydi va tarang joylarga e’tibor beradi.', bullets: ['60 daqiqa — 1 000 000 UZS', '90 daqiqa — 1 300 000 UZS', 'Butun tana massaji', 'Sokin spa xonasi'] },
        { title: 'Kimlar uchun mos', body: 'Bali massaji stress, mushak charchog‘i, uyqu ritmi buzilishi va yumshoq tiklanish istagida tanlanadi.', bullets: ['Ishdan keyin', 'Mushak tarangligi uchun', 'Birinchi spa tashrifi uchun', 'Basseyn bilan birlashtirish mumkin'] },
      ],
      facts: [
        { label: 'Davomiylik', value: '60 yoki 90 daqiqa' },
        { label: 'Narx', value: '1 000 000 UZS dan' },
        { label: 'Manzil', value: 'Ukchi 1, Toshkent' },
      ],
      faq: [
        { question: 'Bali massaji qancha turadi?', answer: '60 daqiqalik Bali massaji 1 000 000 UZS, 90 daqiqalik format 1 300 000 UZS turadi.' },
        { question: 'Bali massaji birinchi tashrif uchun mosmi?', answer: 'Ha, Serenity Spa massajlari bilan tanishish uchun qulay format.' },
        { question: 'Davomiylikni tanlash mumkinmi?', answer: 'Ha, 60 va 90 daqiqalik formatlar mavjud.' },
      ],
      relatedLabel: 'O‘xshash massajlar',
    },
  },
  'lymphatic-drainage-massage-tashkent': {
    ru: {
      slug: 'lymphatic-drainage-massage-tashkent',
      title: 'Лимфодренажный массаж в Ташкенте',
      metaTitle: 'Лимфодренажный массаж в Ташкенте — Serenity Spa',
      description: 'Лимфодренажный детокс-массаж Serenity Spa в Ташкенте: 90 минут, мягкая работа с отёками, лёгкостью тела и восстановлением.',
      eyebrow: 'Детокс и лёгкость',
      h1: 'Лимфодренажный массаж в Ташкенте для лёгкости и мягкого детокса',
      lead: 'Лимфодренажный массаж в Serenity Spa — это 90-минутная мягкая техника, направленная на ощущение лёгкости, восстановление после нагрузки и заботу о лимфатической системе. Процедура проходит без агрессивного давления и подходит для спокойного spa-ритуала.',
      image: '/images/gallery/full/treatment-room-tub.webp',
      primaryCta: 'Записаться на лимфодренаж',
      secondaryCta: 'Все услуги',
      sections: [
        { title: 'Формат процедуры', body: 'Мастер работает мягкими ритмичными движениями. Формат подходит тем, кто хочет снизить ощущение тяжести и совместить уход с расслаблением.', bullets: ['90 минут', 'Цена — 1 350 000 UZS', 'Мягкая детокс-техника', 'Можно сочетать с термальной зоной'] },
        { title: 'Когда выбирать', body: 'Лимфодренаж часто выбирают при усталости ног, ощущении отёчности, после перелётов или как часть спокойной программы восстановления.', bullets: ['После перелёта', 'При ощущении тяжести', 'После интенсивной недели', 'В составе spa-дня'] },
      ],
      facts: [
        { label: 'Длительность', value: '90 минут' },
        { label: 'Цена', value: '1 350 000 UZS' },
        { label: 'Формат', value: 'Мягкий детокс-массаж' },
      ],
      faq: [
        { question: 'Сколько длится лимфодренажный массаж?', answer: 'В Serenity Spa лимфодренажный детокс-массаж длится 90 минут.' },
        { question: 'Это болезненная процедура?', answer: 'Нет, техника мягкая и ритмичная. Интенсивность можно обсудить с мастером перед началом.' },
        { question: 'Можно ли сочетать с сауной?', answer: 'Да, но оптимальный порядок и нагрузку лучше уточнить у администратора с учетом самочувствия.' },
      ],
      relatedLabel: 'Также смотрят',
    },
    en: {
      slug: 'lymphatic-drainage-massage-tashkent',
      title: 'Lymphatic drainage massage in Tashkent',
      metaTitle: 'Lymphatic drainage massage in Tashkent — Serenity Spa',
      description: 'Lymphatic drainage detox massage at Serenity Spa in Tashkent: 90 minutes, soft technique for lightness and recovery.',
      eyebrow: 'Detox and lightness',
      h1: 'Lymphatic drainage massage in Tashkent for lightness and soft detox',
      lead: 'Lymphatic drainage massage at Serenity Spa is a 90-minute soft technique focused on lightness, recovery and gentle support of the lymphatic system.',
      image: '/images/gallery/full/treatment-room-tub.webp',
      primaryCta: 'Book lymphatic drainage',
      secondaryCta: 'All services',
      sections: [
        { title: 'Treatment format', body: 'The therapist uses soft rhythmic movements. The format is for guests who want less heaviness and a calm recovery ritual.', bullets: ['90 minutes', 'Price — 1,350,000 UZS', 'Soft detox technique', 'Can be paired with thermal zone'] },
        { title: 'When to choose it', body: 'Guests often choose lymphatic drainage after flights, heavy weeks or when the body feels tired and swollen.', bullets: ['After travel', 'For heaviness', 'After an intense week', 'As part of a spa day'] },
      ],
      facts: [
        { label: 'Duration', value: '90 minutes' },
        { label: 'Price', value: '1,350,000 UZS' },
        { label: 'Format', value: 'Soft detox massage' },
      ],
      faq: [
        { question: 'How long does lymphatic drainage massage take?', answer: 'At Serenity Spa the lymphatic drainage detox massage takes 90 minutes.' },
        { question: 'Is it painful?', answer: 'No, the technique is soft and rhythmic. Intensity can be discussed with the therapist.' },
        { question: 'Can I combine it with sauna?', answer: 'Yes, but the best order depends on your condition and should be confirmed with the administrator.' },
      ],
      relatedLabel: 'Also viewed',
    },
    uz: {
      slug: 'lymphatic-drainage-massage-tashkent',
      title: 'Toshkentda limfodrenaj massaji',
      metaTitle: 'Toshkentda limfodrenaj massaji — Serenity Spa',
      description: 'Serenity Spa’da limfodrenaj detoks massaji: 90 daqiqa, yengillik va tiklanish uchun yumshoq texnika.',
      eyebrow: 'Detoks va yengillik',
      h1: 'Toshkentda yengillik va yumshoq detoks uchun limfodrenaj massaji',
      lead: 'Serenity Spa’dagi limfodrenaj massaji 90 daqiqalik yumshoq texnika bo‘lib, tana yengilligi, tiklanish va limfa tizimiga ehtiyotkor yordamga qaratilgan.',
      image: '/images/gallery/full/treatment-room-tub.webp',
      primaryCta: 'Limfodrenajga yozilish',
      secondaryCta: 'Barcha xizmatlar',
      sections: [
        { title: 'Muolaja formati', body: 'Mutaxassis yumshoq ritmik harakatlardan foydalanadi. Format og‘irlik hissini kamaytirish va sokin tiklanish uchun mos.', bullets: ['90 daqiqa', 'Narx — 1 350 000 UZS', 'Yumshoq detoks texnikasi', 'Termal zona bilan birlashtirish mumkin'] },
        { title: 'Qachon tanlash kerak', body: 'Limfodrenaj ko‘pincha parvozdan keyin, og‘ir haftadan so‘ng yoki tana charchoq his qilganda tanlanadi.', bullets: ['Safardan keyin', 'Og‘irlik hissida', 'Intensiv haftadan keyin', 'Spa kuni tarkibida'] },
      ],
      facts: [
        { label: 'Davomiylik', value: '90 daqiqa' },
        { label: 'Narx', value: '1 350 000 UZS' },
        { label: 'Format', value: 'Yumshoq detoks massaji' },
      ],
      faq: [
        { question: 'Limfodrenaj massaji qancha davom etadi?', answer: 'Serenity Spa’da limfodrenaj detoks massaji 90 daqiqa davom etadi.' },
        { question: 'Bu og‘riqli muolajami?', answer: 'Yo‘q, texnika yumshoq va ritmik. Intensivlikni mutaxassis bilan kelishish mumkin.' },
        { question: 'Sauna bilan birlashtirish mumkinmi?', answer: 'Ha, ammo tartib va yuklamani administrator bilan aniqlash yaxshi.' },
      ],
      relatedLabel: 'Shuningdek ko‘riladi',
    },
  },
  'couples-spa-tashkent': {
    ru: {
      slug: 'couples-spa-tashkent',
      title: 'SPA для двоих в Ташкенте',
      metaTitle: 'SPA для двоих в Ташкенте — Serenity Spa',
      description: 'SPA для двоих в Serenity Spa: пакет 4 часа, бассейн, термальная зона, пилинг, парный массаж и чайная церемония.',
      eyebrow: 'Ритуал для пары',
      h1: 'SPA для двоих в Ташкенте для романтического отдыха и восстановления',
      lead: 'SPA для двоих в Serenity Spa — это готовый сценарий на 4 часа с бассейном, термальной зоной, пилингом, парным массажем, обёртыванием и чайной церемонией. Формат подходит для свидания, годовщины, подарка или спокойного совместного дня.',
      image: '/images/gallery/full/couples-treatment.webp',
      primaryCta: 'Записаться вдвоём',
      secondaryCta: 'SPA программы',
      sections: [
        { title: 'Что входит в пакет', body: 'Пакет для двоих объединяет несколько процедур в один спокойный сценарий без необходимости собирать программу вручную.', bullets: ['4 часа', 'Цена — 5 000 000 UZS', 'Парный массаж и уходы', 'Чайная церемония'] },
        { title: 'Когда выбирать', body: 'Формат выбирают для романтического вечера, дня рождения, годовщины, подарка или спокойного отдыха без поездки за город.', bullets: ['Свидание', 'Годовщина', 'Подарок', 'Совместное восстановление'] },
      ],
      facts: [
        { label: 'Длительность', value: '4 часа' },
        { label: 'Цена', value: '5 000 000 UZS' },
        { label: 'Формат', value: 'Для двух гостей' },
      ],
      faq: [
        { question: 'Сколько стоит SPA для двоих?', answer: 'Пакет для двоих в Serenity Spa стоит 5 000 000 UZS и длится около 4 часов.' },
        { question: 'Нужно ли приходить заранее?', answer: 'Лучше приехать немного заранее, чтобы спокойно пройти регистрацию и подготовиться к программе.' },
        { question: 'Можно ли подарить программу для двоих?', answer: 'Да, формат подходит для подарка. Детали оформления уточните у администратора.' },
      ],
      relatedLabel: 'Идеи для отдыха',
    },
    en: {
      slug: 'couples-spa-tashkent',
      title: 'Couples spa in Tashkent',
      metaTitle: 'Couples spa in Tashkent — Serenity Spa',
      description: 'Couples spa package at Serenity Spa: 4 hours with pool, thermal zone, peel, couples massage and tea ceremony.',
      eyebrow: 'Ritual for two',
      h1: 'Couples spa in Tashkent for romantic rest and recovery',
      lead: 'The couples spa at Serenity Spa is a 4.5-hour ready-made experience with pool, thermal zone, peel, couples massage, wrap and tea ceremony.',
      image: '/images/gallery/full/couples-treatment.webp',
      primaryCta: 'Book for two',
      secondaryCta: 'Spa packages',
      sections: [
        { title: 'What is included', body: 'The couples package combines several treatments into one calm scenario.', bullets: ['4 hours', 'Price — 5,000,000 UZS', 'Couples massage and treatments', 'Tea ceremony'] },
        { title: 'When to choose it', body: 'Choose it for a date, anniversary, birthday gift or a shared recovery day inside the city.', bullets: ['Date', 'Anniversary', 'Gift', 'Shared recovery'] },
      ],
      facts: [
        { label: 'Duration', value: '4 hours' },
        { label: 'Price', value: '5,000,000 UZS' },
        { label: 'Format', value: 'For two guests' },
      ],
      faq: [
        { question: 'How much is a couples spa package?', answer: 'The couples package costs 5,000,000 UZS and takes about 4 hours.' },
        { question: 'Should we arrive early?', answer: 'Arriving a little early is recommended for check-in and preparation.' },
        { question: 'Can I give it as a gift?', answer: 'Yes, it works well as a gift. Ask the administrator for available formats.' },
      ],
      relatedLabel: 'Rest ideas',
    },
    uz: {
      slug: 'couples-spa-tashkent',
      title: 'Toshkentda ikki kishi uchun spa',
      metaTitle: 'Toshkentda ikki kishi uchun spa — Serenity Spa',
      description: 'Serenity Spa’da ikki kishi uchun spa: 4 soat, basseyn, termal zona, piling, juftlik massaji va choy marosimi.',
      eyebrow: 'Juftlik rituali',
      h1: 'Toshkentda romantik dam olish va tiklanish uchun ikki kishi uchun spa',
      lead: 'Serenity Spa’dagi ikki kishi uchun spa 4 soatlik tayyor dastur: basseyn, termal zona, piling, juftlik massaji, o‘rash va choy marosimi.',
      image: '/images/gallery/full/couples-treatment.webp',
      primaryCta: 'Ikki kishi uchun yozilish',
      secondaryCta: 'Spa dasturlar',
      sections: [
        { title: 'Nimalar kiradi', body: 'Juftlik paketi bir nechta muolajalarni sokin tayyor ssenariyga birlashtiradi.', bullets: ['4 soat', 'Narx — 5 000 000 UZS', 'Juftlik massaji va parvarish', 'Choy marosimi'] },
        { title: 'Qachon tanlash kerak', body: 'Uchrashuv, yillik sana, sovg‘a yoki shahardan chiqmasdan birgalikda tiklanish kuni uchun mos.', bullets: ['Uchrashuv', 'Yillik sana', 'Sovg‘a', 'Birgalikda tiklanish'] },
      ],
      facts: [
        { label: 'Davomiylik', value: '4 soat' },
        { label: 'Narx', value: '5 000 000 UZS' },
        { label: 'Format', value: 'Ikki mehmon uchun' },
      ],
      faq: [
        { question: 'Ikki kishi uchun spa qancha turadi?', answer: 'Juftlik paketi 5 000 000 UZS turadi va taxminan 4 soat davom etadi.' },
        { question: 'Oldinroq kelish kerakmi?', answer: 'Ro‘yxatdan o‘tish va tayyorgarlik uchun biroz oldinroq kelish tavsiya etiladi.' },
        { question: 'Buni sovg‘a qilish mumkinmi?', answer: 'Ha, format sovg‘a uchun mos. Tafsilotlarni administratordan so‘rang.' },
      ],
      relatedLabel: 'Dam olish g‘oyalari',
    },
  },
  'gift-certificate-spa-tashkent': {
    ru: {
      slug: 'gift-certificate-spa-tashkent',
      title: 'Подарочный сертификат в SPA в Ташкенте',
      metaTitle: 'Подарочный сертификат в SPA в Ташкенте — Serenity Spa',
      description: 'Подарочный сертификат Serenity Spa в Ташкенте: массажи, SPA программы, бассейн и wellness-форматы для одного или двоих.',
      eyebrow: 'Подарок с заботой',
      h1: 'Подарочный сертификат в SPA в Ташкенте для отдыха и восстановления',
      lead: 'Подарочный сертификат Serenity Spa подходит для дня рождения, годовщины, корпоративного подарка или знака внимания. Можно выбрать массаж, SPA программу, посещение wellness-зоны или формат для двоих.',
      image: '/images/gallery/full/lounge-floral-table.webp',
      primaryCta: 'Уточнить сертификат',
      secondaryCta: 'SPA программы',
      sections: [
        { title: 'Что можно подарить', body: 'Сертификат можно оформить на конкретную услугу или подобрать формат по бюджету и сценарию подарка.', bullets: ['Массаж от 700 000 UZS', 'SPA программы от 1 800 000 UZS', 'Пакет для двоих', 'Wellness-посещение'] },
        { title: 'Кому подходит', body: 'Это спокойный универсальный подарок для близкого человека, пары, коллеги или гостя города.', bullets: ['День рождения', 'Годовщина', 'Корпоративный подарок', 'Благодарность'] },
      ],
      facts: [
        { label: 'Форматы', value: 'Услуга, пакет или сумма' },
        { label: 'Для кого', value: 'Один гость или двое' },
        { label: 'Запись', value: '+998 71 210 88 95' },
      ],
      faq: [
        { question: 'Можно ли купить сертификат в Serenity Spa?', answer: 'Да, администратор поможет подобрать услугу, пакет или сумму сертификата.' },
        { question: 'Какие услуги лучше дарить?', answer: 'Чаще выбирают балийский массаж, SPA пакет Serenity или программу для двоих.' },
        { question: 'Можно ли подарить сертификат паре?', answer: 'Да, для пары подходит SPA пакет для двоих или сертификат на выбранную сумму.' },
      ],
      relatedLabel: 'Подарочные идеи',
    },
    en: {
      slug: 'gift-certificate-spa-tashkent',
      title: 'Spa gift certificate in Tashkent',
      metaTitle: 'Spa gift certificate in Tashkent — Serenity Spa',
      description: 'Serenity Spa gift certificates in Tashkent: massages, spa packages, pool and wellness formats for one or two guests.',
      eyebrow: 'A caring gift',
      h1: 'Spa gift certificate in Tashkent for rest and recovery',
      lead: 'A Serenity Spa gift certificate works for birthdays, anniversaries, corporate gifts or a thoughtful gesture. Choose massage, spa package, wellness access or a couples format.',
      image: '/images/gallery/full/lounge-floral-table.webp',
      primaryCta: 'Ask about certificates',
      secondaryCta: 'Spa packages',
      sections: [
        { title: 'What to gift', body: 'The certificate can be set for a specific service or selected by budget and occasion.', bullets: ['Massage from 700,000 UZS', 'Spa packages from 1,800,000 UZS', 'Couples package', 'Wellness visit'] },
        { title: 'Who it suits', body: 'A calm universal gift for a loved one, couple, colleague or guest in Tashkent.', bullets: ['Birthday', 'Anniversary', 'Corporate gift', 'Thank you gift'] },
      ],
      facts: [
        { label: 'Formats', value: 'Service, package or amount' },
        { label: 'For whom', value: 'One or two guests' },
        { label: 'Booking', value: '+998 71 210 88 95' },
      ],
      faq: [
        { question: 'Can I buy a Serenity Spa gift certificate?', answer: 'Yes, the administrator can help choose a service, package or certificate amount.' },
        { question: 'Which services are best as gifts?', answer: 'Balinese massage, Signature Serenity package and couples spa are popular gift choices.' },
        { question: 'Can I gift a certificate to a couple?', answer: 'Yes, choose a couples package or a certificate for a selected amount.' },
      ],
      relatedLabel: 'Gift ideas',
    },
    uz: {
      slug: 'gift-certificate-spa-tashkent',
      title: 'Toshkentda spa sovg‘a sertifikati',
      metaTitle: 'Toshkentda spa sovg‘a sertifikati — Serenity Spa',
      description: 'Serenity Spa sovg‘a sertifikati: massajlar, spa dasturlar, basseyn va bir yoki ikki kishi uchun wellness formatlar.',
      eyebrow: 'G‘amxo‘rlik sovg‘asi',
      h1: 'Toshkentda dam olish va tiklanish uchun spa sovg‘a sertifikati',
      lead: 'Serenity Spa sovg‘a sertifikati tug‘ilgan kun, yillik sana, korporativ sovg‘a yoki e’tibor belgisi uchun mos. Massaj, spa dastur, wellness tashrif yoki juftlik formatini tanlash mumkin.',
      image: '/images/gallery/full/lounge-floral-table.webp',
      primaryCta: 'Sertifikatni aniqlash',
      secondaryCta: 'Spa dasturlar',
      sections: [
        { title: 'Nimani sovg‘a qilish mumkin', body: 'Sertifikatni aniq xizmatga yoki byudjet va vaziyatga qarab rasmiylashtirish mumkin.', bullets: ['Massaj 700 000 UZS dan', 'Spa dasturlar 1 800 000 UZS dan', 'Juftlik paketi', 'Wellness tashrif'] },
        { title: 'Kimlar uchun mos', body: 'Yaqin inson, juftlik, hamkasb yoki Toshkent mehmoni uchun sokin universal sovg‘a.', bullets: ['Tug‘ilgan kun', 'Yillik sana', 'Korporativ sovg‘a', 'Minnatdorchilik'] },
      ],
      facts: [
        { label: 'Formatlar', value: 'Xizmat, paket yoki summa' },
        { label: 'Kim uchun', value: 'Bir yoki ikki mehmon' },
        { label: 'Yozilish', value: '+998 71 210 88 95' },
      ],
      faq: [
        { question: 'Serenity Spa sertifikatini olish mumkinmi?', answer: 'Ha, administrator xizmat, paket yoki sertifikat summasini tanlashga yordam beradi.' },
        { question: 'Qaysi xizmatlar sovg‘a uchun yaxshi?', answer: 'Bali massaji, Signature Serenity paketi va juftlik spa mashhur variantlar.' },
        { question: 'Sertifikatni juftlikka sovg‘a qilish mumkinmi?', answer: 'Ha, juftlik paketi yoki tanlangan summaga sertifikat mos.' },
      ],
      relatedLabel: 'Sovg‘a g‘oyalari',
    },
  },
  'body-wrap-tashkent': {
    ru: {
      slug: 'body-wrap-tashkent',
      title: 'Обёртывания и уходы за телом в Ташкенте',
      metaTitle: 'Обёртывания и уходы за телом в Ташкенте — Serenity Spa',
      description: 'Обёртывания Serenity Spa в Ташкенте: лавандовое, шоколадное, авокадо и шёлк, детокс. 60 минут, от 850 000 UZS.',
      eyebrow: 'Уходы за телом',
      h1: 'Обёртывания и уходы за телом в Ташкенте для мягкого восстановления кожи',
      lead: 'Уходы за телом Serenity Spa помогают дополнить массаж или spa-день питанием, увлажнением и ощущением мягкости кожи. В меню есть лавандовое, шоколадное, авокадо и шёлк, а также детокс-обёртывание.',
      image: '/images/gallery/full/treatment-suite.webp',
      primaryCta: 'Записаться на уход',
      secondaryCta: 'Все услуги',
      sections: [
        { title: 'Варианты ухода', body: 'Каждое обёртывание длится 60 минут и подбирается по желаемому эффекту: расслабление, питание, увлажнение или детокс.', bullets: ['Лавандовое обёртывание', 'Шоколадное обёртывание', 'Авокадо и шёлк', 'Детокс обёртывание'] },
        { title: 'С чем сочетать', body: 'Уходы за телом хорошо работают вместе с пилингом, массажем и спокойным посещением термальной зоны.', bullets: ['После пилинга', 'Перед массажем', 'В составе spa-пакета', 'Для подарочного визита'] },
      ],
      facts: [
        { label: 'Длительность', value: '60 минут' },
        { label: 'Цена', value: '850 000 UZS' },
        { label: 'Выбор', value: '4 вида обёртываний' },
      ],
      faq: [
        { question: 'Какие обёртывания есть в Serenity Spa?', answer: 'Доступны лавандовое, шоколадное, авокадо и шёлк, а также детокс-обёртывание.' },
        { question: 'Сколько длится уход за телом?', answer: 'Каждое обёртывание длится 60 минут.' },
        { question: 'Можно ли совместить уход с массажем?', answer: 'Да, уходы за телом хорошо сочетаются с массажами и SPA программами.' },
      ],
      relatedLabel: 'Уходы и массажи',
    },
    en: {
      slug: 'body-wrap-tashkent',
      title: 'Body wraps and treatments in Tashkent',
      metaTitle: 'Body wraps and treatments in Tashkent — Serenity Spa',
      description: 'Body wraps at Serenity Spa in Tashkent: lavender, chocolate, avocado and silk, detox. 60 minutes from 850,000 UZS.',
      eyebrow: 'Body treatments',
      h1: 'Body wraps and treatments in Tashkent for soft skin recovery',
      lead: 'Serenity Spa body treatments add nourishment, hydration and softness to a massage or spa day. The menu includes lavender, chocolate, avocado and silk, and detox wraps.',
      image: '/images/gallery/full/treatment-suite.webp',
      primaryCta: 'Book body treatment',
      secondaryCta: 'All services',
      sections: [
        { title: 'Treatment options', body: 'Each body wrap takes 60 minutes and is selected by the desired effect: relaxation, nourishment, hydration or detox.', bullets: ['Lavender wrap', 'Chocolate wrap', 'Avocado and silk', 'Detox wrap'] },
        { title: 'What to combine it with', body: 'Body treatments pair well with peels, massage and calm thermal zone visits.', bullets: ['After peel', 'Before massage', 'Inside a spa package', 'For a gift visit'] },
      ],
      facts: [
        { label: 'Duration', value: '60 minutes' },
        { label: 'Price', value: '850,000 UZS' },
        { label: 'Choice', value: '4 wrap types' },
      ],
      faq: [
        { question: 'Which body wraps are available?', answer: 'Lavender, chocolate, avocado and silk, and detox wraps are available.' },
        { question: 'How long does a body treatment take?', answer: 'Each wrap takes 60 minutes.' },
        { question: 'Can I combine it with massage?', answer: 'Yes, body treatments pair well with massages and spa packages.' },
      ],
      relatedLabel: 'Treatments and massages',
    },
    uz: {
      slug: 'body-wrap-tashkent',
      title: 'Toshkentda tana o‘rash va parvarish',
      metaTitle: 'Toshkentda tana o‘rash va parvarish — Serenity Spa',
      description: 'Serenity Spa’da tana o‘rashlar: lavanda, shokolad, avokado va ipak, detoks. 60 daqiqa, 850 000 UZS dan.',
      eyebrow: 'Tana parvarishi',
      h1: 'Toshkentda terining yumshoq tiklanishi uchun tana o‘rash va parvarish',
      lead: 'Serenity Spa tana parvarishi massaj yoki spa kunini oziqlantirish, namlantirish va teri yumshoqligi bilan to‘ldiradi. Menyuda lavanda, shokolad, avokado va ipak, detoks o‘rashlar bor.',
      image: '/images/gallery/full/treatment-suite.webp',
      primaryCta: 'Parvarishga yozilish',
      secondaryCta: 'Barcha xizmatlar',
      sections: [
        { title: 'Parvarish turlari', body: 'Har bir o‘rash 60 daqiqa davom etadi va kerakli effektga qarab tanlanadi.', bullets: ['Lavanda o‘rash', 'Shokolad o‘rash', 'Avokado va ipak', 'Detoks o‘rash'] },
        { title: 'Nima bilan birlashtirish', body: 'Tana parvarishi piling, massaj va termal zona bilan yaxshi uyg‘unlashadi.', bullets: ['Pilingdan keyin', 'Massajdan oldin', 'Spa paketda', 'Sovg‘a tashrifi uchun'] },
      ],
      facts: [
        { label: 'Davomiylik', value: '60 daqiqa' },
        { label: 'Narx', value: '850 000 UZS' },
        { label: 'Tanlov', value: '4 xil o‘rash' },
      ],
      faq: [
        { question: 'Serenity Spa’da qanday o‘rashlar bor?', answer: 'Lavanda, shokolad, avokado va ipak, hamda detoks o‘rashlar mavjud.' },
        { question: 'Tana parvarishi qancha davom etadi?', answer: 'Har bir o‘rash 60 daqiqa davom etadi.' },
        { question: 'Massaj bilan birlashtirish mumkinmi?', answer: 'Ha, tana parvarishi massajlar va spa dasturlar bilan yaxshi uyg‘unlashadi.' },
      ],
      relatedLabel: 'Parvarish va massajlar',
    },
  },
  'pool-day-pass-tashkent': {
    ru: {
      slug: 'pool-day-pass-tashkent',
      title: 'Разовое посещение бассейна и SPA в Ташкенте',
      metaTitle: 'Разовое посещение бассейна и SPA в Ташкенте — Serenity Spa',
      description: 'Разовое посещение Serenity Spa в Ташкенте: бассейн, тренажёрный зал, сауны, джакузи, Wi‑Fi и детокс вода от 600 000 UZS.',
      eyebrow: 'Day pass',
      h1: 'Разовое посещение бассейна и SPA в Ташкенте на день восстановления',
      lead: 'Разовое посещение Serenity Spa подходит, если хочется провести несколько часов в wellness-зоне без абонемента. Формат включает бассейн, тренажёрный зал, паровую и финскую сауны, джакузи, Wi‑Fi и детокс воду.',
      image: '/images/gallery/full/pool-day-wide.webp',
      primaryCta: 'Уточнить посещение',
      secondaryCta: 'Абонементы',
      sections: [
        { title: 'Что входит', body: 'Гость получает доступ к основной wellness-инфраструктуре центра. В выходные стоимость отличается от будних дней.', bullets: ['Бассейн', 'Тренажёрный зал', 'Паровая и финская сауны', 'Джакузи'] },
        { title: 'Стоимость', body: 'Разовый визит удобен для знакомства с центром, восстановления после недели или спокойного отдыха в городе.', bullets: ['Будни — 600 000 UZS', 'Выходные — 700 000 UZS', 'Ежедневно 07:00–23:00', 'Можно перейти к абонементу'] },
      ],
      facts: [
        { label: 'Будни', value: '600 000 UZS' },
        { label: 'Выходные', value: '700 000 UZS' },
        { label: 'График', value: '07:00–23:00 ежедневно' },
      ],
      faq: [
        { question: 'Сколько стоит разовое посещение Serenity Spa?', answer: 'В будние дни разовое посещение стоит 600 000 UZS, в выходные — 700 000 UZS.' },
        { question: 'Что входит в разовое посещение?', answer: 'Бассейн, тренажёрный зал, паровая сауна, финская сауна, джакузи, Wi‑Fi и детокс вода.' },
        { question: 'Нужна ли предварительная запись?', answer: 'Лучше заранее уточнить доступное время по телефону или через форму сайта.' },
      ],
      relatedLabel: 'Также смотрят',
    },
    en: {
      slug: 'pool-day-pass-tashkent',
      title: 'Pool and spa day pass in Tashkent',
      metaTitle: 'Pool and spa day pass in Tashkent — Serenity Spa',
      description: 'Serenity Spa day pass in Tashkent: pool, fitness center, saunas, jacuzzi, Wi‑Fi and detox water from 600,000 UZS.',
      eyebrow: 'Day pass',
      h1: 'Pool and spa day pass in Tashkent for a recovery day',
      lead: 'A Serenity Spa day pass is for guests who want a few hours in the wellness zone without a membership. It includes the pool, fitness center, steam and Finnish saunas, jacuzzi, Wi‑Fi and detox water.',
      image: '/images/gallery/full/pool-day-wide.webp',
      primaryCta: 'Ask about day pass',
      secondaryCta: 'Memberships',
      sections: [
        { title: 'What is included', body: 'Guests access the main wellness infrastructure. Weekend pricing differs from weekdays.', bullets: ['Pool', 'Fitness center', 'Steam and Finnish saunas', 'Jacuzzi'] },
        { title: 'Price', body: 'A day pass is convenient for a first visit, weekly recovery or quiet city rest.', bullets: ['Weekdays — 600,000 UZS', 'Weekends — 700,000 UZS', 'Daily 07:00–23:00', 'Can upgrade to membership'] },
      ],
      facts: [
        { label: 'Weekdays', value: '600,000 UZS' },
        { label: 'Weekends', value: '700,000 UZS' },
        { label: 'Hours', value: 'Daily 07:00–23:00' },
      ],
      faq: [
        { question: 'How much is a Serenity Spa day pass?', answer: 'A weekday day pass costs 600,000 UZS. Weekend access costs 700,000 UZS.' },
        { question: 'What is included in a day pass?', answer: 'Pool, fitness center, steam sauna, Finnish sauna, jacuzzi, Wi‑Fi and detox water.' },
        { question: 'Do I need to book in advance?', answer: 'It is better to confirm available time by phone or through the website form.' },
      ],
      relatedLabel: 'Also viewed',
    },
    uz: {
      slug: 'pool-day-pass-tashkent',
      title: 'Toshkentda basseyn va spa bir martalik tashrif',
      metaTitle: 'Toshkentda basseyn va spa bir martalik tashrif — Serenity Spa',
      description: 'Serenity Spa bir martalik tashrif: basseyn, sport zali, saunalar, jakuzi, Wi‑Fi va detoks suv 600 000 UZS dan.',
      eyebrow: 'Bir kunlik tashrif',
      h1: 'Toshkentda tiklanish kuni uchun basseyn va spa bir martalik tashrif',
      lead: 'Serenity Spa bir martalik tashrifi abonementsiz wellness zonada bir necha soat dam olishni xohlaydiganlar uchun. Basseyn, sport zali, bug‘ va fin saunalari, jakuzi, Wi‑Fi va detoks suv kiradi.',
      image: '/images/gallery/full/pool-day-wide.webp',
      primaryCta: 'Tashrifni aniqlash',
      secondaryCta: 'Abonementlar',
      sections: [
        { title: 'Nimalar kiradi', body: 'Mehmon markazning asosiy wellness infratuzilmasidan foydalanadi. Dam olish kunlari narx ish kunlaridan farq qiladi.', bullets: ['Basseyn', 'Sport zali', 'Bug‘ va fin saunalari', 'Jakuzi'] },
        { title: 'Narx', body: 'Bir martalik tashrif markaz bilan tanishish, haftadan keyin tiklanish yoki shaharda sokin dam olish uchun qulay.', bullets: ['Ish kunlari — 600 000 UZS', 'Dam olish kunlari — 700 000 UZS', 'Har kuni 07:00–23:00', 'Keyin abonement tanlash mumkin'] },
      ],
      facts: [
        { label: 'Ish kunlari', value: '600 000 UZS' },
        { label: 'Dam olish', value: '700 000 UZS' },
        { label: 'Vaqt', value: 'Har kuni 07:00–23:00' },
      ],
      faq: [
        { question: 'Serenity Spa bir martalik tashrifi qancha turadi?', answer: 'Ish kunlari 600 000 UZS, dam olish kunlari 700 000 UZS.' },
        { question: 'Bir martalik tashrifga nimalar kiradi?', answer: 'Basseyn, sport zali, bug‘ saunasi, fin saunasi, jakuzi, Wi‑Fi va detoks suv.' },
        { question: 'Oldindan yozilish kerakmi?', answer: 'Bo‘sh vaqtni telefon yoki sayt formasi orqali oldindan aniqlash tavsiya etiladi.' },
      ],
      relatedLabel: 'Shuningdek ko‘riladi',
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
