'use client';

import { createContext, useContext } from 'react';
import type { Locale, Dictionary } from '@/types/i18n';

interface LangContextType {
  locale: Locale;
  dictionary: Dictionary;
}

const LangContext = createContext<LangContextType | null>(null);

export function LangProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  return (
    <LangContext.Provider value={{ locale, dictionary }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextType {
  const ctx = useContext(LangContext);
  if (!ctx) {
    throw new Error('useLang must be used within a LangProvider');
  }
  return ctx;
}
