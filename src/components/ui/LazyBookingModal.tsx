'use client';

import dynamic from 'next/dynamic';
import { useBooking } from '@/lib/booking-context';

const BookingModal = dynamic(
  () => import('@/components/ui/BookingModal').then((mod) => mod.BookingModal),
  { ssr: false }
);

export function LazyBookingModal() {
  const { isOpen } = useBooking();

  if (!isOpen) {
    return null;
  }

  return <BookingModal />;
}
