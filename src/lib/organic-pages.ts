import { buildOrganicOffers } from './organic-metadata';
import { enrichOrganicPage } from './organic-enrichment';
import type { PriceRow } from './catalog';
import type { Locale } from '@/types/i18n';
import { BUSINESS_CONTACT, BUSINESS_ID, BUSINESS_NAME, CONTENT_UPDATED, SITE_URL } from '@/lib/seo';

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
  priceRows: PriceRow[];
  imageAlt: string;
  relatedSlugs: OrganicPageSlug[];
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

export const ORGANIC_PAGES: Record<OrganicPageSlug, Record<Locale, Omit<OrganicPageContent, 'priceRows' | 'imageAlt' | 'relatedSlugs'>>> = {
  'massage-tashkent': {
    ru: {
      slug: 'massage-tashkent',
      title: 'Массаж в Ташкенте',
      metaTitle: 'Массаж в Ташкенте — Serenity Spa',
      description: '',
      eyebrow: 'Меню из 12 техник',
      h1: '',
      lead: '',
      image: '/images/gallery/full/couples-treatment.webp',
      primaryCta: 'Записаться на массаж',
      secondaryCta: 'Смотреть все услуги',
      sections: [
        {
          title: 'Навигатор по массажному меню: от 30 до 120 минут',
          body: 'В карте процедур собраны двенадцать вариантов работы с телом под разный запас времени и мышечный тонус. Короткие получасовые сеансы снимают локальные зажимы воротниковой зоны после офисного дня, часовые и полуторачасовые ритуалы прорабатывают всё тело от стоп до плеч, а двухчасовые церемонии соединяют мануальную технику с глубоким прогревом базальтовыми камнями или сиамскими травяными мешочками.',
          bullets: [
            'Экспресс-формат 30 мин: голова и шея (700 000 сум), спина и плечи (800 000 сум)',
            'Классика 60–90 мин: традиционный балийский, гавайский Ка Хуна, рефлексология стоп',
            'Специализированные 90 мин: «Signature of Serenity», глубокое «Дыхание тела», детокс',
            'Ритуалы 120 мин: стоун-терапия горячими камнями и сиамские травяные мешочки',
          ],
        },
        {
          title: 'Как подобрать интенсивность и технику под задачу',
          body: 'Перед началом мастер уточняет желаемую силу нажатия, чувствительные участки и самочувствие гостя. Если нужна плавная сенсорная перезагрузка с ароматическими маслами, выбирают авторский уход или волнообразный гавайский стиль Ка Хуна. При плотном мышечном гипертонусе после силовых нагрузок эффективнее глубокий массаж «Дыхание тела» за 1 500 000 сум, а для вечернего расслабления ног — точечная рефлексология стоп.',
          bullets: [
            'Индивидуальная настройка давления от мягкого релакса до глубокой проработки фасций',
            'Приватные звукоизолированные кабинеты для одного гостя или синхронного визита вдвоём',
            'Обсуждение противопоказаний, беременности и чувствительности к маслам до старта',
            'Спокойный отдых с чаем в лаунже после завершения мануального сеанса',
          ],
        },
        {
          title: 'Подготовка к визиту и сочетание с другими уходами',
          body: 'Рекомендуем приехать за 10–15 минут до назначенного слота, чтобы без спешки переодеться в халат и настроиться на спокойный ритм. При бронировании нескольких процедур подряд — например, солевого скраба перед масляным массажем или парафинотерапии кистей «Нежность шёлка» — укажите это в заявке, чтобы администратор заложил комфортный интервал.',
          bullets: [
            'Запись на конкретный слот в интервале с 07:00 до 23:00 без выходных',
            'Возможность объединить массаж со скрабом или обёртыванием в один визит',
            'Консультация по выбору методики в Telegram, WhatsApp или по телефону',
            'Удобный заезд через главный вход отеля в деловом квартале Tashkent City',
          ],
        },
      ],
      facts: [
        { label: 'Локация', value: 'Укчи 1, Ташкент' },
        { label: 'Длительность', value: '30, 60, 90 и 120 минут' },
        { label: 'Выбор в меню', value: '12 массажных программ от 700 000 сум' },
      ],
      faq: [
        {
          question: 'Какой массаж выбрать при сильном напряжении в спине и шее?',
          answer: 'Для быстрой разгрузки воротниковой зоны подойдёт 30-минутный массаж спины, шеи и плеч (800 000 сум), а для глубокой проработки всех мышц — 90-минутная техника «Дыхание тела» (1 500 000 сум).',
        },
        {
          question: 'Чем отличаются двухчасовые массажи за 1 750 000 сум?',
          answer: 'Стоун-терапия использует гладкие разогретые камни для длительного прогрева глубоких мышц, а ритуал «Нежный соблазн» выполняется тёплыми льняными мешочками со сбором сиамских трав для мягкого аромавоздействия.',
        },
        {
          question: 'Можно ли согласовать силу нажатия и исключить отдельные зоны?',
          answer: 'Да, перед сеансом специалист уточняет комфортную плотность прикосновений, зоны акцента, аллергию на компоненты масел и медицинские ограничения; сильную боль во время процедуры терпеть не нужно.',
        },
      ],
      relatedLabel: 'Другие spa-направления',
    },
    en: {
      slug: 'massage-tashkent',
      title: 'Massage in Tashkent',
      metaTitle: 'Massage in Tashkent — Serenity Spa',
      description: '',
      eyebrow: '12 massage techniques',
      h1: '',
      lead: '',
      image: '/images/gallery/full/couples-treatment.webp',
      primaryCta: 'Book a massage',
      secondaryCta: 'View all services',
      sections: [
        {
          title: 'Navigating the 12-item massage menu: 30 to 120 minutes',
          body: 'Our treatment menu groups twelve manual therapies by duration and pressure profile so you can match the session to your schedule. Focused 30-minute appointments relieve desk-related neck and shoulder tightness, 60- and 90-minute full-body rituals restore circulation from feet to upper back, and two-hour ceremonies pair hands-on work with heated basalt stones or steamed Siamese herbal compresses.',
          bullets: [
            'Express 30 min options: Head & Neck (700,000 UZS) and Back, Neck & Shoulders (800,000 UZS)',
            'Full-body 60–90 min classics: Traditional Balinese, Hawaiian Ka Huna, Foot Reflexology',
            'Targeted 90 min sessions: Signature of Serenity, deep-tissue Body Breath, Detox drainage',
            'Extended 120 min ceremonies: Hot Stone Therapy and Siamese herbal compress massage',
          ],
        },
        {
          title: 'Matching pressure and technique to your goal',
          body: 'Before starting, your therapist checks preferred pressure, sensitive areas and general wellbeing. Guests seeking sensory calm with aromatic oils gravitate toward Signature of Serenity or the long rhythmic forearm strokes of Hawaiian Ka Huna. Athletes and frequent travellers needing firm myofascial release choose the 90-minute Body Breath massage at 1,500,000 UZS, while Foot Reflexology targets tired legs.',
          bullets: [
            'Custom pressure calibration from gentle aromatherapy flow to firm deep-muscle release',
            'Quiet private suites for solo appointments or simultaneous treatments for two',
            'Pre-session screening for pregnancy, recent injuries or oil sensitivities',
            'Unrushed post-treatment rest in the lounge before returning to the city',
          ],
        },
        {
          title: 'Preparing for your appointment and pairing treatments',
          body: 'Plan to arrive 10–15 minutes ahead of your confirmed time to change into a bathrobe and settle in without rushing. If you wish to pair manual bodywork with a body scrub, nourishing wrap or 45-minute Silk Tenderness paraffin hand care, mention all items in one enquiry so reception schedules seamless transitions between rooms.',
          bullets: [
            'Daily appointment slots from 07:00 to 23:00 including weekends',
            'Option to pair massage with an exfoliating peel or 60-minute body wrap',
            'Direct consultation via WhatsApp, Telegram or phone for international visitors',
            'Convenient arrival through the main hotel lobby in Tashkent City',
          ],
        },
      ],
      facts: [
        { label: 'Location', value: 'Ukchi 1, Tashkent' },
        { label: 'Durations', value: '30, 60, 90 and 120 minutes' },
        { label: 'Menu scope', value: '12 massage options from 700,000 UZS' },
      ],
      faq: [
        {
          question: 'Which massage is best for stiff shoulders and deep muscle tension?',
          answer: 'Choose the 30-minute Back, Neck & Shoulders session (800,000 UZS) for targeted upper-body relief, or the 90-minute Body Breath deep-muscle massage (1,500,000 UZS) for firm full-body recovery.',
        },
        {
          question: 'What is the difference between the two 120-minute massages?',
          answer: 'Hot Stone Therapy (1,750,000 UZS) uses smooth heated stones to retain warmth and ease tight muscles, whereas Tender Temptation uses warm linen pouches filled with Siamese herbs for aromatic skin and muscle care.',
        },
        {
          question: 'Can I customize pressure and ask the therapist to skip certain areas?',
          answer: 'Yes. Before every session you discuss pressure level, focus zones, oil preferences, pregnancy or medical precautions with your therapist so the massage stays comfortable throughout.',
        },
      ],
      relatedLabel: 'Related spa directions',
    },
    uz: {
      slug: 'massage-tashkent',
      title: 'Toshkentda massaj',
      metaTitle: 'Toshkentda massaj — Serenity Spa',
      description: '',
      eyebrow: '12 xil massaj menyusi',
      h1: '',
      lead: '',
      image: '/images/gallery/full/couples-treatment.webp',
      primaryCta: 'Massajga yozilish',
      secondaryCta: 'Xizmatlarni ko‘rish',
      sections: [
        {
          title: 'Massaj menyusi bo‘yicha yo‘riqnoma: 30 dan 120 daqiqagacha',
          body: 'Muolajalar xaritasida vaqt zahirasi va mushaklar holatiga qarab o‘n ikki xil texnika jamlangan. Qisqa 30 daqiqalik seanslar ofis ishidan keyin bo‘yin va yelka qotishini yengillashtiradi, 60 va 90 daqiqalik usullar butun tanada qon aylanishini jonlantiradi, ikki soatlik marosimlar esa qo‘l texnikasini issiq bazalt toshlari yoki Siam o‘simlik xaltachalari bilan boyitadi.',
          bullets: [
            '30 daqiqalik ekspress format: bosh va bo‘yin (700 000 so‘m), orqa va yelkalar (800 000 so‘m)',
            '60–90 daqiqalik klassika: an’anaviy Bali, Gavayi Ka Xuna va oyoq refleksologiyasi',
            '90 daqiqalik maxsus turlar: «Signature of Serenity», chuqur «Tana nafasi», detoks',
            '120 daqiqalik marosimlar: issiq tosh terapiyasi va Siam o‘simliklari bilan parvarish',
          ],
        },
        {
          title: 'Bosim kuchi va uslubni maqsadga qarab tanlash',
          body: 'Seans boshlanishidan avval mutaxassis sizga qulay bosim darajasini, e’tibor talab qiladigan nuqtalarni va umumiy holatni aniqlashtiradi. Xushbo‘y moylar bilan sokin dam olish uchun mualliflik massaji yoki to‘lqinli Gavayi Ka Xuna texnikasi tanlanadi. Sportdan keyingi kuchli mushak tarangligida 1 500 000 so‘mlik «Tana nafasi» chuqur massaji, oyoq charchog‘ida esa nuqtali refleksologiya samarali.',
          bullets: [
            'Yumshoq aromarelaksdan chuqur mushak ishlovigacha individual bosim sozlamasi',
            'Yakka tashrif yoki juftliklar uchun shovqindan himoyalangan alohida xonalar',
            'Homiladorlik, yaqindagi jarohatlar va moylarga sezgirlikni oldindan muhokama qilish',
            'Muolaja yakunida sokin dam olish hududida shoshilmasdan tiklanish',
          ],
        },
        {
          title: 'Tashrifga tayyorgarlik va qo‘shimcha parvarishlar bilan uyg‘unlik',
          body: 'Ro‘yxatdan o‘tish va xalatga kiyinish uchun belgilangan vaqtdan 10–15 daqiqa oldinroq kelish tavsiya etiladi. Agar bir tashrif davomida massajdan oldin tana pilingi yoki qo‘llar uchun 45 daqiqalik «Ipak nafisligi» parafin terapiyasini qo‘shmoqchi bo‘lsangiz, buni so‘rovda oldindan ko‘rsating — administrator xonalar va tanaffusni qulay rejalashtiradi.',
          bullets: [
            'Dam olish kunlarisiz har kuni soat 07:00 dan 23:00 gacha aniq vaqtga yozilish',
            'Massajni skrab yoki 60 daqiqalik tana o‘rashi bilan bitta tashrifga birlashtirish',
            'Telegram, WhatsApp yoki telefon orqali mos texnikani tanlash bo‘yicha maslahat',
            'Tashkent City markazidagi mehmonxona bosh lobbisi orqali qulay kirish',
          ],
        },
      ],
      facts: [
        { label: 'Manzil', value: 'Ukchi 1, Toshkent' },
        { label: 'Davomiylik', value: '30, 60, 90 va 120 daqiqa' },
        { label: 'Menyu tanlovi', value: '700 000 so‘mdan 12 xil massaj' },
      ],
      faq: [
        {
          question: 'Bel va yelka qotishida qaysi massajni tanlagan ma’qul?',
          answer: 'Yuqori qismdagi taranglikni tez yechish uchun 30 daqiqalik orqa, bo‘yin va yelka massaji (800 000 so‘m), chuqur mushak tiklanishi uchun esa 90 daqiqalik «Tana nafasi» (1 500 000 so‘m) tavsiya etiladi.',
        },
        {
          question: '1 750 000 so‘mlik ikki soatlik muolajalar bir-biridan nimasi bilan farq qiladi?',
          answer: 'Issiq tosh terapiyasida uzoq issiqlik saqlovchi silliq toshlar mushaklarni chuqur isitadi, «Mayin joziba» marosimida esa zig‘ir matoga o‘ralgan Siam o‘tlari terini yumshoq parvarishlaydi.',
        },
        {
          question: 'Seans oldidan bosim kuchini va alohida zonalarni kelishib olsa bo‘ladimi?',
          answer: 'Ha, ustaga qulay bosim darajasini, e’tibor qaratiladigan joylarni, homiladorlik yoki shifokor cheklovlarini oldindan aytishingiz mumkin; kuchli og‘riqqa chidash talab etilmaydi.',
        },
      ],
      relatedLabel: 'Boshqa spa yo‘nalishlari',
    },
  },
  'balinese-massage-tashkent': {
    ru: {
      slug: 'balinese-massage-tashkent',
      title: 'Балийский массаж в Ташкенте',
      metaTitle: 'Балийский массаж в Ташкенте — Serenity Spa',
      description: '',
      eyebrow: 'Индонезийская мануальная классика',
      h1: '',
      lead: '',
      image: '/images/gallery/full/treatment-suite.webp',
      primaryCta: 'Записаться на балийский массаж',
      secondaryCta: 'Все массажи',
      sections: [
        {
          title: 'Техника традиционного балийского ритуала',
          body: 'Индонезийская школа объединяет длинные скользящие поглаживания ладонями, глубокое разминание больших плечевых и спинных мышц, мягкую акупрессуру и деликатные пассивные растяжки. В отличие от жёсткого спортивного воздействия мастер переходит от поверхностного разогрева к глубоким слоям постепенно с тёплым маслом, помогая улучшить микроциркуляцию и выровнять дыхание.',
          bullets: [
            'Сочетание плавных масляных проходок, точечного нажима и мягкой растяжки',
            'Последовательная работа со спиной, воротниковой зоной, ногами, стопами и кистями',
            'Приглушённый свет, спокойный акустический фон и подогреваемая кушетка',
            'Физиологичный темп без резких рывков и болезненного скручивания суставов',
          ],
        },
        {
          title: 'Сравнение сеансов 60 минут и 90 минут',
          body: 'Часовой формат за 1 000 000 сум рассчитан на сбалансированную перезагрузку в будний день: специалист равномерно проходит основные мышечные линии и снимает накопившуюся скованность. Полуторачасовая версия за 1 300 000 сум даёт дополнительные полчаса для детальной проработки стоп, икроножных мышц, кистей и шейно-затылочной области, поэтому её чаще выбирают после перелётов и напряжённых недель.',
          bullets: [
            '60 минут (1 000 000 сум) — оптимальный базовый ритуал для знакомства со спа',
            '90 минут (1 300 000 сум) — расширенная проработка стоп, плеч и поясницы',
            'Оба хронометража доступны для индивидуального и парного бронирования',
            'Техника также включена в «Женский пакет» и программу «Serenity для двоих»',
          ],
        },
        {
          title: 'Кому рекомендован уход и что учесть до начала',
          body: 'Традиционный балийский массаж выбирают гости с сидячим графиком, прерывистым сном и ощущением общей усталости, когда классическое поглаживание кажется слишком лёгким, а силовой массаж — избыточным. До старта обязательно предупредите мастера о недавних травмах, варикозе, беременности или аллергии на эфирные композиции, чтобы адаптировать интенсивность.',
          bullets: [
            'Снятие эмоционального утомления и скованности после длительной работы за ноутбуком',
            'Комфортное восстановление после смены часовых поясов и долгих поездок',
            'Выбор нейтрального или ароматического масла по чувствительности кожи',
            'Рекомендация не планировать активную тренировку сразу после процедуры',
          ],
        },
      ],
      facts: [
        { label: 'Длительность', value: '60 или 90 минут' },
        { label: 'Цена', value: 'От 1 000 000 UZS' },
        { label: 'Адрес', value: 'Укчи 1, Ташкент' },
      ],
      faq: [
        {
          question: 'Что лучше выбрать — 60 или 90 минут балийского массажа?',
          answer: '60 минут (1 000 000 сум) достаточно для общего снятия усталости со всего тела, а 90 минут (1 300 000 сум) позволяют глубже проработать стопы, шею и хронически зажатые зоны спины.',
        },
        {
          question: 'Чем балийский массаж отличается от тайского и классического?',
          answer: 'В отличие от тайского массажа на мате в одежде, балийский выполняется на кушетке по тёплому маслу и сочетает глубокое разминание мышц с плавными скользящими линиями и мягкой акупрессурой.',
        },
        {
          question: 'В какие комплексные SPA-программы уже входит балийский массаж?',
          answer: 'Традиционный балийский массаж включён в 3-часовой «Женский пакет» (2 200 000 сум) и 4-часовую парную программу «Serenity для двоих» (5 000 000 сум за двух гостей).',
        },
      ],
      relatedLabel: 'Похожие массажи',
    },
    en: {
      slug: 'balinese-massage-tashkent',
      title: 'Balinese massage in Tashkent',
      metaTitle: 'Balinese massage in Tashkent — Serenity Spa',
      description: '',
      eyebrow: 'Indonesian full-body classic',
      h1: '',
      lead: '',
      image: '/images/gallery/full/treatment-suite.webp',
      primaryCta: 'Book Balinese massage',
      secondaryCta: 'All massages',
      sections: [
        {
          title: 'How Traditional Balinese bodywork works',
          body: 'Rooted in Indonesian wellness traditions, this full-body oil ritual blends long palm strokes, thumb acupressure, deep kneading across the back and shoulders, and gentle passive stretches. Rather than applying abrupt force right away, the therapist warms superficial tissues first and gradually reaches deeper muscle layers to boost circulation and quiet the nervous system.',
          bullets: [
            'Seamless combination of warm-oil effleurage, acupressure points and mild stretching',
            'Head-to-toe sequence covering back, neck, shoulders, legs, feet and hands',
            'Performed on a comfortable treatment bed in a softly lit private room',
            'Balanced medium-to-deep pressure without harsh joint twisting',
          ],
        },
        {
          title: 'Choosing between 60 minutes and 90 minutes',
          body: 'The 60-minute appointment at 1,000,000 UZS delivers a complete weekday reset across major muscle groups when your schedule is tight. Extending to 90 minutes at 1,300,000 UZS adds half an hour for unhurried attention to calves, foot arches, hands and suboccipital neck tension — making the longer session a favourite after long-haul flights into Tashkent.',
          bullets: [
            '60 minutes (1,000,000 UZS) — balanced full-body introduction to Serenity Spa',
            '90 minutes (1,300,000 UZS) — extended focus on feet, lower back and upper shoulders',
            'Available for solo guests or side-by-side in a couples suite by advance request',
            'Also featured inside the Women’s Package and Serenity Package for Two',
          ],
        },
        {
          title: 'Who benefits most and pre-session guidance',
          body: 'Guests with desk posture strain, fragmented sleep or travel fatigue choose Balinese massage when pure aromatherapy feels too light and sports bodywork feels overly intense. Let your therapist know beforehand about pregnancy, varicose veins, recent surgery or fragrance sensitivities so oil choice and pressure are tailored safely.',
          bullets: [
            'Ideal for mental decompression and muscular stiffness after long office days',
            'Restorative circulation support following flights and time-zone changes',
            'Choice of gentle pressure adjustments on sensitive areas at any moment',
            'Best scheduled after workouts or thermal warming rather than right before gym training',
          ],
        },
      ],
      facts: [
        { label: 'Duration', value: '60 or 90 minutes' },
        { label: 'Price', value: 'From 1,000,000 UZS' },
        { label: 'Address', value: 'Ukchi 1, Tashkent' },
      ],
      faq: [
        {
          question: 'Should I book 60 or 90 minutes for Balinese massage?',
          answer: 'Choose 60 minutes (1,000,000 UZS) for a classic full-body reset, or 90 minutes (1,300,000 UZS) if you want extra time on tight shoulders, lower back, calves and feet.',
        },
        {
          question: 'How does Balinese massage differ from Thai massage?',
          answer: 'Unlike clothed mat-based Thai stretching, Balinese massage is performed on a treatment table with warm oil, combining flowing palm strokes, deep muscle kneading and calm acupressure.',
        },
        {
          question: 'Which spa packages include Traditional Balinese massage?',
          answer: 'Traditional Balinese massage is included in the 3-hour Women’s Package (2,200,000 UZS) and the 4-hour Serenity Package for Two (5,000,000 UZS total for two guests).',
        },
      ],
      relatedLabel: 'Related massages',
    },
    uz: {
      slug: 'balinese-massage-tashkent',
      title: 'Toshkentda Bali massaji',
      metaTitle: 'Toshkentda Bali massaji — Serenity Spa',
      description: '',
      eyebrow: 'Indoneziya tana parvarishi klassikasi',
      h1: '',
      lead: '',
      image: '/images/gallery/full/treatment-suite.webp',
      primaryCta: 'Bali massajiga yozilish',
      secondaryCta: 'Barcha massajlar',
      sections: [
        {
          title: 'An’anaviy Bali massaji texnikasining xususiyatlari',
          body: 'Indoneziya maktabiga mansub ushbu marosim iliq moy yordamida bajariladigan uzun sirpanuvchi harakatlar, mushaklarni chuqur uqalash, nuqtali akupressura va ehtiyotkor cho‘zish usullarini birlashtiradi. Usta keskin bosim ishlatmasdan, to‘qimalarni bosqichma-bosqich qizdirib chuqur qatlamlarga o‘tadi, bu esa qon aylanishini yaxshilab, nafas ritmini tinchlantiradi.',
          bullets: [
            'Iliq moyli silliq harakatlar, nuqtali bosim va yumshoq cho‘zish uyg‘unligi',
            'Orqa, bo‘yin-yelka, oyoqlar, tovon va qo‘l panjalarini ketma-ket ishlash',
            'Yumshoq yoritilgan sokin xona va qulay massaj kushetkasi',
            'Bo‘g‘imlarni keskin buramasdan, o‘rtachadan chuqurgacha muvozanatli bosim',
          ],
        },
        {
          title: '60 va 90 daqiqalik seanslar o‘rtasidagi farq',
          body: '1 000 000 so‘mlik bir soatlik format ish kunida butun tanadagi umumiy charchoqni yechish uchun yetarli vaqtni qamrab oladi. 1 300 000 so‘mlik 90 daqiqalik variant esa qo‘shimcha yarim soat davomida tovonlar, boldir mushaklari, bel hamda gardan sohasiga batafsil e’tibor qaratish imkonini beradi va uzoq parvozlardan keyin ko‘proq tanlanadi.',
          bullets: [
            '60 daqiqa (1 000 000 so‘m) — tana mushaklarini tekis bo‘shashtiruvchi bazaviy format',
            '90 daqiqa (1 300 000 so‘m) — oyoq panjalari, bel va yelkalarni chuqurroq ishlash',
            'Yakka mehmonlar yoki oldindan yozilish bo‘yicha juftlik xonasi uchun mos',
            'Shuningdek «Ayollar paketi» hamda «Ikki kishilik Serenity» dasturiga kiritilgan',
          ],
        },
        {
          title: 'Kimlar uchun mos va muolajadan oldingi tavsiyalar',
          body: 'Kompyuter qarshisida uzoq o‘tirish, uyqu ritmining buzilishi yoki safar toliqishida Bali massaji yumshoq relaks va sezilarli mushak tiklanishi o‘rtasidagi oltin o‘rtalik hisoblanadi. Seansdan oldin homiladorlik, tomir kengayishi, yaqindagi jarrohlik amaliyoti yoki xushbo‘y moylarga sezgirlik haqida ustani xabardor qiling.',
          bullets: [
            'Aqliy zo‘riqish va yelka qotishini bir seansda kamaytirish imkoniyati',
            'Uzoq yo‘l va soat mintaqasi almashgandan keyin qulay tiklanish',
            'Teri sezgirligiga qarab bosim va moy tarkibini moslashtirish',
            'Muolajadan keyin faol sport mashg‘ulotini rejalashtirmaslik tavsiya etiladi',
          ],
        },
      ],
      facts: [
        { label: 'Davomiylik', value: '60 yoki 90 daqiqa' },
        { label: 'Narx', value: '1 000 000 UZS dan' },
        { label: 'Manzil', value: 'Ukchi 1, Toshkent' },
      ],
      faq: [
        {
          question: 'Bali massajida 60 daqiqa yaxshimi yoki 90 daqiqami?',
          answer: 'Umumiy charchoqni olish uchun 60 daqiqa (1 000 000 so‘m) qulay, yelka, bel va oyoq tovonlarini shoshilmasdan chuqur ishlash uchun esa 90 daqiqa (1 300 000 so‘m) afzal.',
        },
        {
          question: 'Bali massaji tay massajidan nimasi bilan farq qiladi?',
          answer: 'Tay massaji kiyimda mat ustida cho‘zishlarga tayansa, Bali massaji kushetkada iliq moy bilan bajarilib, chuqur uqalash va silliq sirpanuvchi harakatlarni uyg‘unlashtiradi.',
        },
        {
          question: 'Qaysi tayyor SPA-paketlar tarkibida Bali massaji bor?',
          answer: 'An’anaviy Bali massaji 3 soatlik «Ayollar paketi» (2 200 000 so‘m) hamda 4 soatlik «Ikki kishilik Serenity» dasturiga (ikki mehmon uchun 5 000 000 so‘m) kiradi.',
        },
      ],
      relatedLabel: 'O‘xshash massajlar',
    },
  },
  'lymphatic-drainage-massage-tashkent': {
    ru: {
      slug: 'lymphatic-drainage-massage-tashkent',
      title: 'Лимфодренажный массаж в Ташкенте',
      metaTitle: 'Лимфодренажный массаж в Ташкенте — Serenity Spa',
      description: '',
      eyebrow: 'Мягкий дренаж · 90 минут',
      h1: '',
      lead: '',
      image: '/images/gallery/full/treatment-room-tub.webp',
      primaryCta: 'Записаться на лимфодренаж',
      secondaryCta: 'Все услуги',
      sections: [
        {
          title: 'Принцип действия 90-минутного детокс-массажа',
          body: 'Лимфодренажная методика строится на медленных волнообразных и круговых прокачивающих движениях вдоль естественных линий лимфотока без жёсткого продавливания мышц. Хронометраж в 90 минут за 1 350 000 сум выбран не случайно: лимфатическая система реагирует только на плавный размеренный ритм, поэтому полутора часов хватает для бережной проработки ног, бёдер, живота, спины и рук без синяков и болевого стресса.',
          bullets: [
            'Фиксированная длительность 90 минут (1 350 000 сум) для полного цикла дренажа',
            'Мягкие ритмичные движения по направлению лимфатических коллекторов',
            'Деликатный режим без синяков, резких щипков и силового давления',
            'Заметное ощущение лёгкости в икрах и стопах сразу после завершения',
          ],
        },
        {
          title: 'После перелётов, жаркой погоды и сидячей нагрузки',
          body: 'Процедуру особенно ценят гости после многочасовых авиарейсов, длительных встреч на ногах или малоподвижной офисной недели, когда к вечеру появляется пастозность лодыжек и чувство скованности. Мягкая стимуляция оттока жидкости помогает уменьшить бытовую отёчность, освежить тонус кожи и плавно переключить нервную систему в режим глубокого отдыха.',
          bullets: [
            'Восстановление комфорта в ногах после перелётов и деловых командировок',
            'Уменьшение ощущения тяжести в жаркий сезон Ташкента',
            'Гармоничное сочетание с 60-минутным детокс-обёртыванием (850 000 сум)',
            'Рекомендация пить чистую воду до и после сеанса для поддержки водного баланса',
          ],
        },
        {
          title: 'Важные ограничения и согласование со специалистом',
          body: 'Поскольку техника активно влияет на движение жидкости в тканях, к противопоказаниям относятся острые воспалительные процессы, тромбофлебит, сердечно-сосудистая или почечная декомпенсация, температура и кожные повреждения. При беременности или хронических диагнозах предварительно проконсультируйтесь с врачом и обязательно сообщите об этом на ресепшене при записи.',
          bullets: [
            'Это уходовая wellness-процедура, не заменяющая врачебную физиотерапию',
            'Обязательный опрос о состоянии сосудов и хронических ограничениях до старта',
            'Щадящая температура и спокойный темп работы в индивидуальном кабинете',
            'Удобный запас времени после визита для неспешного отдыха',
          ],
        },
      ],
      facts: [
        { label: 'Длительность', value: '90 минут' },
        { label: 'Цена', value: '1 350 000 UZS' },
        { label: 'Техника', value: 'Ритмичный бессиловой дренаж всего тела' },
      ],
      faq: [
        {
          question: 'Остаются ли синяки или болезненность после лимфодренажного массажа?',
          answer: 'Нет. Правильный лимфодренаж в Serenity Spa выполняется мягкими ритмичными круговыми движениями без грубого разминания, поэтому процедура безболезненна и не оставляет гематом.',
        },
        {
          question: 'Почему сеанс длится именно 90 минут?',
          answer: 'Для естественного ускорения лимфотока требуется медленный последовательный проход всех зон от центра к периферии; 90 минут (1 350 000 сум) обеспечивают полноценный эффект без спешки.',
        },
        {
          question: 'С какой процедурой лучше сочетать лимфодренаж для ухода за кожей?',
          answer: 'Чаще всего его комбинируют с очищающим пилингом «Детокс» или 60-минутным детокс-обёртыванием (по 850 000 сум) — сообщите об этом при бронировании для расчёта общего времени.',
        },
      ],
      relatedLabel: 'Также смотрят',
    },
    en: {
      slug: 'lymphatic-drainage-massage-tashkent',
      title: 'Lymphatic drainage massage in Tashkent',
      metaTitle: 'Lymphatic drainage massage in Tashkent — Serenity Spa',
      description: '',
      eyebrow: 'Gentle detox · 90 minutes',
      h1: '',
      lead: '',
      image: '/images/gallery/full/treatment-room-tub.webp',
      primaryCta: 'Book lymphatic drainage',
      secondaryCta: 'All services',
      sections: [
        {
          title: 'How the 90-minute lymphatic detox technique works',
          body: 'Lymphatic drainage relies on slow, rhythmic circular and wave-like skin strokes aligned with natural lymph pathways rather than deep muscular compression. Priced at 1,350,000 UZS for a dedicated 90-minute session, the unhurried pace gives the lymphatic vessels time to respond gently across the legs, hips, abdomen, back and arms without bruising or discomfort.',
          bullets: [
            'Full 90-minute session (1,350,000 UZS) paced for physiological fluid movement',
            'Feather-to-light rhythmic pumping strokes along anatomical lymph channels',
            'Zero bruising, pinching or aggressive deep-tissue pressure',
            'Immediate sensation of lighter calves and ankles after standing up',
          ],
        },
        {
          title: 'Ideal after flights, warm weather and desk weeks',
          body: 'International travellers landing in Tashkent, conference guests spending long hours on their feet, and office professionals experiencing evening ankle puffiness choose this ritual to restore comfort. Gentle fluid mobilization eases everyday water retention, refreshes skin tone and guides the nervous system into restorative calm.',
          bullets: [
            'Popular post-flight recovery ritual to ease jet-lag heaviness in the legs',
            'Refreshing relief during hot summer months and sedentary work schedules',
            'Pairs naturally with the 60-minute Detox Wrap or Detox Peel (850,000 UZS each)',
            'Hydration with water or herbal tea before and after supports the result',
          ],
        },
        {
          title: 'Safety screening and contraindications to keep in mind',
          body: 'Because drainage bodywork stimulates fluid circulation, it should be avoided during acute infections, fever, active thrombosis, decompensated cardiac or kidney conditions, or over inflamed skin. Guests who are pregnant or managing a medical condition should check with their physician first and inform our team when booking.',
          bullets: [
            'Cosmetic wellness body care — not a substitute for clinical medical therapy',
            'Pre-treatment check of vascular health, recent surgery and skin sensitivity',
            'Calm, temperature-controlled private room on the 4th floor',
            'Flexible scheduling between 07:00 and 23:00 with advance confirmation',
          ],
        },
      ],
      facts: [
        { label: 'Duration', value: '90 minutes' },
        { label: 'Price', value: '1,350,000 UZS' },
        { label: 'Technique', value: 'Gentle rhythmic full-body drainage' },
      ],
      faq: [
        {
          question: 'Is lymphatic drainage massage painful or likely to leave bruises?',
          answer: 'No. Proper lymphatic drainage uses soft, rhythmic skin-level strokes rather than forceful kneading, making the 90-minute treatment completely comfortable and bruise-free.',
        },
        {
          question: 'Why is the lymphatic drainage session 90 minutes long?',
          answer: 'Lymph flow responds to slow, sequential stimulation across central and peripheral pathways; 90 minutes (1,350,000 UZS) allows complete whole-body coverage without rushing.',
        },
        {
          question: 'Which body treatment pairs best with lymphatic drainage?',
          answer: 'Guests frequently combine it with the Detox Peel or 60-minute Detox Wrap (850,000 UZS each) for smooth skin texture; request both together when booking.',
        },
      ],
      relatedLabel: 'Also viewed',
    },
    uz: {
      slug: 'lymphatic-drainage-massage-tashkent',
      title: 'Toshkentda limfodrenaj massaji',
      metaTitle: 'Toshkentda limfodrenaj massaji — Serenity Spa',
      description: '',
      eyebrow: 'Yumshoq drenaj · 90 daqiqa',
      h1: '',
      lead: '',
      image: '/images/gallery/full/treatment-room-tub.webp',
      primaryCta: 'Limfodrenajga yozilish',
      secondaryCta: 'Barcha xizmatlar',
      sections: [
        {
          title: '90 daqiqalik limfodrenaj texnikasi qanday ishlaydi',
          body: 'Limfodrenaj usuli mushaklarni kuch bilan ezishga emas, balki tabiiy limfa yo‘llari bo‘ylab sekin, ritmik va aylanma silash harakatlariga asoslanadi. 1 350 000 so‘mlik 90 daqiqalik davomiylik limfa tomirlarining ravon ishlashiga moslangan bo‘lib, oyoqlar, son, bel va qo‘llarni ko‘karishsiz hamda og‘riqsiz ketma-ket ishlash imkonini beradi.',
          bullets: [
            'To‘liq drenaj sikli uchun mo‘ljallangan 90 daqiqalik format (1 350 000 so‘m)',
            'Limfa oqimi yo‘nalishi bo‘yicha ehtiyotkor va maromli qo‘l harakatlari',
            'Ko‘karishlar va kuchli og‘riqli bosimsiz sokin parvarish',
            'Muolajadan so‘ng boldir va tovonlarda sezilarli yengillik hissi',
          ],
        },
        {
          title: 'Parvozlar, issiq ob-havo va kamharakat ish haftasidan keyin',
          body: 'Uzoq aviareyslardan so‘ng, tik oyoqda o‘tgan tadbirlar yoki ofisda uzoq o‘tirish natijasida kechga borib oyoqlarda shish va og‘irlik sezilganda ushbu marosim ayniqsa foydali. Suyuqlik almashinuvini yumshoq rag‘batlantirish teri tonusini tetiklashtiradi va asab tizimini chuqur dam olish holatiga o‘tkazadi.',
          bullets: [
            'Safar va parvozlardan keyin oyoqlardagi toliqishni kamaytirish',
            'Yozgi issiq kunlarda va kamharakat rejimda tana yengilligini tiklash',
            '60 daqiqalik detoks o‘rashi yoki detoks pilingi (850 000 so‘mdan) bilan uyg‘unlik',
            'Seansdan oldin va keyin toza suv ichish orqali suv balansini qo‘llash',
          ],
        },
        {
          title: 'Xavfsizlik qoidalari va mutaxassis bilan kelishish',
          body: 'Texnika to‘qimalardagi suyuqlik harakatiga ta’sir qilgani sababli o‘tkir yallig‘lanish, isitma, tromboflebit, yurak yoki buyrak yetishmovchiligi hamda teri shikastlanishlarida bajarilmaydi. Homiladorlik yoki surunkali xastaliklar mavjud bo‘lsa, avval shifokor bilan maslahatlashing va yozilish chog‘ida administratorni ogohlantiring.',
          bullets: [
            'Sog‘lomlashtiruvchi kosmetik spa-muolaja, tibbiy davolash o‘rnini bosmaydi',
            'Qon tomirlari holati va individual cheklovlarni boshlashdan oldin aniqlash',
            'Qulay haroratli sokin yakka xonada shoshilmasdan xizmat ko‘rsatish',
            'Har kuni soat 07:00 dan 23:00 gacha oldindan tasdiqlangan vaqtda qabul',
          ],
        },
      ],
      facts: [
        { label: 'Davomiylik', value: '90 daqiqa' },
        { label: 'Narx', value: '1 350 000 UZS' },
        { label: 'Texnika', value: 'Butun tana uchun yumshoq ritmik drenaj' },
      ],
      faq: [
        {
          question: 'Limfodrenaj massajidan keyin tanada ko‘karish qoladimi?',
          answer: 'Yo‘q, Serenity Spa’da limfodrenaj kuchli ezishsiz, teri bo‘ylab yumshoq va maromli aylanma harakatlar bilan bajariladi, shu sababli og‘riq va ko‘karish bo‘lmaydi.',
        },
        {
          question: 'Nima sababdan limfodrenaj seansi aynan 90 daqiqa davom etadi?',
          answer: 'Limfa tizimi faqat sekin va izchil ritmga javob beradi; 90 daqiqa (1 350 000 so‘m) butun tanani shoshilmasdan to‘liq ishlash uchun zarur.',
        },
        {
          question: 'Teri silliqligi uchun limfodrenajni nima bilan birlashtirish mumkin?',
          answer: 'Ko‘pincha u tozalovchi «Detoks» pilingi yoki 60 daqiqalik detoks o‘rashi (har biri 850 000 so‘m) bilan ketma-ket bron qilinadi.',
        },
      ],
      relatedLabel: 'Shuningdek ko‘riladi',
    },
  },
  'couples-spa-tashkent': {
    ru: {
      slug: 'couples-spa-tashkent',
      title: 'SPA для двоих в Ташкенте',
      metaTitle: 'SPA для двоих в Ташкенте — Serenity Spa',
      description: '',
      eyebrow: 'Парный ритуал · 4 часа',
      h1: '',
      lead: '',
      image: '/images/gallery/full/couples-treatment.webp',
      primaryCta: 'Записаться вдвоём',
      secondaryCta: 'SPA программы',
      sections: [
        {
          title: 'Шесть этапов программы «Serenity для двоих» за 5 000 000 сум',
          body: 'Фирменный парный пакет рассчитан на 4 часа непрерывного отдыха двух гостей и стоит 5 000 000 сум за двоих без доплат за аквазону. В отличие от разрозненного бронирования массажей программа выстроена как единое путешествие: от водного и термального разогрева до обновления кожи, синхронного массажа в парном сьюте, питательного обёртывания и финального чаепития.',
          bullets: [
            'Посещение бассейна',
            'Термальный комплекс',
            'Пилинг «Мята и соль»',
            'Традиционный балийский массаж',
          ],
        },
        {
          title: 'Альтернатива на 4,5 часа: «Авторский пакет Serenity» на двоих',
          body: 'Если пара хочет сделать акцент на аромаванне и лавандовой линии уходов, в меню предусмотрена парная версия «Авторского пакета Serenity» продолжительностью 4,5 часа за 5 500 000 сум на двух гостей. Она включает лавандовый пилинг, совместную аромаванну в приватном кабинете с круглой купелью, фирменный массаж Signature of Serenity, лавандовое обёртывание и чайную церемонию.',
          bullets: [
            'Serenity для двоих (4 ч, 5 000 000 сум) — с бассейном, парными и мятой-солью',
            'Авторский Serenity на двоих (4,5 ч, 5 500 000 сум) — с аромаванной и лавандой',
            'Синхронная работа двух мастеров в просторном парном кабинете',
            'Халаты, полотенца и тапочки подготовлены для обоих участников',
          ],
        },
        {
          title: 'Как организовать свидание, годовщину или сюрприз',
          body: 'Чтобы забронировать одновременно парный кабинет и двух терапевтов на удобный вечер или выходной день, оставляйте заявку заранее. Приезде за 15 минут до начала программы позволит спокойно пройти регистрацию, переодеться и обсудить индивидуальные пожелания по силе массажа и температуре для каждого из партнёров.',
          bullets: [
            'Готовый сценарий годовщины, дня рождения или романтического выходного в отеле',
            'Индивидуальная настройка силы нажатия для каждого гостя пары',
            'Нужно взять только купальные принадлежности для бассейна и джакузи',
            'Согласование точного тайминга через WhatsApp, Telegram или по телефону',
          ],
        },
      ],
      facts: [
        { label: 'Длительность', value: '4 часа (или 4,5 часа в пакете Signature)' },
        { label: 'Стоимость за двоих', value: '5 000 000 сум (всё включено по программе)' },
        { label: 'Адрес', value: 'Укчи 1, Ташкент' },
      ],
      faq: [
        {
          question: 'Указана ли цена 5 000 000 сум за одного человека или сразу за пару?',
          answer: '5 000 000 сум — это полная стоимость 4-часовой программы «Serenity для двоих» сразу за двух гостей, включая бассейн, термальный комплекс, пилинг, массаж, обёртывание и чай.',
        },
        {
          question: 'Проходят ли массажи и уходы одновременно в одной комнате?',
          answer: 'Да, при предварительном подтверждении парного слота два мастера работают синхронно в специальном кабинете на две кушетки.',
        },
        {
          question: 'Чем отличаются программы за 5 000 000 и 5 500 000 сум на двоих?',
          answer: 'Пакет за 5 000 000 сум (4 ч) включает бассейн, сауны, мятно-солевой пилинг, балийский массаж и обёртывание «Авокадо и шёлк», а пакет Signature за 5 500 000 сум (4,5 ч) — аромаванну и лавандовый ритуал.',
        },
      ],
      relatedLabel: 'Идеи для отдыха',
    },
    en: {
      slug: 'couples-spa-tashkent',
      title: 'Couples spa in Tashkent',
      metaTitle: 'Couples spa in Tashkent — Serenity Spa',
      description: '',
      eyebrow: 'Shared ritual · 4 hours',
      h1: '',
      lead: '',
      image: '/images/gallery/full/couples-treatment.webp',
      primaryCta: 'Book for two',
      secondaryCta: 'Spa packages',
      sections: [
        {
          title: 'Inside the 4-hour Serenity Package for Two (5,000,000 UZS)',
          body: 'Designed as an effortless four-hour retreat, the Serenity Package for Two is priced at 5,000,000 UZS total for two guests with wet-area access already built in. Instead of piecing together separate bookings, couples move smoothly from swimming and thermal warming to refreshing exfoliation, side-by-side massage, silky skin nourishment and a quiet tea ceremony.',
          bullets: [
            'Pool access',
            'Thermal complex',
            'Mint & Salt peel',
            'Traditional Balinese massage',
          ],
        },
        {
          title: 'Alternative 4.5-hour option: Signature Serenity for Two',
          body: 'Couples preferring a private aromatic bath and calming lavender botanicals can select the two-guest edition of the Signature Serenity Package: 4.5 hours at 5,500,000 UZS total for two. Hosted in our suite with a round soaking tub and twin massage beds, it pairs a Lavender Peel, aroma bath, Signature of Serenity massage, Lavender Wrap and tea ceremony.',
          bullets: [
            'Serenity for Two (4 h, 5,000,000 UZS) — pool, saunas, Mint & Salt and Balinese flow',
            'Signature Serenity for Two (4.5 h, 5,500,000 UZS) — private aroma bath and lavender care',
            'Two therapists working simultaneously in a dedicated couples room',
            'Bathrobes, towels and slippers prepared for both guests upon arrival',
          ],
        },
        {
          title: 'Planning an anniversary, date day or celebration',
          body: 'Because couples rituals require reserving both the twin suite and two therapists at the same hour, advance booking is essential — especially for Friday evenings and weekends. Arriving 15 minutes early gives both partners time to check in calmly and set individual massage pressure preferences.',
          bullets: [
            'Memorable city retreat for anniversaries, birthdays and honeymoon stays',
            'Independent pressure customization for each partner during massage',
            'Only swimwear is needed if your chosen program includes the pool',
            'Easy coordination via WhatsApp, Telegram or email before arrival',
          ],
        },
      ],
      facts: [
        { label: 'Duration', value: '4 hours (or 4.5 h Signature for Two)' },
        { label: 'Total for two', value: '5,000,000 UZS for two guests' },
        { label: 'Address', value: 'Ukchi 1, Tashkent' },
      ],
      faq: [
        {
          question: 'Is 5,000,000 UZS the total price for two guests or per person?',
          answer: '5,000,000 UZS is the complete price for two guests together for the 4-hour Serenity Package for Two, covering pool, thermal complex, peel, Balinese massage, wrap and tea.',
        },
        {
          question: 'Do both partners receive treatments side by side in the same room?',
          answer: 'Yes. Once your couples slot is confirmed, two therapists perform the treatments simultaneously in our dedicated twin-bed couples suite.',
        },
        {
          question: 'How does Serenity for Two differ from Signature Serenity for Two?',
          answer: 'Serenity for Two (4 h, 5,000,000 UZS) includes pool, thermal complex, Mint & Salt peel, Balinese massage and Avocado & Silk wrap, while Signature for Two (4.5 h, 5,500,000 UZS) features a private aroma bath and lavender rituals.',
        },
      ],
      relatedLabel: 'Rest ideas',
    },
    uz: {
      slug: 'couples-spa-tashkent',
      title: 'Toshkentda ikki kishi uchun spa',
      metaTitle: 'Toshkentda ikki kishi uchun spa — Serenity Spa',
      description: '',
      eyebrow: 'Juftlik marosimi · 4 soat',
      h1: '',
      lead: '',
      image: '/images/gallery/full/couples-treatment.webp',
      primaryCta: 'Ikki kishi uchun yozilish',
      secondaryCta: 'Spa dasturlar',
      sections: [
        {
          title: '5 000 000 so‘mlik «Ikki kishilik Serenity» dasturining olti bosqichi',
          body: 'Maxsus juftlik dasturi 4 soatga mo‘ljallangan bo‘lib, umumiy narxi ikki mehmon uchun 5 000 000 so‘mni tashkil etadi va basseynga kirish uchun alohida to‘lov talab qilmaydi. Dastur suzish va termal isinishdan boshlanib, tetiklantiruvchi piling, juftlik xonasida sinxron massaj, oziqlantiruvchi o‘rash hamda choy marosimi bilan yakunlanadi.',
          bullets: [
            'Basseyn',
            'Termal kompleks',
            'Yalpiz va tuz pilingi',
            'An’anaviy bali massaji',
          ],
        },
        {
          title: '4,5 soatlik muqobil tanlov: ikki kishi uchun «Mualliflik Serenity»',
          body: 'Agar juftlik dumaloq vannali alohida xonada xushbo‘y vanna va lavanda parvarishini afzal ko‘rsa, 4,5 soatlik «Mualliflik Serenity paketi»ning ikki kishilik talqini (5 500 000 so‘m) mavjud. U lavanda pilingi, aroma vanna, Signature of Serenity massaji, lavanda o‘rashi va choy marosimini o‘z ichiga oladi.',
          bullets: [
            'Ikki kishilik Serenity (4 soat, 5 000 000 so‘m) — basseyn, saunalar va Bali massaji bilan',
            'Ikki kishilik Mualliflik paketi (4,5 soat, 5 500 000 so‘m) — aroma vanna va lavanda bilan',
            'Ikki kushetkali maxsus xonada ikki ustaning bir vaqtda ishlashi',
            'Har ikki mehmon uchun xalat, sochiq va shippak oldindan tayyorlanadi',
          ],
        },
        {
          title: 'Yubiley, romantik uchrashuv yoki bayram kunini rejalashtirish',
          body: 'Juftlik dasturi bir vaqtning o‘zida ikki kishilik xona va ikki nafar mutaxassisni band qilishni talab etgani uchun ayniqsa dam olish kunlariga oldindan yozilish muhim. Belgilangan vaqtdan 15 daqiqa avval kelib, har bir ishtirokchi uchun qulay massaj bosimini alohida kelishib olish mumkin.',
          bullets: [
            'To‘y yilligi, tug‘ilgan kun yoki shahardan chiqmasdan sokin dam olish uchun tayyor format',
            'Juftlikdagi har bir mehmon uchun bosim kuchi individual moslashtiriladi',
            'Basseyn va jakuzi uchun faqat cho‘milish kiyimini olib kelish kifoya',
            'WhatsApp, Telegram yoki telefon orqali qulay sanani tez kelishish',
          ],
        },
      ],
      facts: [
        { label: 'Davomiylik', value: '4 soat (yoki 4,5 soatlik Signature)' },
        { label: 'Ikki kishi uchun', value: '5 000 000 so‘m (umumiy narx)' },
        { label: 'Manzil', value: 'Ukchi 1, Toshkent' },
      ],
      faq: [
        {
          question: '5 000 000 so‘m bir kishi uchunmi yoki ikki mehmon uchun umumiy narxmi?',
          answer: '5 000 000 so‘m — 4 soatlik «Ikki kishilik Serenity» dasturining ikki mehmon uchun to‘liq umumiy narxi bo‘lib, basseyn, termal zona, piling, massaj, o‘rash va choyni qamrab oladi.',
        },
        {
          question: 'Muolajalar ikki mehmon uchun bitta xonada bir vaqtda o‘tadimi?',
          answer: 'Ha, juftlik vaqti oldindan tasdiqlangach, ikki mutaxassis ikki kushetkali alohida juftlik xonasida sinxron ishlaydi.',
        },
        {
          question: '5 000 000 va 5 500 000 so‘mlik juftlik dasturlari nimasi bilan farqlanadi?',
          answer: '5 000 000 so‘mlik dastur (4 soat) basseyn, saunalar, yalpiz-tuz pilingi va Bali massajini, 5 500 000 so‘mlik Signature talqini (4,5 soat) esa xushbo‘y vanna va lavanda parvarishini o‘z ichiga oladi.',
        },
      ],
      relatedLabel: 'Dam olish g‘oyalari',
    },
  },
  'gift-certificate-spa-tashkent': {
    ru: {
      slug: 'gift-certificate-spa-tashkent',
      title: 'Подарочный сертификат в SPA в Ташкенте',
      metaTitle: 'Подарочный сертификат в SPA в Ташкенте — Serenity Spa',
      description: '',
      eyebrow: 'Подарок в Hilton Tashkent City',
      h1: '',
      lead: '',
      image: '/images/gallery/full/lounge-floral-table.webp',
      primaryCta: 'Уточнить сертификат',
      secondaryCta: 'SPA программы',
      sections: [
        {
          title: 'Какие процедуры и SPA-программы чаще выбирают в подарок',
          body: 'В качестве подарка в Serenity Spa выбирают как отдельные ритуалы ухода, так и многочасовые программы с чайной церемонией. В таблице выше собраны ориентиры из действующего прайса: от расслабляющего массажа головы и шеи до комплексных трёхчасовых пакетов для одного гостя и четырёхчасового парного путешествия. Конкретный состав подарка подбирается вместе с администратором до оплаты.',
          bullets: [
            'Индивидуальные массажи на 30, 60, 90 или 120 минут под ритм получателя',
            'Мужской пакет (3 ч, 1 800 000 сум) и Женский пакет (3 ч, 2 200 000 сум)',
            'Авторский пакет Serenity на 4,5 часа (3 000 000 сум для одного гостя)',
            'Парная программа «Serenity для двоих» на 4 часа (5 000 000 сум за пару)',
          ],
        },
        {
          title: 'Порядок оформления и важные условия перед покупкой',
          body: 'Актуальное наличие бланков, доступные номиналы, срок действия, правила переноса визита и формат передачи сертификата уточняются напрямую у администратора спа. Возможность электронного оформления, выбора свободной денежной суммы или дистанционной оплаты иностранной картой из-за рубежа не объявляется автоматически и требует предварительного подтверждения по официальным контактам.',
          bullets: [
            'Персональное согласование перечня услуг или формата сертификата до оплаты',
            'Проверка срока действия и правил перезаписи напрямую у ресепшена спа',
            'Уточнение возможности цифровой отправки или получения печатного бланка в отеле',
            'Официальные каналы связи: WhatsApp +998 94 940 10 35, Telegram @Serenity_Spa и телефон',
          ],
        },
        {
          title: 'Для каких поводов подходит визит в Serenity Spa',
          body: 'Сертификат в спа пятизвёздочного отеля уместен, когда хочется подарить не вещь, а спокойное время для себя без бытовой суеты. Получатель сам согласует удобную дату и час посещения с администратором, а на месте его уже ждут халат, полотенца, тапочки и внимательное сопровождение мастеров.',
          bullets: [
            'День рождения, юбилей родителей или знак благодарности близкому человеку',
            'Годовщина свадьбы и романтический сюрприз для супругов или пары',
            'Деловой и дипломатический подарок партнёрам или гостям Ташкента',
            'Гибкий выбор дня визита получателем по предварительной записи 07:00–23:00',
          ],
        },
      ],
      facts: [
        { label: 'Варианты подарка', value: 'Массажи и комплексные SPA-программы' },
        { label: 'Условия и номиналы', value: 'Уточняются у администратора до покупки' },
        { label: 'Локация', value: 'Укчи 1, Ташкент' },
      ],
      faq: [
        {
          question: 'Как узнать доступные номиналы и срок действия подарочного сертификата?',
          answer: 'Напишите в официальный WhatsApp +998 94 940 10 35, Telegram @Serenity_Spa или позвоните по номеру +998 71 210 88 95: администратор подтвердит актуальные условия, срок действия и правила переноса.',
        },
        {
          question: 'Можно ли купить сертификат дистанционно из другой страны или в электронном виде?',
          answer: 'Дистанционная оплата иностранными картами и электронная доставка требуют индивидуального подтверждения у администратора спа до оформления заказа.',
        },
        {
          question: 'Как получатель сертификата записывается на процедуру?',
          answer: 'Получатель связывается с ресепшеном Serenity Spa заранее, называет данные сертификата и выбирает свободный слот в интервале с 07:00 до 23:00.',
        },
      ],
      relatedLabel: 'Подарочные идеи',
    },
    en: {
      slug: 'gift-certificate-spa-tashkent',
      title: 'Spa gift certificate in Tashkent',
      metaTitle: 'Spa gift certificate in Tashkent — Serenity Spa',
      description: '',
      eyebrow: 'Thoughtful gift at Hilton',
      h1: '',
      lead: '',
      image: '/images/gallery/full/lounge-floral-table.webp',
      primaryCta: 'Ask about certificates',
      secondaryCta: 'Spa packages',
      sections: [
        {
          title: 'Popular treatments and spa programs chosen as gifts',
          body: 'Guests arranging a gift at Serenity Spa typically select either a signature massage or an all-in-one multi-hour spa package with a tea ceremony. The price table above shows current menu benchmarks — from a 30-minute head and neck session to three-hour solo rituals and our four-hour couples retreat — so you can compare service budgets before contacting reception.',
          bullets: [
            'Individual 30, 60, 90 or 120-minute massages tailored to the recipient’s preference',
            'Men’s Package (3 hours, 1,800,000 UZS) and Women’s Package (3 hours, 2,200,000 UZS)',
            'Signature Serenity Package for one guest (4.5 hours, 3,000,000 UZS)',
            'Serenity Package for Two (4 hours, 5,000,000 UZS total for a couple)',
          ],
        },
        {
          title: 'How to arrange a certificate and confirm terms first',
          body: 'Certificate availability, eligible denominations, validity window, rescheduling policy and handover format are confirmed directly with the spa administrator prior to payment. Electronic delivery, open monetary amounts and remote payment with international cards from abroad are not assumed automatically and must be verified individually through official spa channels.',
          bullets: [
            'Confirm eligible services, validity period and rescheduling rules before paying',
            'Verify whether printed pickup at Hilton or digital delivery is currently offered',
            'Check payment options directly if ordering from outside Uzbekistan',
            'Official enquiries via WhatsApp +998 94 940 10 35, Telegram @Serenity_Spa or email',
          ],
        },
        {
          title: 'Occasions suited to a five-star hotel spa experience',
          body: 'Gifting time in a calm 4th-floor hotel sanctuary works equally well for family celebrations and corporate appreciation in Tashkent. Once the certificate is arranged, the recipient books a convenient date and hour directly with reception, with bathrobes, towels and slippers ready on arrival.',
          bullets: [
            'Birthdays, family milestones and thoughtful thank-you gestures',
            'Wedding anniversaries and shared relaxation for couples',
            'Executive, diplomatic and corporate hospitality gifts in Tashkent',
            'Recipient chooses a confirmed appointment slot daily between 07:00 and 23:00',
          ],
        },
      ],
      facts: [
        { label: 'Gift options', value: 'Massages and multi-hour spa packages' },
        { label: 'Terms & amounts', value: 'Confirmed with reception before purchase' },
        { label: 'Location', value: 'Ukchi 1, Tashkent' },
      ],
      faq: [
        {
          question: 'How do I check gift certificate denominations and validity rules?',
          answer: 'Contact reception via WhatsApp +998 94 940 10 35, Telegram @Serenity_Spa or +998 71 210 88 95 to confirm current certificate availability, eligible services, validity period and rescheduling terms.',
        },
        {
          question: 'Can I order an electronic spa voucher or pay from abroad?',
          answer: 'Electronic voucher delivery and remote international card payments are not guaranteed automatically; ask the spa administrator to confirm available purchase methods before ordering.',
        },
        {
          question: 'How does the gift recipient redeem their visit?',
          answer: 'The recipient contacts Serenity Spa in advance to book a preferred date and time between 07:00 and 23:00 and receives confirmation from the administrator before arriving.',
        },
      ],
      relatedLabel: 'Gift ideas',
    },
    uz: {
      slug: 'gift-certificate-spa-tashkent',
      title: 'Toshkentda spa sovg‘a sertifikati',
      metaTitle: 'Toshkentda spa sovg‘a sertifikati — Serenity Spa',
      description: '',
      eyebrow: 'Hilton’dagi e’tiborli sovg‘a',
      h1: '',
      lead: '',
      image: '/images/gallery/full/lounge-floral-table.webp',
      primaryCta: 'Sertifikatni aniqlash',
      secondaryCta: 'Spa dasturlar',
      sections: [
        {
          title: 'Sovg‘a uchun eng ko‘p tanlanadigan muolaja va spa-dasturlar',
          body: 'Serenity Spa’da yaqinlar uchun alohida mualliflik massajlari ham, choy marosimini o‘z ichiga olgan ko‘p soatlik tayyor dasturlar ham sovg‘a sifatida tanlanadi. Yuqoridagi jadvalda amaldagi menyu narxlari misol tariqasida keltirilgan: 30 daqiqalik bosh-bo‘yin massajidan tortib bir kishilik 3 soatlik paketlar va juftliklar uchun 4 soatlik dam olish dasturigacha.',
          bullets: [
            'Qabul qiluvchining xohishiga mos 30, 60, 90 yoki 120 daqiqalik massajlar',
            'Erkaklar paketi (3 soat, 1 800 000 so‘m) va Ayollar paketi (3 soat, 2 200 000 so‘m)',
            'Bir mehmon uchun Mualliflik Serenity dasturi (4,5 soat, 3 000 000 so‘m)',
            'Ikki kishi uchun 4 soatlik «Serenity» juftlik paketi (5 000 000 so‘m)',
          ],
        },
        {
          title: 'Rasmiylashtirish tartibi va xarid oldidan aniqlashtiriladigan shartlar',
          body: 'Sertifikat blankalarining mavjudligi, mumkin bo‘lgan summalar, amal qilish muddati, yozilishni boshqa kunga ko‘chirish qoidalari hamda topshirish usuli to‘lovdan oldin bevosita spa administratoridan aniqlanadi. Elektron sertifikat yuborish, erkin nominal tanlash yoki chet eldan xorijiy karta orqali masofaviy to‘lash imkoniyati alohida tasdiqlanishi lozim.',
          bullets: [
            'To‘lovdan avval mos xizmatlar ro‘yxati va amal qilish muddatini kelishish',
            'Mehmonxonadan bosma shaklda olish yoki elektron format mavjudligini tekshirish',
            'O‘zbekistondan tashqaridan buyurtma berishda to‘lov usulini oldindan aniqlash',
            'Rasmiy aloqa: WhatsApp +998 94 940 10 35, Telegram @Serenity_Spa va telefon',
          ],
        },
        {
          title: 'Qanday sanalar va sovg‘a holatlari uchun mos keladi',
          body: 'Besh yulduzli mehmonxonaning sokin 4-qavatidagi hordiq — tug‘ilgan kun, to‘y yilligi yoki korporativ minnatdorchilik uchun esda qolarli tuhfadir. Sertifikat egasi o‘ziga qulay kun va soatni administrator bilan kelishib keladi, joyida esa xalat, sochiq va shippak tayyor bo‘ladi.',
          bullets: [
            'Tug‘ilgan kun, ota-onalar yubileyi va yaqin insonlarga g‘amxo‘rlik ramzi',
            'Turmush qurganlik yilligi va juftliklar uchun romantik dam olish',
            'Biznes hamkorlar hamda Toshkent mehmonlari uchun nufuzli korporativ sovg‘a',
            'Soat 07:00 dan 23:00 gacha oldindan yozilish asosida qulay kunni tanlash',
          ],
        },
      ],
      facts: [
        { label: 'Sovg‘a tanlovi', value: 'Massajlar va kompleks spa-dasturlar' },
        { label: 'Shartlar va nominal', value: 'Xariddan oldin administratordan aniqlanadi' },
        { label: 'Manzil', value: 'Ukchi 1, Toshkent' },
      ],
      faq: [
        {
          question: 'Sovg‘a sertifikatining summalari va amal qilish muddatini qanday bilsa bo‘ladi?',
          answer: 'WhatsApp +998 94 940 10 35, Telegram @Serenity_Spa yoki +998 71 210 88 95 raqamiga murojaat qiling: administrator mavjud formatlar, amal qilish muddati va ko‘chirish shartlarini tasdiqlaydi.',
        },
        {
          question: 'Sertifikatni elektron ko‘rinishda yoki chet eldan masofadan xarid qilish mumkinmi?',
          answer: 'Elektron yetkazib berish va xorijiy kartalar orqali masofaviy to‘lov avtomatik va’da qilinmaydi — buyurtmadan avval bu imkoniyatni administratordan alohida aniqlang.',
        },
        {
          question: 'Sertifikat olgan mehmon muolajaga qanday yoziladi?',
          answer: 'Mehmon Serenity Spa qabulxonasi bilan oldindan bog‘lanib, o‘ziga qulay sana va soatni (07:00–23:00 oralig‘ida) tasdiqlatib tashrif buyuradi.',
        },
      ],
      relatedLabel: 'Sovg‘a g‘oyalari',
    },
  },
  'body-wrap-tashkent': {
    ru: {
      slug: 'body-wrap-tashkent',
      title: 'Обёртывания и уходы за телом в Ташкенте',
      metaTitle: 'Обёртывания и уходы за телом в Ташкенте — Serenity Spa',
      description: '',
      eyebrow: 'Уходы за кожей · 60 минут',
      h1: '',
      lead: '',
      image: '/images/gallery/full/treatment-suite.webp',
      primaryCta: 'Записаться на уход',
      secondaryCta: 'Все услуги',
      sections: [
        {
          title: 'Четыре 60-минутных обёртывания в меню Serenity Spa',
          body: 'Каждое обёртывание в меню рассчитано на полные 60 минут и стоит 850 000 сум. Во время сеанса специалист равномерно наносит тёплый ухаживающий состав, укутывает тело для мягкого термоэффекта и оставляет гостя в тишине приглушённого кабинета, чтобы кожа спокойно впитала увлажняющие и питательные компоненты после сухого городского воздуха.',
          bullets: [
            'Лавандовое обёртывание (60 мин, 850 000 сум) — успокаивающий вечерний аромауход',
            'Шоколадное обёртывание (60 мин, 850 000 сум) — питание и бархатистость с нотами какао',
            '«Авокадо и шёлк» (60 мин, 850 000 сум) — глубокое смягчение сухой и стянутой кожи',
            'Детокс обёртывание (60 мин, 850 000 сум) — свежесть, тонус и ощущение лёгкости',
          ],
        },
        {
          title: 'Сочетание с пилингами тела и парафинотерапией рук',
          body: 'Чтобы активный состав работал ровнее, перед обёртыванием часто бронируют скрабирующий пилинг за 850 000 сум: в карте уходов доступны лавандовый, шоколадный, «Мята и соль» и «Детокс» пилинги. Дополнительно визит можно расширить 45-минутной парафинотерапией кистей «Нежность шёлка» (650 000 сум), которая устраняет сухость кожи рук.',
          bullets: [
            '4 пилинга в меню по 850 000 сум: лавандовый, «Мята и соль», шоколадный и детокс',
            'Уход за руками «Нежность шёлка» (45 мин, 650 000 сум) с тёплым косметическим парафином',
            'Готовые связки пилинга и обёртывания внутри пакетов Signature и Serenity для двоих',
            'Индивидуальная проверка чувствительности кожи к компонентам перед нанесением',
          ],
        },
        {
          title: 'Рекомендации по комфорту и ограничения для кожи',
          body: 'Обёртывание не требует специальной подготовки, однако процедуру не проводят сразу после агрессивного загара, недавней эпиляции, на ссадинах или при обострении дерматологических реакций. Заранее сообщите мастеру об аллергии на какао, эфирное масло лаванды или морскую соль, чтобы подобрать деликатную формулу.',
          bullets: [
            'Не рекомендуется делать эпиляцию непосредственно в день солевого скраба и ухода',
            'Душ, одноразовые принадлежности, халат и полотенца предусмотрены в кабинете',
            'Мягкий температурный режим без экстремального перегрева тела',
            'Отличное завершение после балийского или лимфодренажного массажа',
          ],
        },
      ],
      facts: [
        { label: 'Длительность обёртывания', value: '60 минут (подтверждено по меню)' },
        { label: 'Цена', value: '850 000 UZS' },
        { label: 'Локация', value: 'Укчи 1, Ташкент' },
      ],
      faq: [
        {
          question: 'Какое обёртывание лучше выбрать при сухости кожи?',
          answer: 'Для питания и устранения сухости чаще выбирают «Авокадо и шёлк» или шоколадное обёртывание (60 минут, 850 000 сум); лавандовое подойдёт для вечернего релакса, а детокс — для тонуса.',
        },
        {
          question: 'Чем отличаются обёртывания и пилинги в меню уходов за телом?',
          answer: 'Пилинг (850 000 сум) бережно отшелушивает и обновляет поверхность кожи, а 60-минутное обёртывание (850 000 сум) насыщает подготовленную кожу увлажняющим составом под тёплым укутыванием.',
        },
        {
          question: 'Есть ли в кабинете душ, чтобы смыть состав после процедуры?',
          answer: 'Да, все этапы очищения проходят в комфортных условиях спа-зоны с предоставлением мягких полотенец, халата и тапочек.',
        },
      ],
      relatedLabel: 'Уходы и массажи',
    },
    en: {
      slug: 'body-wrap-tashkent',
      title: 'Body wraps and treatments in Tashkent',
      metaTitle: 'Body wraps and treatments in Tashkent — Serenity Spa',
      description: '',
      eyebrow: 'Skin nourishment · 60 minutes',
      h1: '',
      lead: '',
      image: '/images/gallery/full/treatment-suite.webp',
      primaryCta: 'Book body treatment',
      secondaryCta: 'All services',
      sections: [
        {
          title: 'Four 60-minute body wraps at 850,000 UZS each',
          body: 'Every body wrap on the Serenity Spa menu runs for a confirmed 60 minutes at 850,000 UZS. Your therapist applies a warm botanical or nourishing mask evenly across the body, cocoons you comfortably to encourage gentle absorption, and lets you rest in a quiet, softly lit suite to counter Tashkent’s dry continental climate.',
          bullets: [
            'Lavender Wrap (60 min, 850,000 UZS) — calming floral aroma for evening unwinding',
            'Chocolate Wrap (60 min, 850,000 UZS) — rich cocoa comfort for velvety skin texture',
            'Avocado & Silk (60 min, 850,000 UZS) — deep hydration for dry or tight skin',
            'Detox Wrap (60 min, 850,000 UZS) — refreshing tone and lightness ritual',
          ],
        },
        {
          title: 'Pairing wraps with body peels and Silk Tenderness hand care',
          body: 'Exfoliating first helps nourishing wraps absorb far more evenly. Our body-care menu offers four scrubs at 850,000 UZS each — Lavender Peel, Mint & Salt Peel, Chocolate Peel and Detox Peel — plus the 45-minute Silk Tenderness warm paraffin hand treatment (650,000 UZS) to restore dry hands.',
          bullets: [
            '4 body peels at 850,000 UZS: Lavender, Mint & Salt, Chocolate and Detox',
            'Silk Tenderness paraffin hand therapy (45 min, 650,000 UZS) for smooth hands',
            'Bundled peel-and-wrap sequences available inside Signature and Couples packages',
            'Ingredient check before application for guests with sensitive or reactive skin',
          ],
        },
        {
          title: 'Skin comfort tips before your appointment',
          body: 'No special preparation is required, though wraps and salt scrubs should not be applied over sunburned, freshly shaved or irritated skin. Let your therapist know beforehand if you have sensitivities to cocoa, lavender essential oil or sea salt so we select the gentlest option for your skin.',
          bullets: [
            'Avoid waxing or shaving immediately before booking a salt peel or wrap',
            'Shower access, plush towels, bathrobe and slippers provided on site',
            'Gentle cocooning warmth without uncomfortable overheating',
            'Pairs seamlessly before or after a 60- or 90-minute full-body massage',
          ],
        },
      ],
      facts: [
        { label: 'Wrap duration', value: '60 minutes (confirmed menu time)' },
        { label: 'Price', value: '850,000 UZS' },
        { label: 'Location', value: 'Ukchi 1, Tashkent' },
      ],
      faq: [
        {
          question: 'Which body wrap is best for dry skin in Tashkent’s climate?',
          answer: 'Avocado & Silk and Chocolate Wrap (60 minutes, 850,000 UZS each) focus on rich hydration and softness, while Lavender Wrap emphasizes calm relaxation and Detox Wrap focuses on freshness.',
        },
        {
          question: 'What is the difference between the body peels and body wraps?',
          answer: 'Body peels (850,000 UZS) exfoliate and polish surface skin cells, whereas 60-minute body wraps (850,000 UZS) cocoon the body in a nourishing mask for deep moisture.',
        },
        {
          question: 'Can I book a peel and a wrap back to back in one visit?',
          answer: 'Yes. Mention both treatments when submitting your enquiry so reception reserves consecutive room time and confirms the full appointment window.',
        },
      ],
      relatedLabel: 'Treatments and massages',
    },
    uz: {
      slug: 'body-wrap-tashkent',
      title: 'Toshkentda tana o‘rash va parvarish',
      metaTitle: 'Toshkentda tana o‘rash va parvarish — Serenity Spa',
      description: '',
      eyebrow: 'Teri parvarishi · 60 daqiqa',
      h1: '',
      lead: '',
      image: '/images/gallery/full/treatment-suite.webp',
      primaryCta: 'Parvarishga yozilish',
      secondaryCta: 'Barcha xizmatlar',
      sections: [
        {
          title: 'Menyudagi 850 000 so‘mlik to‘rt xil 60 daqiqalik tana o‘rashi',
          body: 'Serenity Spa menyusidagi har bir o‘rash muolajasi tasdiqlangan 60 daqiqa davom etadi va 850 000 so‘m turadi. Mutaxassis tanaga iliq parvarishlovchi tarkibni tekis surtib, yumshoq issiqlik effekti uchun o‘rab qo‘yadi: sokin xonadagi dam olish chog‘ida quruq shahar havosidan charchagan teri namlovchi va oziqlantiruvchi moddalarni chuqur singdiradi.',
          bullets: [
            'Lavanda o‘rashi (60 daq, 850 000 so‘m) — kechki xotirjamlik uchun tinchlantiruvchi ifor',
            'Shokolad o‘rashi (60 daq, 850 000 so‘m) — kakao ifori va baxmaldek yumshoqlik',
            '«Avokado va ipak» (60 daq, 850 000 so‘m) — quruq terini chuqur namlash va mayinlashtirish',
            'Detoks o‘rashi (60 daq, 850 000 so‘m) — tetiklik va yengillik hissini beruvchi parvarish',
          ],
        },
        {
          title: 'Tana pilinglari va qo‘l parafin terapiyasi bilan uyg‘unlashtirish',
          body: 'O‘rash tarkibi teriga yanada bir tekis singishi uchun undan avval 850 000 so‘mlik tana pilingini tanlash qulay: menyuda lavanda, «Yalpiz va tuz», shokolad va «Detoks» pilinglari mavjud. Shuningdek, qo‘l terisi quruqligini ketkazish uchun 45 daqiqalik «Ipak nafisligi» iliq parafin terapiyasini (650 000 so‘m) qo‘shish mumkin.',
          bullets: [
            '850 000 so‘mdan 4 xil piling: lavanda, yalpiz va tuz, shokolad hamda detoks',
            'Qo‘llar uchun «Ipak nafisligi» parafin terapiyasi (45 daq, 650 000 so‘m)',
            'Signature va Ikki kishilik paketlar ichida piling hamda o‘rashning tayyor uyg‘unligi',
            'Sezgir teri uchun muolaja oldidan tarkibni individual kelishib olish',
          ],
        },
        {
          title: 'Muolajadan oldingi tavsiyalar va teri xavfsizligi',
          body: 'Maxsus tayyorgarlik talab etilmaydi, biroq kuchli quyoshda kuygan, yangi epilyatsiya qilingan yoki shikastlangan teriga skrab va o‘rash qo‘llanilmaydi. Agar kakao, lavanda efir moyi yoki dengiz tuziga allergiyangiz bo‘lsa, ustani oldindan ogohlantiring.',
          bullets: [
            'Tuzli piling va o‘rash kunida epilyatsiya qilmaslik tavsiya etiladi',
            'Dush, yumshoq sochiqlar, xalat va bir martalik jihozlar xonada muhayyo',
            'Haddan tashqari qizdirib yubormaydigan yoqimli iliq harorat',
            'Bali yoki limfodrenaj massajidan keyin ajoyib yakunlovchi bosqich',
          ],
        },
      ],
      facts: [
        { label: 'O‘rash davomiyligi', value: '60 daqiqa (menyu bo‘yicha)' },
        { label: 'Narx', value: '850 000 UZS' },
        { label: 'Manzil', value: 'Ukchi 1, Toshkent' },
      ],
      faq: [
        {
          question: 'Quruq teri uchun qaysi o‘rash turini tanlagan ma’qul?',
          answer: 'Quruq terini oziqlantirish va yumshatish uchun «Avokado va ipak» yoki shokolad o‘rashi (60 daqiqa, 850 000 so‘m), sokin uyqu oldi hordiq uchun esa lavanda o‘rashi mos keladi.',
        },
        {
          question: 'Tana pilingi va o‘rash muolajasi o‘rtasida qanday farq bor?',
          answer: 'Piling (850 000 so‘m) teri sirtini mayin tozalab yangilaydi, 60 daqiqalik o‘rash (850 000 so‘m) esa iliq o‘rama ostida terini namlovchi va oziqlantiruvchi tarkib bilan to‘yintiradi.',
        },
        {
          question: 'Bir tashrifda ham piling, ham o‘rashga yozilish mumkinmi?',
          answer: 'Ha, so‘rov qoldirayotganda ikkala muolajani birga ko‘rsating — administrator ketma-ket vaqtni hisoblab tasdiqlaydi.',
        },
      ],
      relatedLabel: 'Parvarish va massajlar',
    },
  },

  'pool-day-pass-tashkent': {
    ru: {
      slug: 'pool-day-pass-tashkent',
      title: 'Дневной доступ в бассейн и SPA в Ташкенте',
      metaTitle: 'Дневной доступ в бассейн в Ташкенте — Serenity Spa',
      description: '',
      eyebrow: 'Разовый тариф · Без контракта',
      h1: '',
      lead: '',
      image: '/images/gallery/full/pool-day-wide.webp',
      primaryCta: 'Забронировать день',
      secondaryCta: 'Клубные карты',
      sections: [
        {
          title: 'Тарифы разового билета в будни и выходные дни',
          body: 'Разовый гостевой пропуск даёт жителям города и командированным специалистам доступ ко всей велнес-инфраструктуре без покупки годового контракта и проживания в номере. В рабочие дни с понедельника по пятницу входной билет стоит 600 000 сум, а в субботу, воскресенье и праздничные даты — 700 000 сум на одного взрослого посетителя.',
          bullets: [
            'Будний тариф (Пн–Пт): 600 000 сум за дневной пропуск одного взрослого',
            'Выходной тариф (Сб–Вс): 700 000 сум со всеми зонами отдыха и залом',
            'Для постояльцев номеров отеля посещение включено в проживание бесплатно',
            'Расчёт на стойке регистрации картами Uzcard, Humo, Visa или Mastercard',
          ],
        },
        {
          title: 'Что входит в гостевой пропуск и как проходит регистрация',
          body: 'На ресепшене администратор сверяет подтверждённую бронь, выдаёт ключ от индивидуального шкафчика в раздевалке, махровый халат, комплект полотенец и тапочки. В стоимость билета включены тренажёрный зал с силовыми и кардиолиниями, плавательная зона, горячие кабины, охлаждённая детокс-вода и беспроводной интернет Wi-Fi.',
          bullets: [
            'Персональный шкафчик, душевые принадлежности, халат, тапочки и полотенца',
            'Свободная тренировка в фитнес-зале до отдыха у воды',
            'Питьевая детокс-вода и скоростной Wi-Fi в зоне отдыха',
            'С собой достаточно принести купальный костюм и чистую спортивную форму',
          ],
        },
        {
          title: 'Когда выгоднее перейти с разовых визитов на карту 12 посещений',
          body: 'Разовый билет удобен для первого знакомства с клубом, разовой перезагрузки после деловых переговоров или редких выходных. Если вы планируете приходить чаще двух раз в месяц, обратите внимание на блок из 12 визитов за 4 500 000 сум: себестоимость одного прохода снижается до 375 000 сум.',
          bullets: [
            '1–3 прихода в квартал — оптимален разовый билет за 600 000 или 700 000 сум',
            'Карта на 12 визитов (4 500 000 сум) снижает цену одного дня до 375 000 сум',
            'Месячный абонемент «Стандарт» (4 900 000 сум) выгоден при графике от 3 раз в неделю',
            'Любой уход за лицом, телом или массаж добавляется к визиту по отдельному прайсу',
          ],
        },
      ],
      facts: [
        { label: 'Будни / выходные', value: '600 000 / 700 000 сум' },
        { label: 'Часы работы', value: 'Ежедневно 07:00–23:00' },
        { label: 'Адрес', value: 'Укчи 1, Ташкент' },
      ],
      faq: [
        {
          question: 'Нужно ли жить в отеле, чтобы купить разовый дневной пропуск?',
          answer: 'Нет, внешние гости из города могут оформить разовый билет за 600 000 сум в будни или 700 000 сум в выходные, предварительно согласовав время прихода с ресепшеном.',
        },
        {
          question: 'Включён ли фитнес-зал в стоимость дневного посещения?',
          answer: 'Да, гостевой билет открывает единый доступ к тренажёрному залу, плавательной чаше, джакузи и банным кабинам, а также включает детокс-воду и Wi-Fi.',
        },
        {
          question: 'С какого количества визитов выгоднее взять пакет на 12 посещений?',
          answer: 'Пакет на 12 визитов за 4 500 000 сум окупается уже с седьмого–восьмого прихода, уменьшая стоимость каждого посещения с 600 000–700 000 до 375 000 сум.',
        },
      ],
      relatedLabel: 'Связанные форматы',
    },
    en: {
      slug: 'pool-day-pass-tashkent',
      title: 'Pool & wellness day pass in Tashkent',
      metaTitle: 'Pool day pass in Tashkent — Serenity Spa',
      description: '',
      eyebrow: 'Single-entry ticket · No contract',
      h1: '',
      lead: '',
      image: '/images/gallery/full/pool-day-wide.webp',
      primaryCta: 'Reserve day pass',
      secondaryCta: 'Memberships',
      sections: [
        {
          title: 'Weekday vs weekend single-entry ticket pricing',
          body: 'A single-day guest ticket lets Tashkent residents, expats and visiting executives use the entire wellness floor without signing an annual club contract or booking a hotel bedroom. Standard single admission is 600,000 UZS Monday through Friday and 700,000 UZS on Saturdays, Sundays and public holidays per adult.',
          bullets: [
            'Weekday rate (Mon–Fri): 600,000 UZS per adult single-day admission',
            'Weekend rate (Sat–Sun): 700,000 UZS covering full gym and wet-area facilities',
            'Complimentary entry for registered overnight room guests of the hotel',
            'Card settlement at reception via Visa, Mastercard, Uzcard or Humo',
          ],
        },
        {
          title: 'Check-in desk routine and amenities included in your ticket',
          body: 'Upon arrival at reception, our team verifies your confirmed slot and hands over a personal changing-room locker key, plush bathrobe, fresh towels and slippers. Beyond swimming and heat cabins, the same pass unlocks the fitness studio with cardio and strength machines, chilled detox water and guest Wi-Fi.',
          bullets: [
            'Private locker, shower amenities, bathrobe, towels and non-slip slippers',
            'Full workout access to cardio treadmills and resistance equipment',
            'Complimentary infused detox water and reliable Wi-Fi in the lounge',
            'Pack only clean gym shoes for training and swimwear for the wet zone',
          ],
        },
        {
          title: 'Comparing single tickets against the 12-visit bundle',
          body: 'Pay-as-you-go admission suits first-time visitors testing the club, travellers with a long layover between flights, or occasional Sunday breaks. Once you visit more than twice a month, upgrading to the 12-visit card at 4,500,000 UZS lowers the effective per-entry cost to 375,000 UZS.',
          bullets: [
            '1–3 visits per quarter: single tickets at 600,000 or 700,000 UZS stay flexible',
            '12-visit pass (4,500,000 UZS) cuts the per-visit rate down to 375,000 UZS',
            '1-month Standard plan (4,900,000 UZS) rewards 3+ weekly training sessions',
            'Massages and body scrubs can be added onto your ticket from the à-la-carte menu',
          ],
        },
      ],
      facts: [
        { label: 'Weekday / weekend', value: '600,000 / 700,000 UZS' },
        { label: 'Opening hours', value: 'Daily 07:00–23:00' },
        { label: 'Address', value: 'Ukchi 1, Tashkent' },
      ],
      faq: [
        {
          question: 'Can non-hotel visitors purchase a single-day pass?',
          answer: 'Yes. Outside city guests can book single-entry admission at 600,000 UZS on weekdays or 700,000 UZS on weekends without staying overnight, subject to advance time confirmation.',
        },
        {
          question: 'Does the day ticket include the fitness gym as well?',
          answer: 'Yes, one ticket covers the fitness center, swimming lane, hydromassage tub and thermal cabins together with locker service, detox water and Wi-Fi.',
        },
        {
          question: 'When does the 12-visit card become cheaper than single tickets?',
          answer: 'At 4,500,000 UZS (375,000 UZS per entry), the 12-visit bundle pays for itself after seven or eight visits compared with paying 600,000–700,000 UZS each time.',
        },
      ],
      relatedLabel: 'Related options',
    },
    uz: {
      slug: 'pool-day-pass-tashkent',
      title: 'Toshkentda kunlik basseyn va spa kirish chiptasi',
      metaTitle: 'Toshkentda kunlik basseyn chiptasi — Serenity Spa',
      description: '',
      eyebrow: 'Bir martalik tarif · Shartnomasiz',
      h1: '',
      lead: '',
      image: '/images/gallery/full/pool-day-wide.webp',
      primaryCta: 'Kunlik tashrifga yozilish',
      secondaryCta: 'Klub kartalari',
      sections: [
        {
          title: 'Ish kunlari va dam olish kunlaridagi bir martalik tariflar',
          body: 'Bir martalik mehmon chiptasi shahar aholisi va xizmat safaridagi mutaxassislarga uzoq muddatli klub shartnomasisiz hamda mehmonxonada yashamasdan wellness qavatidan foydalanish huquqini beradi. Dushanbadan jumagacha kirish narxi bir katta yoshli mehmon uchun 600 000 so‘m, shanba va yakshanba kunlari esa 700 000 so‘mni tashkil etadi.',
          bullets: [
            'Ish kunlari tarifi (Du–Ju): bir nafar mehmon uchun 600 000 so‘m',
            'Dam olish kunlari (Sha–Ya): barcha zonalar va sport zali bilan 700 000 so‘m',
            'Mehmonxona xonalarida istiqomat qiluvchilar uchun kirish bepul',
            'Qabulxonada Uzcard, Humo, Visa va Mastercard orqali qulay hisob-kitob',
          ],
        },
        {
          title: 'Ro‘yxatdan o‘tish tartibi va chipta ichidagi qulayliklar',
          body: 'Qabulxonada administrator tasdiqlangan bandlovni tekshirib, kiyinish xonasidagi shaxsiy shkafcha kaliti, yumshoq xalat, sochiqlar to‘plami va shippakni topshiradi. Chipta bahosiga kardio hamda kuch trenajyorlari o‘rnatilgan fitnes zali, suzish va isinish hududlari, salqin detoks-suv hamda Wi-Fi tarmog‘i kiritilgan.',
          bullets: [
            'Shaxsiy shkafcha, dush vositalari, xalat, sochiq va shippaklar',
            'Suzishdan avval trenajyor zalida to‘liq mashg‘ulot o‘tkazish imkoniyati',
            'Dam olish burchagida bepul detoks-suv va tezkor Wi-Fi internet',
            'O‘zingiz bilan faqat sport oyoq kiyimi va cho‘milish kiyimini oling',
          ],
        },
        {
          title: 'Bir martalik chipta yoki 12 tashriflik paket: qaysi biri foydali',
          body: 'Bir martalik kirish klub muhiti bilan ilk tanishuv, uchrashuvlar orasidagi tanaffus yoki kamdan-kam dam olish kunlari uchun mo‘ljallangan. Agar oyiga ikki-uch martadan ko‘p kelishni rejalashtirsangiz, 4 500 000 so‘mlik 12 tashrif kartasi har bir kirish narxini 375 000 so‘mgacha tushiradi.',
          bullets: [
            'Chorakda 1–3 marta kelganda 600 000 yoki 700 000 so‘mlik chipta qulay',
            '12 tashriflik karta (4 500 000 so‘m) bitta kirishni 375 000 so‘mga tenglashtiradi',
            'Haftasiga 3+ mashg‘ulot uchun 1 oylik «Standart» tarifi (4 900 000 so‘m) mos',
            'Qo‘shimcha massaj yoki tana parvarishi alohida menyu narxida qo‘shiladi',
          ],
        },
      ],
      facts: [
        { label: 'Ish / dam olish kuni', value: '600 000 / 700 000 so‘m' },
        { label: 'Ish tartibi', value: 'Har kuni 07:00–23:00' },
        { label: 'Manzil', value: 'Ukchi 1, Toshkent' },
      ],
      faq: [
        {
          question: 'Bir martalik kirish chiptasini mehmonxonada yashamasdan olish mumkinmi?',
          answer: 'Ha, shahar mehmonlari oldindan vaqtni kelishgan holda ish kunlari 600 000 so‘m, dam olish kunlari esa 700 000 so‘m evaziga bir martalik tashrifni rasmiylashtiradi.',
        },
        {
          question: 'Kunlik chipta narxiga trenajyor zali ham kiradimi?',
          answer: 'Ha, bitta chipta sport zali, suzish havzasi, jakuzi va bug‘ xonalaridan foydalanish, shuningdek shkafcha, detoks-suv va Wi-Fi xizmatlarini qamrab oladi.',
        },
        {
          question: 'Necha tashrifdan keyin 12 martalik paket arzonroqqa tushadi?',
          answer: '4 500 000 so‘mlik 12 tashrif kartasida bitta kirish 375 000 so‘mga aylanadi va 7–8-tashrifdanoq alohida chiptalarga nisbatan sezilarli tejash beradi.',
        },
      ],
      relatedLabel: 'Yaqin xizmatlar',
    },
  },
  'spa-with-pool-tashkent': {
    ru: {
      slug: 'spa-with-pool-tashkent',
      title: 'SPA с панорамным бассейном в Ташкенте',
      metaTitle: 'SPA с бассейном в Ташкенте — Serenity Spa',
      description: '',
      eyebrow: '27 метров · Вода 28°C · Панорама',
      h1: '',
      lead: '',
      image: '/hero-pool.webp',
      primaryCta: 'Записаться в аквазону',
      secondaryCta: 'Посмотреть пакеты',
      sections: [
        {
          title: 'Геометрия 27-метровой чаши и панорамное остекление в пол',
          body: 'Главная архитектурная доминанта водного зала — прямая 27-метровая крытая чаша со стабильной температурой воды 28°C в любой сезон года. Сплошной стеклянный фасад наполняет пространство естественным дневным светом утром, а после заката отражает мягкую контурную подсветку воды и огни современного квартала Tashkent City.',
          bullets: [
            'Полноценная длина 27 метров для размеренных утренних заплывов кролем или брассом',
            'Всесезонный подогрев воды до комфортных 28°C зимой и летом',
            'Витражные окна в пол с ощущением простора и тишины над городом',
            'Мягкие шезлонги вдоль борта для чтения и спокойного отдыха у воды',
          ],
        },
        {
          title: 'Гидромассажное джакузи 38°C для разгрузки поясницы и ног',
          body: 'Рядом с основной плавательной линией расположена тёплая купель джакузи, прогретая до 38°C. Направленные воздушно-водные форсунки мягко массируют икроножные мышцы, плечевой пояс и спину после заплыва или длительной прогулки, плавно переключая нервную систему из рабочего тонуса в глубокий покой.',
          bullets: [
            'Контраст температур: освежающие 28°C для плавания и расслабляющие 38°C в купели',
            'Гидромассажные струи для снятия мышечной скованности после перелёта',
            'Спокойная камерная акустика без уличного шума и суеты аквапарков',
            'Тёплые полотенца и уютные лежаки в нескольких шагах от воды',
          ],
        },
        {
          title: 'Как соединить плавание с вечерним массажем на 4-м этаже',
          body: 'Опытные гости строят визит в два такта: сначала 40–50 минут свободного плавания и прогрева в гидромассажной ванне, а затем переход в уединённый кабинет на балийский массаж или стоун-терапию. Разогретые в воде мышцы эластичнее откликаются на проработку мастера, делая послевкусие отдыха намного глубже.',
          bullets: [
            'Утренние часы с 07:00 идеальны для бодрящих тренировочных заплывов',
            'Вечерние слоты до 23:00 — атмосфера приглушённого света и водных бликов',
            'Удобная связка с 60- или 90-минутным массажем в соседнем крыле спа',
            'В пакетах «Мужской», «Женский» и «Для двоих» водная зона уже включена',
          ],
        },
      ],
      facts: [
        { label: 'Длина и вода', value: '27 м (28°C) и джакузи 38°C' },
        { label: 'Старт', value: '600 000 сум' },
        { label: 'Локация', value: 'Укчи 1, Ташкент' },
      ],
      faq: [
        {
          question: 'Какая длина крытого бассейна и температура воды в чаше?',
          answer: 'Длина крытой плавательной дорожки составляет 27 метров при постоянной температуре воды 28°C круглый год, а соседнее гидромассажное джакузи поддерживает 38°C.',
        },
        {
          question: 'Подходит ли бассейн для полноценного спортивного плавания?',
          answer: 'Да, прямая 27-метровая геометрия чаши и температура 28°C позволяют комфортно плыть длинные отрезки без перегрева, особенно в спокойные утренние часы с 07:00.',
        },
        {
          question: 'В каких SPA-программах плавание уже входит в общую стоимость?',
          answer: 'Водная зона без доплат включена в трёхчасовые пакеты «Мужской» (1 800 000 сум) и «Женский» (2 200 000 сум), а также в четырёхчасовую программу «Serenity для двоих» (5 000 000 сум).',
        },
      ],
      relatedLabel: 'Продолжить знакомство',
    },
    en: {
      slug: 'spa-with-pool-tashkent',
      title: 'Spa with panoramic indoor pool in Tashkent',
      metaTitle: 'Spa with indoor pool in Tashkent — Serenity Spa',
      description: '',
      eyebrow: '27 metres · 28°C water · Skyline glass',
      h1: '',
      lead: '',
      image: '/hero-pool.webp',
      primaryCta: 'Book pool & spa',
      secondaryCta: 'Explore packages',
      sections: [
        {
          title: '27-metre indoor lap geometry framed by floor-to-ceiling glass',
          body: 'Anchored by a straight 27-metre indoor vessel kept at a steady 28°C across all four seasons, the aquatic hall balances athletic length with serene resort architecture. Expansive perimeter glazing welcomes crisp daylight in the morning and mirrors warm underwater illumination against the Tashkent City skyline after dusk.',
          bullets: [
            'Uninterrupted 27-metre span suited to rhythmic freestyle or breaststroke laps',
            'Consistent 28°C water climate maintained through winter frost and summer heat',
            'Floor-to-ceiling panoramic windows overlooking the surrounding park district',
            'Cushioned poolside loungers arranged for unhurried reading between swims',
          ],
        },
        {
          title: '38°C hydromassage jacuzzi for lumbar and calf recovery',
          body: 'Steps away from the main swimming water sits a dedicated hydromassage whirlpool heated to 38°C. Targeted air-and-water jets knead tired calves, lower-back muscles and shoulders after swimming or sightseeing, easing muscular tension in a hushed indoor setting far removed from noisy waterparks.',
          bullets: [
            'Balanced thermal pairing: brisk 28°C lap water alongside soothing 38°C hydro-jets',
            'Buoyant warm immersion that relieves travel stiffness in the lower spine',
            'Quiet resort acoustics designed for adult relaxation and unhurried conversation',
            'Fresh bathrobes and dry towels waiting right beside the deck',
          ],
        },
        {
          title: 'Pairing an afternoon swim with bodywork in the treatment wing',
          body: 'Many guests structure their visit as a two-part ritual: forty minutes of weightless swimming and jacuzzi soaking followed immediately by a 60- or 90-minute Balinese or hot stone massage down the corridor. Water-warmed muscle fibres release faster under the therapist’s hands, deepening post-treatment sleep quality.',
          bullets: [
            'Early morning hours from 07:00 favour uninterrupted lap swimming',
            'Twilight hours until 23:00 showcase tranquil reflections on the water surface',
            'Seamless transition from poolside loungers to private massage suites',
            'Included automatically inside Men’s, Women’s and Serenity for Two packages',
          ],
        },
      ],
      facts: [
        { label: 'Length & climate', value: '27 m pool (28°C) & 38°C jacuzzi' },
        { label: 'Start', value: '600,000 UZS' },
        { label: 'Location', value: 'Ukchi 1, Tashkent' },
      ],
      faq: [
        {
          question: 'How long is the indoor swimming pool and how warm is the water?',
          answer: 'The indoor pool measures a full 27 metres in length with water kept at 28°C year-round, complemented by an adjacent 38°C hydromassage jacuzzi.',
        },
        {
          question: 'Is the 27-metre pool suitable for continuous lap swimming?',
          answer: 'Yes. Its straight 27-metre layout and refreshing 28°C water temperature support steady lap workouts without overheating, particularly during quieter morning hours from 07:00.',
        },
        {
          question: 'Which multi-hour spa packages already include swimming access?',
          answer: 'Swimming and thermal relaxation are built into the 3-hour Men’s Package (1,800,000 UZS), 3-hour Women’s Package (2,200,000 UZS) and 4-hour Serenity Package for Two (5,000,000 UZS).',
        },
      ],
      relatedLabel: 'Continue exploring',
    },
    uz: {
      slug: 'spa-with-pool-tashkent',
      title: 'Toshkentda panoramali yopiq basseynli spa',
      metaTitle: 'Toshkentda basseynli spa — Serenity Spa',
      description: '',
      eyebrow: '27 metr · Suv 28°C · Panoramali oyna',
      h1: '',
      lead: '',
      image: '/hero-pool.webp',
      primaryCta: 'Akvazonaga yozilish',
      secondaryCta: 'Dasturlarni ko‘rish',
      sections: [
        {
          title: '27 metrli yopiq suzish havzasi va poldan shiftgacha panoramali oynalar',
          body: 'Akvazona markazida yilning to‘rt faslida ham barqaror 28°C haroratni saqlaydigan to‘g‘ri burchakli 27 metrli yopiq havza joylashgan. Keng vitraj oynalar ertalab tabiiy quyosh nurini ichkariga olib kirsa, quyosh botgach suv yuzasidagi nafis chiroqlar va Tashkent City manzarasi sokin oqshom muhitini yaratadi.',
          bullets: [
            'Erkin krol yoki brass usulida suzish uchun to‘liq 27 metrli uzunlik',
            'Qishda ham, yozda ham o‘zgarmas 28°C qulay suv harorati',
            'Shahar ustidagi kenglik hissini beruvchi baland panoramali derazalar',
            'Suzish oralig‘ida kitob o‘qish va hordiq chiqarish uchun yumshoq shezlonglar',
          ],
        },
        {
          title: 'Bel va oyoq charchog‘ini yechuvchi 38°C gidromassajli jakuzi',
          body: 'Asosiy suzish yo‘lagi yonida 38°C gacha isitiladigan iliq jakuzi havzasi mavjud. Yo‘naltirilgan havo-suv oqimlari suzish yoki uzoq yurishdan keyin boldir, yelka va bel mushaklarini mayin uqalab, shovqinli akvaparklardan xoli sokin muhitda chuqur bo‘shashish imkonini beradi.',
          bullets: [
            'Haroratlar uyg‘unligi: tetiklantiruvchi 28°C basseyn va iliq 38°C jakuzi',
            'Safar va parvozdan keyin umurtqa atrofidagi taranglikni yumshatuvchi oqimlar',
            'Kattalar dam olishiga mos sokin akustika va osoyishta muhit',
            'Suv bo‘yida doim tayyor turadigan quruq sochiqlar va qulay o‘rindiqlar',
          ],
        },
        {
          title: 'Suzishni kechki massaj bilan birlashtirish ssenariysi',
          body: 'Ko‘plab mehmonlar tashrifni ikki bosqichda rejalashtiradi: dastlab 40 daqiqa davomida erkin suzish va jakuzida isinish, so‘ngra qo‘shni qanotdagi sokin xonada 60 yoki 90 daqiqalik Bali yoxud issiq toshlar massaji. Suvda yumshagan mushaklar mutaxassis qo‘l texnikasini yanada chuqur qabul qiladi.',
          bullets: [
            'Soat 07:00 dan boshlanadigan tonggi vaqt — faol suzish mashqlari uchun ayni muddao',
            'Soat 23:00 gacha kechki soatlar — sokin yoritish va osoyishta hordiq',
            'Shezlong zonasidan massaj xonalariga qulay ichki o‘tish yo‘lagi',
            '«Erkaklar», «Ayollar» va «Ikki kishilik» paketlarda suv zonasi narxga kiritilgan',
          ],
        },
      ],
      facts: [
        { label: 'Uzunlik va harorat', value: '27 m (28°C) va jakuzi 38°C' },
        { label: 'Boshlanish', value: '600 000 so‘m' },
        { label: 'Manzil', value: 'Ukchi 1, Toshkent' },
      ],
      faq: [
        {
          question: 'Yopiq basseynning uzunligi va suv harorati qanday?',
          answer: 'Yopiq suzish havzasining uzunligi 27 metr bo‘lib, suv harorati yil bo‘yi 28°C da ushlab turiladi; yonidagi gidromassajli jakuzi esa 38°C issiqlikda ishlaydi.',
        },
        {
          question: 'Havza sport usulida uzluksiz suzish uchun qulaymi?',
          answer: 'Ha, to‘g‘ri chiziqli 27 metrli o‘lcham va 28°C harorat ayniqsa ertalab soat 07:00 dan boshlab qizib ketmasdan uzoq masofaga suzish imkonini beradi.',
        },
        {
          question: 'Qaysi tayyor spa-paketlar ichiga basseyнда suzish kiritilgan?',
          answer: 'Basseyn va issiq xonalar 3 soatlik «Erkaklar paketi» (1 800 000 so‘m), «Ayollar paketi» (2 200 000 so‘m) hamda 4 soatlik «Ikki kishilik Serenity» (5 000 000 so‘m) tarkibiga kiradi.',
        },
      ],
      relatedLabel: 'Davom ettirish',
    },
  },
  'sauna-hammam-tashkent': {
    ru: {
      slug: 'sauna-hammam-tashkent',
      title: 'Финская сауна и паровая в формате хаммама в Ташкенте',
      metaTitle: 'Сауна и хаммам в Ташкенте — Serenity Spa',
      description: '',
      eyebrow: 'Сухой жар 95°C · Мягкий пар · Пилинги',
      h1: '',
      lead: '',
      image: '/infra-sauna.webp',
      primaryCta: 'Записаться на прогрев',
      secondaryCta: 'Уходы за телом',
      sections: [
        {
          title: 'Два разных микроклимата: сухая финская кабина 95°C и влажный пар',
          body: 'Термальное крыло объединяет две противоположные банные традиции, чтобы каждый гость выбрал комфортную переносимость тепла. Классическая финская сауна с натуральными деревянными полками прогревается до 95°C при низкой влажности воздуха, тогда как паровая парная в формате хаммама окутывает тело густым тёплым туманом без обжигающего жара.',
          bullets: [
            'Финская сухая парная 95°C — интенсивное потоотделение и глубокий прогрев суставов',
            'Влажная паровая в стиле хаммама — деликатное раскрытие пор и мягкое дыхание',
            'Натуральная древесина полок и продуманная вентиляция в горячем контуре',
            'Возможность чередовать сухой и влажный режим в рамках одного сеанса',
          ],
        },
        {
          title: 'Физиологичный цикл контрастного парения без перегрузки сосудов',
          body: 'Чтобы банный ритуал оставил ясность в голове, а не усталость, специалисты рекомендуют короткие заходы по 10–15 минут с обязательными паузами на охлаждение под душем и восполнение жидкости. Между прогревами важно снимать металлические украшения, укрывать голову сухим полотенцем и прислушиваться к пульсу.',
          bullets: [
            'Оптимальный ритм: 2–3 захода по 10–15 минут с отдыхом в прохладе между ними',
            'Освежающий душ после каждой парной для тонуса капилляров и кожи',
            'Восполнение водного баланса чистой водой или тёплым травяным настоем',
            'При гипертонии, беременности и простуде с температурой тепловые процедуры исключены',
          ],
        },
        {
          title: 'Пилинги и скрабирование распаренной кожи после парной',
          body: 'После влажного пара роговой слой эпидермиса размягчается, поэтому очищающие скрабы работают максимально бережно и эффективно. К термальному отдыху можно заранее забронировать пилинг за 850 000 сум — мятно-солевой, лавандовый, шоколадный или детокс — либо продолжить ритуал 60-минутным питательным обёртыванием.',
          bullets: [
            'Пилинг «Мята и соль» (850 000 сум) — свежесть и гладкость распаренной кожи',
            'Лавандовый, шоколадный и детокс-пилинги по 850 000 сум по записи',
            'Питательные 60-минутные обёртывания (850 000 сум) для закрепления мягкости',
            'Готовое сочетание парных и пилинга в пакетах «Мужской», «Женский» и «Для двоих»',
          ],
        },
      ],
      facts: [
        { label: 'Температура', value: 'Сухая финская 95°C + влажная паровая' },
        { label: 'Старт', value: '600 000 сум' },
        { label: 'Уходы к парной', value: 'Пилинги и обёртывания по 850 000 сум' },
      ],
      faq: [
        {
          question: 'Чем отличается финская сауна от паровой парной в Serenity Spa?',
          answer: 'Финская сауна даёт сухой интенсивный жар около 95°C на деревянных полках, а паровая в формате хаммама работает на более мягкой температуре с высокой влажностью, бережно смягчая кожу и дыхание.',
        },
        {
          question: 'Какой скраб лучше записать сразу после распаривания?',
          answer: 'Для бодрости и глубокого обновления чаще выбирают пилинг «Мята и соль» или «Детокс» (по 850 000 сум), а для вечернего релакса — лавандовый или шоколадный пилинг.',
        },
        {
          question: 'Кому стоит воздержаться от посещения горячих парных?',
          answer: 'Интенсивный нагрев противопоказан при высокой температуре тела, острых воспалениях, неконтролируемом артериальном давлении, тромбозах и в период осложнённой беременности.',
        },
      ],
      relatedLabel: 'Сочетается с прогревом',
    },
    en: {
      slug: 'sauna-hammam-tashkent',
      title: 'Finnish sauna & hammam-style steam room in Tashkent',
      metaTitle: 'Sauna and hammam in Tashkent — Serenity Spa',
      description: '',
      eyebrow: '95°C dry heat · Gentle steam · Scrubs',
      h1: '',
      lead: '',
      image: '/infra-sauna.webp',
      primaryCta: 'Book thermal session',
      secondaryCta: 'Body scrubs & wraps',
      sections: [
        {
          title: 'Two distinct thermal microclimates: 95°C dry cabin and humid steam',
          body: 'Our thermal zone pairs two complementary heat traditions so every visitor can match temperature and humidity to personal comfort. The classic timber-benched Finnish cabin radiates crisp dry heat around 95°C with low moisture, whereas the hammam-style steam bath surrounds the body in gentle, high-humidity vapour without scorching air.',
          bullets: [
            '95°C dry Finnish cabin encouraging deep perspiration and muscle warmth',
            'Humid hammam-style steam chamber softening the epidermis and easing breathing',
            'Smooth natural wood benches and balanced fresh-air circulation inside',
            'Freedom to alternate between dry heat and moist vapour during one visit',
          ],
        },
        {
          title: 'Pacing your contrast heat-and-cooling rounds safely',
          body: 'Restorative thermal bathing relies on measured intervals rather than endurance marathons. Limiting each hot round to 10–15 minutes followed by a cool rinse shower, quiet rest and steady water intake stimulates peripheral circulation while leaving your head clear and pulse calm.',
          bullets: [
            'Recommended cadence: two or three 10–15 minute heat intervals with cooling pauses',
            'Lukewarm-to-cool shower rinses between chambers to refresh vascular tone',
            'Remove metal watches or jewellery before entering the 95°C dry cabin',
            'Avoid high heat during fever, uncontrolled hypertension or acute vascular illness',
          ],
        },
        {
          title: 'Exfoliating peels on steam-softened skin',
          body: 'Moist warmth naturally loosens dull surface cells, making post-steam exfoliation remarkably smooth. Guests frequently pre-book an 850,000 UZS body peel — Mint & Salt, Lavender, Chocolate or Detox — right after their thermal session, or seal in hydration with a 60-minute nourishing body wrap.',
          bullets: [
            'Mint & Salt Peel (850,000 UZS) for brisk post-steam polish and skin freshness',
            'Lavender, Chocolate and Detox peels (850,000 UZS each) scheduled in private rooms',
            '60-minute nourishing wraps (850,000 UZS) to lock moisture into warm skin',
            'Bundled thermal + peel sequences inside Men’s, Women’s and Couples packages',
          ],
        },
      ],
      facts: [
        { label: 'Heat chambers', value: '95°C dry Finnish + humid steam bath' },
        { label: 'Start', value: '600,000 UZS' },
        { label: 'Exfoliation add-ons', value: 'Peels & wraps at 850,000 UZS' },
      ],
      faq: [
        {
          question: 'How does the Finnish sauna differ from the hammam-style steam room?',
          answer: 'The Finnish cabin delivers intense low-humidity dry heat around 95°C on wooden benches, while the hammam-style steam room uses milder temperatures with dense vapour to gently soften skin and airways.',
        },
        {
          question: 'Which body scrub works best right after steaming?',
          answer: 'Mint & Salt and Detox peels (850,000 UZS each) provide an invigorating polish after steam, while Lavender and Chocolate peels suit unhurried evening relaxation.',
        },
        {
          question: 'Who should skip high-temperature sauna sessions?',
          answer: 'Guests with fever, acute infection, unstable blood pressure, active thrombosis or medical heat restrictions should avoid hot chambers and opt for gentle room-temperature treatments instead.',
        },
      ],
      relatedLabel: 'Pairs with thermal care',
    },
    uz: {
      slug: 'sauna-hammam-tashkent',
      title: 'Toshkentda fin saunasi va bug‘li hammom',
      metaTitle: 'Toshkentda sauna va hammom — Serenity Spa',
      description: '',
      eyebrow: '95°C quruq harorat · Yumshoq bug‘ · Pilinglar',
      h1: '',
      lead: '',
      image: '/infra-sauna.webp',
      primaryCta: 'Termal seansga yozilish',
      secondaryCta: 'Tana pilinglari',
      sections: [
        {
          title: 'Ikki xil mikroiqlim: 95°C quruq fin kabinasi va nam bug‘ xonasi',
          body: 'Termal hudud ikki xil issiqlik an’anasini birlashtirgan bo‘lib, har bir mehmon o‘z organizmiga yoqadigan haroratni tanlay oladi. Tabiiy yog‘och supali klassik fin saunasi past namlikda 95°C gacha qiziydi, hammom uslubidagi bug‘ xonasi esa kuydirmaydigan quyuq iliq bug‘ bilan terini mayin yumshatadi.',
          bullets: [
            '95°C quruq fin saunasi — faol terlash va bo‘g‘imlarni chuqur isitish uchun',
            'Hammom uslubidagi nam bug‘ xonasi — teri teshikchalarini ochish va yengil nafas uchun',
            'Tabiiy yog‘och qoplama va toza havo aylanish tizimi',
            'Bir tashrif davomida quruq harorat va yumshoq bug‘ni navbatma-navbat almashtirish',
          ],
        },
        {
          title: 'Qon tomirlarini zo‘riqtirmaydigan kontrast isinish tartibi',
          body: 'Bug‘lanishdan keyin bosh og‘rig‘i emas, yengillik qolishi uchun har bir issiq kirishni 10–15 daqiqa bilan cheklash, oralig‘ida iliq-salqin dush qabul qilish va suv ichib dam olish tavsiya etiladi. Yuqori haroratli xonaga kirishdan oldin metall taqinchoqlar va soatni yechib qo‘yish xavfsizlik qoidasidir.',
          bullets: [
            'Tavsiya etilgan marom: tanaffuslar bilan 10–15 daqiqalik 2–3 ta kirish',
            'Har bir isinishdan keyin teri tonusini tiklovchi tetiklantiruvchi dush',
            'Tanaffusda toza suv ichib suyuqlik muvozanatini saqlash',
            'Isitma, yuqori qon bosimi va o‘tkir qon-tomir kasalliklarida issiq xona man etiladi',
          ],
        },
        {
          title: 'Bug‘da yumshagan teri uchun skrab-pilinglar va o‘rashlar',
          body: 'Nam bug‘dan keyin epidermisning ustki qatlami yumshaydi va tozalovchi skrablar terini shikastlamasdan tekislaydi. Termal hordiqdan so‘ng 850 000 so‘mlik tana pilinglaridan birini — «Yalpiz va tuz», lavanda, shokolad yoki «Detoks» turini — yoxud 60 daqiqalik oziqlantiruvchi o‘rashni oldindan band qilish mumkin.',
          bullets: [
            '«Yalpiz va tuz» pilingi (850 000 so‘m) — bug‘dan keyin tetiklik va silliqlik',
            'Lavanda, shokolad va detoks pilinglari (har biri 850 000 so‘m) yakka xonalarda',
            'Namlikni terida saqlab qoluvchi 60 daqiqalik o‘rashlar (850 000 so‘m)',
            '«Erkaklar», «Ayollar» va «Ikki kishilik» paketlarda tayyor bug‘ + piling ketma-ketligi',
          ],
        },
      ],
      facts: [
        { label: 'Harorat rejimi', value: '95°C quruq fin + nam bug‘li hammom' },
        { label: 'Boshlanish', value: '600 000 so‘m' },
        { label: 'Qo‘shimcha parvarish', value: 'Piling va o‘rashlar — 850 000 so‘m' },
      ],
      faq: [
        {
          question: 'Fin saunasi va hammom uslubidagi bug‘ xonasi nimasi bilan farq qiladi?',
          answer: 'Fin saunasida past namlik va yog‘och supalarda 95°C atrofidagi quruq harorat bo‘ladi, bug‘ xonasi esa yumshoqroq harorat va yuqori namlik bilan terini ehtiyotkor yumshatadi.',
        },
        {
          question: 'Bug‘ xonasidan keyin qaysi pilingni tanlagan ma’qul?',
          answer: 'Tetiklik va chuqur tozalash uchun «Yalpiz va tuz» yoki «Detoks» pilingi (850 000 so‘m), kechki sokin dam olish uchun esa lavanda yoxud shokolad pilingi ko‘proq tanlanadi.',
        },
        {
          question: 'Kimlarga yuqori haroratli bug‘ xonalariga kirish tavsiya etilmaydi?',
          answer: 'Tana harorati ko‘tarilganda, beqaror yuqori qon bosimi, tromboz va o‘tkir yallig‘lanish holatlarida issiq saunadan saqlanish va yumshoq xona haroratidagi muolajalarni tanlash kerak.',
        },
      ],
      relatedLabel: 'Issiq parvarishga mos',
    },
  },
  'spa-packages-tashkent': {
    ru: {
      slug: 'spa-packages-tashkent',
      title: 'Комплексные SPA-программы в Ташкенте',
      metaTitle: 'SPA программы в Ташкенте — Serenity Spa',
      description: '',
      eyebrow: 'Готовые ритуалы · 3–4,5 часа',
      h1: '',
      lead: '',
      image: '/images/gallery/full/treatment-room-tub.webp',
      primaryCta: 'Выбрать программу',
      secondaryCta: 'Все услуги',
      sections: [
        {
          title: 'Трёхчасовые программы для одного гостя: «Мужской» и «Женский» пакеты',
          body: 'Если хочется полноценной перезагрузки за половину дня без самостоятельной стыковки процедур, начните с трёхчасовых сольных программ. «Мужской пакет» (3 часа, 1 800 000 сум) делает упор на снятие мышечного напряжения, а «Женский пакет» (3 часа, 2 200 000 сум) дополняет отдых классическим массажем лица для свежего тона кожи.',
          bullets: [
            'Мужской пакет (3 ч, 1 800 000 сум): бассейн, парные, детокс-пилинг, классический массаж и чай',
            'Женский пакет (3 ч, 2 200 000 сум): бассейн, парные, шоколадный пилинг, аромамассаж, массаж лица и чай',
            'Водный и термальный разогрев уже включены в фиксированную стоимость обоих пакетов',
            'Финальная чайная церемония в тихой лаунж-зоне после завершения уходов',
          ],
        },
        {
          title: '«Авторский пакет Serenity» на 4,5 часа и программа «Serenity для двоих»',
          body: 'Флагманский «Авторский пакет Serenity» длится 4,5 часа и доступен как для одного гостя (3 000 000 сум), так и в версии на двоих (5 500 000 сум): в него входят лавандовый пилинг, приватная аромаванна, массаж Signature of Serenity, лавандовое обёртывание и чай. Отдельно представлена 4-часовая программа «Serenity для двоих» за 5 000 000 сум с бассейном, саунами и балийским массажем.',
          bullets: [
            'Авторский пакет для 1 гостя (4,5 ч, 3 000 000 сум) — с круглой аромаванной и лавандой',
            'Авторский пакет на двоих (4,5 ч, 5 500 000 сум) — уединённый сьют с купелью на пару',
            'Serenity для двоих (4 ч, 5 000 000 сум) — бассейн, сауны, мята-соль, балийский массаж и авокадо-шёлк',
            'Бесшовный переход между этапами без ожидания в коридорах',
          ],
        },
        {
          title: 'Почему готовый SPA-день удобнее раздельной записи по прайсу',
          body: 'При бронировании пакета администратор заранее выстраивает последовательность кабинетов и мастеров на все 3–4,5 часа. Гостю не нужно доплачивать за разовый вход в водную зону в программах с бассейном, а чередование разогрева, скрабирования, массажа и обёртывания усиливает косметический и расслабляющий результат.',
          bullets: [
            'Единый фиксированный бюджет и согласованный тайминг всех этапов',
            'Идеальный формат для выходного в одиночку, девичника или подарка близким',
            'Халат, полотенца, тапочки и одноразовые принадлежности выдаются на месте',
            'Рекомендуется бронировать слоты на выходные за 2–3 дня до визита',
          ],
        },
      ],
      facts: [
        { label: 'Длительность', value: 'От 3 до 4,5 часов отдыха' },
        { label: 'Старт', value: '1 800 000 сум' },
        { label: 'Форматы', value: 'Сольные (1 гость) и парные (2 гостя)' },
      ],
      faq: [
        {
          question: 'В каких SPA-пакетах бассейн и парные уже включены в цену?',
          answer: 'Доступ к бассейну и термальному комплексу встроен в «Мужской пакет» (1 800 000 сум), «Женский пакет» (2 200 000 сум) и «Serenity для двоих» (5 000 000 сум); «Авторский пакет» вместо общей аквазоны включает приватную аромаванну.',
        },
        {
          question: 'Какая программа в меню самая продолжительная и насыщенная?',
          answer: 'Самый длительный ритуал — 4,5-часовой «Авторский пакет Serenity» (3 000 000 сум на одного или 5 500 000 сум на двоих) с лавандовым пилингом, аромаванной, фирменным массажем и обёртыванием.',
        },
        {
          question: 'Что нужно взять с собой на трёх- или четырёхчасовую программу?',
          answer: 'Возьмите только купальник, если выбранный пакет включает бассейн и сауны; халат, тапочки, полотенца и чайная подача полностью подготовлены спа-центром.',
        },
      ],
      relatedLabel: 'Похожие разделы',
    },
    en: {
      slug: 'spa-packages-tashkent',
      title: 'All-in-one spa packages in Tashkent',
      metaTitle: 'Spa packages in Tashkent — Serenity Spa',
      description: '',
      eyebrow: 'Curated half-day rituals · 3–4.5 hours',
      h1: '',
      lead: '',
      image: '/images/gallery/full/treatment-room-tub.webp',
      primaryCta: 'Choose a package',
      secondaryCta: 'All services',
      sections: [
        {
          title: 'Three-hour solo journeys: Men’s and Women’s Packages',
          body: 'Guests seeking a structured half-day reset without coordinating individual bookings start with our three-hour solo rituals. The Men’s Package (3 hours, 1,800,000 UZS) targets deep muscular recovery, while the Women’s Package (3 hours, 2,200,000 UZS) adds indulgent cocoa exfoliation and a classic facial massage for luminous skin.',
          bullets: [
            'Men’s Package (3 h, 1,800,000 UZS): pool, thermal zone, detox peel, classic massage and tea',
            'Women’s Package (3 h, 2,200,000 UZS): pool, thermal zone, chocolate peel, aroma massage, facial massage and tea',
            'Wet-area access is already built into the fixed package rate for both programs',
            'Unhurried herbal tea ceremony served in the quiet lounge at the close',
          ],
        },
        {
          title: '4.5-hour Signature Serenity and 4-hour Serenity for Two',
          body: 'Our flagship 4.5-hour Signature Serenity Package is offered for one guest (3,000,000 UZS) or two guests together (5,500,000 UZS), uniting a lavender peel, private round aroma bath, Signature of Serenity massage, lavender wrap and tea. Couples wanting swimming and saunas choose the 4-hour Serenity Package for Two at 5,000,000 UZS total.',
          bullets: [
            'Signature Serenity for 1 guest (4.5 h, 3,000,000 UZS) — private soaking tub and lavender care',
            'Signature Serenity for 2 guests (4.5 h, 5,500,000 UZS) — shared suite bath and twin beds',
            'Serenity for Two (4 h, 5,000,000 UZS) — pool, saunas, Mint & Salt, Balinese massage and Avocado & Silk',
            'Choreographed room transitions with zero waiting between stages',
          ],
        },
        {
          title: 'Why a bundled spa day outperforms separate à-la-carte bookings',
          body: 'Reserving a complete package locks in consecutive room and therapist availability across 3 to 4.5 hours under one transparent UZS total. Moving progressively from water or steam warmth to exfoliation, full-body massage and nourishing wrap amplifies skin softness and nervous-system calm.',
          bullets: [
            'Single upfront price with no extra day-pass surcharge on pool-inclusive packages',
            'Well suited to weekend self-care, milestone birthdays and executive gifts',
            'Bathrobes, slippers, towels and disposable essentials supplied on arrival',
            'Advance booking 2–3 days ahead is recommended for Friday–Sunday slots',
          ],
        },
      ],
      facts: [
        { label: 'Duration', value: '3 to 4.5 hours per ritual' },
        { label: 'Start', value: '1,800,000 UZS' },
        { label: 'Formats', value: 'Solo (1 guest) and couples (2 guests)' },
      ],
      faq: [
        {
          question: 'Which spa packages include pool and thermal access in the price?',
          answer: 'The Men’s Package (1,800,000 UZS), Women’s Package (2,200,000 UZS) and Serenity Package for Two (5,000,000 UZS) all include pool and thermal access, whereas Signature Serenity features a private aroma bath inside the suite.',
        },
        {
          question: 'Which program is the longest ritual on the Serenity Spa menu?',
          answer: 'The 4.5-hour Signature Serenity Package (3,000,000 UZS for one guest or 5,500,000 UZS for two) is our longest journey, combining lavender exfoliation, an aroma bath, Signature massage, lavender wrap and tea.',
        },
        {
          question: 'What do I need to bring for a three- or four-hour spa package?',
          answer: 'Bring swimwear only if your chosen package includes the swimming pool and saunas; bathrobes, slippers, fresh towels and tea refreshments are provided.',
        },
      ],
      relatedLabel: 'Related pages',
    },
    uz: {
      slug: 'spa-packages-tashkent',
      title: 'Toshkentda kompleks spa-dasturlar',
      metaTitle: 'Toshkentda spa dasturlari — Serenity Spa',
      description: '',
      eyebrow: 'Tayyor marosimlar · 3–4,5 soat',
      h1: '',
      lead: '',
      image: '/images/gallery/full/treatment-room-tub.webp',
      primaryCta: 'Dasturni tanlash',
      secondaryCta: 'Barcha xizmatlar',
      sections: [
        {
          title: 'Bir mehmon uchun 3 soatlik dasturlar: «Erkaklar» va «Ayollar» paketlari',
          body: 'Yarim kunlik to‘liq tiklanishni alohida muolajalarni hisoblab o‘tirmasdan rejalashtirish uchun uch soatlik yakka dasturlar yaratilgan. «Erkaklar paketi» (3 soat, 1 800 000 so‘m) mushak charchog‘ini yechishga, «Ayollar paketi» (3 soat, 2 200 000 so‘m) esa shokoladli yangilanish va klassik yuz massaji orqali teri tarovatiga qaratilgan.',
          bullets: [
            'Erkaklar paketi (3 soat, 1 800 000 so‘m): basseyn, bug‘ xonalari, detoks pilingi, klassik massaj va choy',
            'Ayollar paketi (3 soat, 2 200 000 so‘m): basseyn, saunalar, shokolad pilingi, aromamassaj, yuz massaji va choy',
            'Ikkala paketda ham suv va issiqlik zonasiga kirish umumiy narx ichida',
            'Muolajalar yakunida sokin dam olish zalida xushbo‘y choy marosimi',
          ],
        },
        {
          title: '4,5 soatlik «Mualliflik Serenity» va 4 soatlik «Ikki kishilik» dastur',
          body: '4,5 soatlik «Mualliflik Serenity paketi» ham bir kishi uchun (3 000 000 so‘m), ham ikki mehmon uchun (5 500 000 so‘m) taqdim etilib, lavanda pilingi, xususiy aroma vanna, Signature of Serenity massaji, lavanda o‘rashi va choyni jamlaydi. Basseyn va saunalarni xohlovchi juftliklar esa 5 000 000 so‘mlik 4 soatlik «Ikki kishilik Serenity»ni tanlaydi.',
          bullets: [
            '1 mehmon uchun Mualliflik paketi (4,5 soat, 3 000 000 so‘m) — aroma vanna va lavanda bilan',
            '2 mehmon uchun Mualliflik paketi (4,5 soat, 5 500 000 so‘m) — juftlik xonasida vanna va massaj',
            'Ikki kishilik Serenity (4 soat, 5 000 000 so‘m) — basseyn, saunalar, Bali massaji va avokado-ipak',
            'Bosqichlar orasida kutishlarsiz ravon tashkillashtirilgan ketma-ketlik',
          ],
        },
        {
          title: 'Tayyor spa-kun alohida yozilishdan nimasi bilan qulayroq',
          body: 'Kompleks dastur band qilinganda administrator 3–4,5 soat davomidagi barcha xonalar va mutaxassislar vaqtini oldindan uyg‘unlashtirib qo‘yadi. Basseynli paketlarda kunduzgi kirish uchun alohida haq to‘lanmaydi, isinish, skrab, massaj va o‘rashning ketma-ketligi esa teri yumshoqligini sezilarli kuchaytiradi.',
          bullets: [
            'Oldindan aniq belgilangan yagona byudjet va kelishilgan vaqt jadvali',
            'Dam olish kuni, tug‘ilgan kun yoki yaqin insonga sovg‘a uchun tayyor yechim',
            'Xalat, shippak, sochiq va bir martalik vositalar to‘liq taqdim etiladi',
            'Dam olish kunlariga joy band qilish uchun 2–3 kun avval murojaat qilish ma’qul',
          ],
        },
      ],
      facts: [
        { label: 'Davomiylik', value: '3 soatdan 4,5 soatgacha' },
        { label: 'Boshlanish', value: '1 800 000 so‘m' },
        { label: 'Formatlar', value: 'Yakka (1 mehmon) va juftlik (2 mehmon)' },
      ],
      faq: [
        {
          question: 'Qaysi spa-dasturlarda basseyn va saunalar narxga kiritilgan?',
          answer: '«Erkaklar paketi» (1 800 000 so‘m), «Ayollar paketi» (2 200 000 so‘m) va «Ikki kishilik Serenity» (5 000 000 so‘m) narxiga basseyn hamda termal zona kiradi; «Mualliflik paketi»da esa xususiy aroma vanna mavjud.',
        },
        {
          question: 'Menyudagi eng uzoq davom etadigan dastur qaysi?',
          answer: 'Eng boy dastur — 4,5 soatlik «Mualliflik Serenity paketi» (bir kishiga 3 000 000 so‘m, ikki kishiga 5 500 000 so‘m) bo‘lib, piling, aroma vanna, mualliflik massaji, o‘rash va choyni qamrab oladi.',
        },
        {
          question: 'Ko‘p soatlik spa-dasturga kelganda o‘zim bilan nima olishim kerak?',
          answer: 'Tanlangan paketda basseyn bo‘lsa, faqat cho‘milish kiyimini olish kifoya — xalat, sochiq, shippak va choy marosimi markaz tomonidan tayyorlanadi.',
        },
      ],
      relatedLabel: 'O‘xshash sahifalar',
    },
  },
  'wellness-membership-tashkent': {
    ru: {
      slug: 'wellness-membership-tashkent',
      title: 'Клубные абонементы в бассейн и SPA в Ташкенте',
      metaTitle: 'Абонементы в бассейн и SPA в Ташкенте — Serenity Spa',
      description: '',
      eyebrow: 'Клубные привилегии · От 12 визитов до года',
      h1: '',
      lead: '',
      image: '/images/gallery/full/pool-day-wide.webp',
      primaryCta: 'Подобрать карту',
      secondaryCta: 'Разовый визит',
      sections: [
        {
          title: 'Линейка личных карт: 12 визитов, Стандарт, Бронза, Серебро и Золото',
          body: 'Клубная система построена под разную плотность расписания — от гибкого пакета на 12 приходов (4 500 000 сум) и месячной карты «Стандарт» (4 900 000 сум) до длительных клубных статусов на 3, 6 и 12 месяцев. Все взрослые карты открывают доступ к 27-метровому бассейну, фитнес-центру, паровой и финской саунам, джакузи, детокс-воде и Wi-Fi.',
          bullets: [
            '12 визитов (4 500 000 сум) и Стандарт 1 мес. (4 900 000 сум) — старт регулярного режима',
            'Бронза 3 мес. (12 900 000 сум) — сезонный ритм и клубная скидка 5% на SPA-услуги',
            'Серебро 6 мес. (19 900 000 сум) — заморозка 30 дней, 3 гостевых визита, 1 массаж и скидка 10%',
            'Золото 12 мес. (29 000 000 сум) — заморозка 60 дней, 5 гостевых визитов, 2 массажа и скидка 15%',
          ],
        },
        {
          title: 'Семейная годовая карта для супругов и детские абонементы 6–12 лет',
          body: 'Для супружеских пар действует 12-месячный тариф «Семейный» за 50 000 000 сум на двоих взрослых: до 3 детей младше 6 лет проходят бесплатно, на детские карты 7–13 лет действует скидка 50%, а пакет привилегий включает 30 дней заморозки, 5 гостевых проходов, 2 классических массажа по 60 минут и скидку 15%. Отдельно оформляются детские карты (6–12 лет) на 1, 3, 6 или 12 месяцев.',
          bullets: [
            'Семейный 12 мес. (50 000 000 сум) — для двоих супругов с семейными привилегиями',
            'До 3 детей до 6 лет бесплатно и 50% скидка на детские карты 7–13 лет в семейном тарифе',
            'Детские абонементы (6–12 лет): 1, 3, 6 или 12 месяцев для плавания и отдыха',
            'Удобный график для утренних заплывов до школы или совместных семейных выходных',
          ],
        },
        {
          title: 'Заморозка на время командировок и подарочные гостевые визиты',
          body: 'Карты Серебро, Золото и Семейный адаптированы под командировки: заморозка на 30 или 60 дней сохраняет недели во время отпуска. Гостевые приглашения и постоянная скидка 10–15% делают регулярные массажи заметно выгоднее.',
          bullets: [
            'Заморозка 30 дней в Серебре и Семейном, 60 дней в Золоте',
            'Подарочные классические массажи 60 минут в полугодовых и годовых картах',
            'Гостевые визиты для приглашения друзей или партнёров без доплаты',
            'Консультация на ресепшене для подбора срока перед оформлением',
          ],
        },
      ],
      facts: [
        { label: 'Сроки карт', value: '12 визитов, 1, 3, 6 и 12 месяцев' },
        { label: 'Привилегии', value: 'Заморозка до 60 дней, гостевые визиты и скидки до 15%' },
        { label: 'Локация', value: 'Укчи 1, Ташкент' },
      ],
      faq: [
        {
          question: 'В каких абонементах предусмотрена заморозка карты на время отпуска?',
          answer: 'Заморозка включена в карты Серебро на 6 месяцев (30 дней), Семейный на 12 месяцев (30 дней) и Золото на 12 месяцев (60 дней).',
        },
        {
          question: 'Какие бонусы получают владельцы полугодовых и годовых карт?',
          answer: 'Тариф Серебро (19 900 000 сум) даёт 3 гостевых визита, 1 массаж 60 минут и скидку 10%, а Золото (29 000 000 сум) — 5 гостевых визитов, 2 массажа и скидку 15% на меню спа.',
        },
        {
          question: 'Какие условия для детей действуют в семейном и детском форматах?',
          answer: 'В годовой карте «Семейный» (50 000 000 сум для супругов) до 3 детей до 6 лет посещают спа бесплатно, а для возраста 7–13 лет действует скидка 50%; также доступны отдельные детские карты (6–12 лет) на 1–12 месяцев.',
        },
      ],
      relatedLabel: 'Сравнить с разовым входом',
    },
    en: {
      slug: 'wellness-membership-tashkent',
      title: 'Pool, gym & spa memberships in Tashkent',
      metaTitle: 'Wellness memberships in Tashkent — Serenity Spa',
      description: '',
      eyebrow: 'Club tiers · 12 visits to 12 months',
      h1: '',
      lead: '',
      image: '/images/gallery/full/pool-day-wide.webp',
      primaryCta: 'Enquire about membership',
      secondaryCta: 'Single day pass',
      sections: [
        {
          title: 'Individual club tiers: 12 Visits, Standard, Bronze, Silver and Gold',
          body: 'Our membership ladder scales from a flexible 12-visit punch card (4,500,000 UZS) and 1-month Standard plan (4,900,000 UZS) up to 3-, 6- and 12-month club privileges. Every adult membership includes the 27-metre indoor pool, fitness studio, Finnish and steam saunas, 38°C jacuzzi, chilled detox water and Wi-Fi.',
          bullets: [
            '12 Visits (4,500,000 UZS) & 1-month Standard (4,900,000 UZS) for flexible routines',
            'Bronze 3 months (12,900,000 UZS) adding a 5% member privilege on spa services',
            'Silver 6 months (19,900,000 UZS) with 30-day freeze, 3 guest passes, 1 massage & 10% off',
            'Gold 12 months (29,000,000 UZS) with 60-day freeze, 5 guest passes, 2 massages & 15% off',
          ],
        },
        {
          title: 'Annual Family plan for spouses and Kids memberships (ages 6–12)',
          body: 'Married couples can join together under the 12-month Family plan at 50,000,000 UZS for two spouses: up to three children under age 6 enter free, children aged 7–13 receive 50% off kids memberships, and the couple shares a 30-day freeze, 5 guest passes, two 60-minute classic massages and 15% off treatments. Standalone Kids cards (ages 6–12) are also offered across 1, 3, 6 and 12 months.',
          bullets: [
            'Family 12 months (50,000,000 UZS) covering two spouses with shared club privileges',
            'Up to 3 children under 6 free plus 50% off kids plans for ages 7–13 under Family tier',
            'Dedicated Kids memberships (ages 6–12) available for 1, 3, 6 or 12 months',
            'Balanced schedule for weekday swimming practice and relaxed family weekends',
          ],
        },
        {
          title: 'Travel freeze protection, complimentary massages and guest invitations',
          body: 'Frequent travellers lose zero value on half-year and annual plans thanks to built-in 30- to 60-day membership freeze allowances. Complimentary 60-minute classic massages, guest passes for colleagues or friends, and ongoing 10–15% spa discounts reward members who make recovery a weekly habit.',
          bullets: [
            '30-day travel freeze on Silver & Family tiers; 60-day freeze on Gold',
            'Complimentary 60-minute classic massages included in Silver, Gold and Family plans',
            'Guest passes allowing you to host friends or visiting partners at the club',
            'Personal tier walkthrough with our reception team prior to enrolment',
          ],
        },
      ],
      facts: [
        { label: 'Durations', value: '12 visits, 1, 3, 6 and 12 months' },
        { label: 'Member perks', value: 'Up to 60-day freeze, guest passes & 15% spa discount' },
        { label: 'Location', value: 'Ukchi 1, Tashkent' },
      ],
      faq: [
        {
          question: 'Which membership plans include a travel freeze option?',
          answer: 'Membership freeze is included with the 6-month Silver plan (30 days), 12-month Family plan (30 days) and 12-month Gold plan (60 days).',
        },
        {
          question: 'What extra perks come with Silver and Gold club tiers?',
          answer: 'Silver (19,900,000 UZS) adds 3 guest passes, one 60-minute massage and 10% off spa services, while Gold (29,000,000 UZS) includes 5 guest passes, two 60-minute massages and a 15% spa discount.',
        },
        {
          question: 'How do family and children’s membership options work?',
          answer: 'The 12-month Family tier (50,000,000 UZS for two spouses) admits up to 3 children under 6 free and grants 50% off memberships for ages 7–13; standalone Kids plans (ages 6–12) are also available for 1–12 months.',
        },
      ],
      relatedLabel: 'Compare access formats',
    },
    uz: {
      slug: 'wellness-membership-tashkent',
      title: 'Toshkentda basseyn, sport zali va spa abonementlari',
      metaTitle: 'Toshkentda spa abonementlari — Serenity Spa',
      description: '',
      eyebrow: 'Klub imtiyozlari · 12 tashrifdan 1 yilgacha',
      h1: '',
      lead: '',
      image: '/images/gallery/full/pool-day-wide.webp',
      primaryCta: 'Abonement tanlash',
      secondaryCta: 'Kunlik chipta',
      sections: [
        {
          title: 'Shaxsiy klub kartalari: 12 tashrif, Standart, Bronza, Kumush va Oltin',
          body: 'Abonementlar tizimi moslashuvchan 12 tashrif paketidan (4 500 000 so‘m) va 1 oylik «Standart» kartasidan (4 900 000 so‘m) tortib 3, 6 hamda 12 oylik klub maqomlarigacha qamrab oladi. Kattalar uchun mo‘ljallangan barcha kartalar 27 metrli basseyn, sport zali, bug‘ va fin saunalari, jakuzi, detoks-suv hamda Wi-Fi xizmatlarini ochadi.',
          bullets: [
            '12 tashrif (4 500 000 so‘m) va Standart 1 oy (4 900 000 so‘m) — muntazam odat boshlanishi',
            'Bronza 3 oy (12 900 000 so‘m) — mavsumiy rejim va spa-xizmatlarga 5% chegirma',
            'Kumush 6 oy (19 900 000 so‘m) — 30 kun muzlatish, 3 mehmon tashrifi, 1 massaj va 10% chegirma',
            'Oltin 12 oy (29 000 000 so‘m) — 60 kun muzlatish, 5 mehmon tashrifi, 2 massaj va 15% chegirma',
          ],
        },
        {
          title: 'Er-xotin uchun 12 oylik Oilaviy tarif va 6–12 yosh bolalar kartalari',
          body: 'Turmush o‘rtoqlar uchun 50 000 000 so‘mlik 12 oylik «Oilaviy» karta amal qiladi: 6 yoshgacha bo‘lgan 3 nafargacha farzand bepul kiradi, 7–13 yosh bolalar abonementiga 50% chegirma beriladi, shuningdek 30 kun muzlatish, 5 mehmon chiptasi, ikkita 60 daqiqalik klassik massaj va 15% chegirma taqdim etiladi. Alohida 6–12 yosh bolalar uchun 1, 3, 6 va 12 oylik kartalar ham mavjud.',
          bullets: [
            'Oilaviy 12 oy (50 000 000 so‘m) — ikki nafar turmush o‘rtoq uchun yagona klub paketi',
            'Oilaviy tarifda 6 yoshgacha 3 bola bepul va 7–13 yosh kartalariga 50% chegirma',
            'Bolalar abonementlari (6–12 yosh): 1, 3, 6 yoki 12 oylik suzish va dam olish muddatlari',
            'Hafta ichida suzish mashg‘ulotlari va oilaviy dam olish kunlari uchun qulay tartib',
          ],
        },
        {
          title: 'Safar vaqtida muzlatish, sovg‘a massajlari va mehmon taklifnomalari',
          body: 'Tez-tez xizmat safariga chiquvchi a’zolar uchun Kumush, Oltin va Oilaviy kartalarda 30–60 kunlik muzlatish imkoniyati ko‘zda tutilgan bo‘lib, ta’til davrida kunlar kuyib ketmaydi. Bonus sifatida kiritilgan massajlar, do‘stlar uchun mehmon tashriflari va 10–15% doimiy chegirma klub a’zoligini yanada foydali qiladi.',
          bullets: [
            'Kumush va Oilaviy tariflarda 30 kun, Oltin tarifida esa 60 kun rasmiy muzlatish',
            '6 va 12 oylik kartalar ichida 60 daqiqalik klassik massaj sovg‘a sifatida mavjud',
            'Yaqinlar yoki hamkorlarni klubga taklif etish uchun bepul mehmon tashriflari',
            'Shartnoma tuzishdan avval qabulxonada mos muddat bo‘yicha batafsil maslahat',
          ],
        },
      ],
      facts: [
        { label: 'Muddatlar', value: '12 tashrif, 1, 3, 6 va 12 oy' },
        { label: 'Klub bonuslari', value: '60 kungacha muzlatish, mehmon kirishi va 15% gacha chegirma' },
        { label: 'Manzil', value: 'Ukchi 1, Toshkent' },
      ],
      faq: [
        {
          question: 'Qaysi abonementlarda ta’til yoki safar paytida kartani muzlatish mumkin?',
          answer: 'Kartani muzlatish imkoniyati 6 oylik Kumush (30 kun), 12 oylik Oilaviy (30 kun) va 12 oylik Oltin (60 kun) tariflariga kiritilgan.',
        },
        {
          question: 'Kumush va Oltin klub kartalarida qanday qo‘shimcha imtiyozlar bor?',
          answer: 'Kumush (19 900 000 so‘m) 3 mehmon tashrifi, 1 ta massaj va 10% chegirma bersa, Oltin (29 000 000 so‘m) 5 mehmon tashrifi, 2 ta 60 daqiqalik massaj va 15% chegirma taqdim etadi.',
        },
        {
          question: 'Oilaviy va bolalar abonementlarida yosh shartlari qanday?',
          answer: '12 oylik «Oilaviy» tarifda (50 000 000 so‘m, er-xotin uchun) 6 yoshgacha 3 nafar bola bepul kiradi va 7–13 yosh uchun 50% chegirma beriladi; 6–12 yosh bolalar uchun alohida 1–12 oylik kartalar ham bor.',
        },
      ],
      relatedLabel: 'Kirish turlarini solishtirish',
    },
  },
};

export function getOrganicPage(slug: string, locale: Locale): OrganicPageContent | undefined {
  const raw = ORGANIC_PAGES[slug as OrganicPageSlug]?.[locale];
  return raw ? enrichOrganicPage(raw, locale) : undefined;
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
        dateModified: CONTENT_UPDATED,
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
        offers: buildOrganicOffers(page.priceRows, url),
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
