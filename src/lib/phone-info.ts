export interface PhoneInfo {
  valid: boolean;
  digits: string;
  formatted: string;
  countryCode: string;
  operatorHint: string;
  isMobile: boolean;
  suspiciousPattern: boolean;
  patternReason?: string;
}

// UZ mobile operator prefixes (historical — MNP means it's a hint, not guarantee)
const UZ_OPERATOR_PREFIXES: Record<string, string> = {
  '90': 'Beeline UZ',
  '91': 'Beeline UZ',
  '93': 'Ucell',
  '94': 'Ucell',
  '95': 'Ucell',
  '97': 'Mobiuz',
  '98': 'Mobiuz',
  '99': 'Beeline UZ',
  '33': 'Humans',
  '50': 'Perfectum / UzMobile',
  '77': 'UzMobile',
  '88': 'UzMobile',
  '20': 'Мобильный оператор UZ',
};

function detectPattern(digits: string): { suspicious: boolean; reason?: string } {
  const subscriber = digits.slice(3); // after 998

  // All same digit
  if (/^(\d)\1+$/.test(subscriber)) {
    return { suspicious: true, reason: 'все цифры одинаковые' };
  }

  // Sequential ascending (1234567, 12345678)
  if (/^(0?1234567(89)?|23456789)$/.test(subscriber)) {
    return { suspicious: true, reason: 'последовательность 1234567...' };
  }

  // Pattern like 33 333 33 33 — operator code + same digit repeated
  const tail = subscriber.slice(2);
  if (tail.length > 0 && /^(\d)\1+$/.test(tail)) {
    return { suspicious: true, reason: 'однотипные цифры в номере' };
  }

  // Pattern like ABAB ABAB
  if (/^(\d\d)\1{3,}$/.test(subscriber)) {
    return { suspicious: true, reason: 'повторяющийся паттерн' };
  }

  return { suspicious: false };
}

export function analyzePhone(raw: string): PhoneInfo {
  const value = (raw ?? '').trim().replace(/^00/, '+');
  let digits = value.replace(/\D/g, '');
  const safeCharacters = /^\+?[1-9][\d\s().-]*$/.test(value);
  // Common local input, including an accidental leading + before the operator code.
  if (safeCharacters && digits.length === 9 && UZ_OPERATOR_PREFIXES[digits.slice(0, 2)]) {
    digits = `998${digits}`;
  }
  const isUzbek = digits.startsWith('998');
  const valid = safeCharacters && (isUzbek
    ? digits.length === 12
    : value.startsWith('+') && digits.length >= 10 && digits.length <= 15);

  if (!valid || !isUzbek) {
    return {
      valid,
      digits,
      formatted: valid ? `+${digits}` : raw,
      countryCode: valid ? 'INTL' : '',
      operatorHint: '',
      isMobile: false,
      suspiciousPattern: false,
    };
  }

  const prefix = digits.slice(3, 5);
  const operatorHint = UZ_OPERATOR_PREFIXES[prefix] ?? '';
  const isMobile = Boolean(operatorHint);

  const pattern = detectPattern(digits);

  const formatted = `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`;

  return {
    valid: true,
    digits,
    formatted,
    countryCode: 'UZ',
    operatorHint,
    isMobile,
    suspiciousPattern: pattern.suspicious,
    patternReason: pattern.reason,
  };
}

/** Canonical value for the API, notifications, history matching and integrations. */
export function normalizePhone(raw: string): string {
  const info = analyzePhone(raw);
  return info.valid ? `+${info.digits}` : raw.trim();
}
