'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type BookingType = 'service' | 'package' | 'membership' | 'general';

export interface BookingSelection {
  type: BookingType;
  category?: string;   // e.g. "Массажи", "Уходы за телом"
  name: string;        // e.g. "Традиционный балийский 60 мин"
  price?: string;
  duration?: string;
}

interface BookingContextType {
  isOpen: boolean;
  selection: BookingSelection | null;
  openBooking: (selection?: BookingSelection) => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selection, setSelection] = useState<BookingSelection | null>(null);

  const openBooking = useCallback((sel?: BookingSelection) => {
    setSelection(sel ?? null);
    setIsOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setIsOpen(false);
    // Delay clearing selection so exit animation can show it
    setTimeout(() => setSelection(null), 400);
  }, []);

  return (
    <BookingContext.Provider value={{ isOpen, selection, openBooking, closeBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
