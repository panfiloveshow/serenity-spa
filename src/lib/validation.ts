import { z } from 'zod';

// Name validation: letters (Cyrillic/Latin/Uzbek), spaces, hyphens, apostrophe-like chars (oʻ, gʻ)
const nameRegex = /^[а-яА-ЯёЁa-zA-Zʻʼʽ''`\s\-]+$/;

export const bookingSchema = z.object({
  name: z
    .string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(100, 'Имя слишком длинное')
    .regex(nameRegex, 'Имя может содержать только буквы, пробелы и дефисы')
    .transform((val) => val.trim().replace(/\s+/g, ' ')), // Normalize spaces
  
  phone: z
    .string()
    .min(1, 'Телефон обязателен')
    .max(30, 'Телефон слишком длинный'),
  
  service: z
    .string()
    .max(200, 'Некорректная услуга')
    .optional(),
  
  date: z
    .string()
    .optional(),

  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Некорректное время')
    .optional()
    .or(z.literal('')),
  
  comment: z
    .string()
    .max(500, 'Комментарий слишком длинный (макс. 500 символов)')
    .optional(),
  
  // Anti-bot fields
  website: z
    .string()
    .optional(), // Honeypot field - should be empty
  
  formOpenedAt: z
    .number()
    .optional(), // Timestamp when form was opened
  
  // Page locale at submission time (uz/ru/en)
  pageLocale: z.enum(['uz', 'ru', 'en']).optional(),

  visitor: z.object({
    referrer: z.string(),
    utm_source: z.string(),
    utm_medium: z.string(),
    utm_campaign: z.string(),
    utm_content: z.string(),
    utm_term: z.string(),
    // Google Ads click ID + network source (gad_source=1|5|7|...)
    gclid: z.string().optional(),
    gad_source: z.string().optional(),
    gad_campaignid: z.string().optional(),
    device: z.string(),
    browser: z.string(),
    os: z.string(),
    screenResolution: z.string(),
    language: z.string(),
    currentPage: z.string(),
    landingPage: z.string(),
    pageTitle: z.string(),
    visitTimestamp: z.string(),
    sessionDuration: z.string(),
    sessionSeconds: z.number().optional(),
    pagesViewed: z.number(),
    trafficSource: z.string(),
  }),
});

export type BookingData = z.infer<typeof bookingSchema>;

export function validateName(name: string): { valid: boolean; error?: string } {
  const trimmed = name.trim();
  
  if (trimmed.length < 2) {
    return { valid: false, error: 'Имя должно содержать минимум 2 символа' };
  }
  
  if (trimmed.length > 100) {
    return { valid: false, error: 'Имя слишком длинное' };
  }
  
  if (!nameRegex.test(trimmed)) {
    return { valid: false, error: 'Имя может содержать только буквы, пробелы и дефисы' };
  }
  
  return { valid: true };
}

export function detectBot(data: {
  website?: string;
  formOpenedAt?: number;
  submittedAt: number;
}): { isBot: boolean; reason?: string; formFillDurationMs: number | null } {
  const formFillDurationMs = typeof data.formOpenedAt === 'number' && data.formOpenedAt > 0
    ? data.submittedAt - data.formOpenedAt
    : null;

  // Honeypot check — instant hard reject
  if (data.website && data.website.trim() !== '') {
    return { isBot: true, reason: 'honeypot_filled', formFillDurationMs };
  }

  // Extreme speed (<1s) — almost certainly bot, hard reject
  if (formFillDurationMs !== null && formFillDurationMs < 1000) {
    return { isBot: true, reason: 'submitted_too_fast', formFillDurationMs };
  }

  return { isBot: false, formFillDurationMs };
}
