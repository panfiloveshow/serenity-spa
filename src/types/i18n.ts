export const SUPPORTED_LOCALES = ['ru', 'en', 'uz'] as const;
export const DEFAULT_LOCALE: Locale = 'ru';
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const OG_LOCALES: Record<Locale, string> = {
  ru: 'ru_RU',
  en: 'en_US',
  uz: 'uz_UZ',
};

export interface Dictionary {
  metadata: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    jsonLdDescription: string;
  };
  nav: {
    services: string;
    packages: string;
    membership: string;
    contacts: string;
    bookButton: string;
    language: string;
    openMenu: string;
    closeMenu: string;
  };
  a11y: {
    skipToContent: string;
    call: string;
  };
  hero: {
    tagline: string;
    description: string;
    ctaBook: string;
    ctaPackages: string;
    scrollHint: string;
  };
  infrastructure: {
    sectionTitle: string;
    sectionSubtitle: string;
    eyebrow: string;
    stats: {
      area: string;
      zones: string;
      hours: string;
      hoursSuffix: string;
    };
    items: Record<string, { title: string; description: string; metrics?: string }>;
  };
  services: {
    sectionTitle: string;
    eyebrow: string;
    count: string;
    priceFrom: string;
    categories: Array<{
      title: string;
      subtitle: string;
      items: Array<{
        name: string;
        duration: string;
        desc: string;
      }>;
    }>;
  };
  packages: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: Array<{
      title: string;
      price: string;
      duration: string;
      description: string;
      includes: string[];
      popularLabel?: string;
    }>;
  };
  membership: {
    sectionTitle: string;
    sectionSubtitle: string;
    eyebrow: string;
    popularBadge: string;
    tiers: Array<{
      name: string;
      price: string;
      priceNote?: string;
      period: string;
      features: string[];
    }>;
  };
  contacts: {
    sectionTitle: string;
    address: string;
    hours: string;
    phoneLabel: string;
    emailLabel: string;
    mapButton: string;
    eyebrow: string;
    subtitle: string;
    addressLabel: string;
    hoursLabel: string;
  };
  testimonials: {
    eyebrow: string;
    title: string;
    ratingSummary: string;
    starsAria: string;
    reviews: Array<{ name: string; service: string; text: string }>;
  };
  footer: {
    navTitle: string;
    servicesTitle: string;
    brandDescription: string;
    copyright: string;
    privacyLink: string;
    termsLink: string;
    scrollTop: string;
    navLinks: Array<{ label: string; href: string }>;
    serviceLinks: Array<{ label: string; href: string }>;
  };
  booking: {
    title: string;
    stepSelect: string;
    stepForm: string;
    stepSuccess: string;
    stepError: string;
    stepSending: string;
    tabs: {
      services: string;
      packages: string;
      memberships: string;
    };
    selectedService: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    dateLabel: string;
    datePlaceholder: string;
    timeLabel: string;
    timePlaceholder: string;
    commentLabel: string;
    commentPlaceholder: string;
    submitButton: string;
    sendingButton: string;
    orCall: string;
    skipSelection: string;
    consultation: string;
    popularLabel: string;
    programPrefix: string;
    membershipPrefix: string;
    nameMinError: string;
    nameCharsError: string;
    phoneError: string;
    digitsOf: string;
    months: string[];
    days: string[];
    successTitle: string;
    successMessage: string;
    successThanks: string;
    thankYouTitle: string;
    thankYouSubtitle: string;
    thankYouBack: string;
    errorTitle: string;
    errorMessage: string;
    retryButton: string;
    telegramButton: string;
    notSelected: string;
    closeAria: string;
    prevMonth: string;
    nextMonth: string;
    clear: string;
    today: string;
    unknownError: string;
  };
  privacy: {
    title: string;
    metaTitle: string;
    metaDescription: string;
    sections: Array<{
      title: string;
      content: string;
    }>;
  };
  terms: {
    title: string;
    metaTitle: string;
    metaDescription: string;
    sections: Array<{
      title: string;
      content: string;
    }>;
  };
  notFound: {
    title: string;
    message: string;
    backHome: string;
  };
  languageSwitcher: {
    ru: string;
    en: string;
    uz: string;
  };
  languagePrompt: {
    title: string;
    subtitle: string;
    continueCurrent: string;
  };
}
