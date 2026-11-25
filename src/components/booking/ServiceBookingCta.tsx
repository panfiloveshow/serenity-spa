'use client';

import { BookingProvider, useBooking } from '@/lib/booking-context';
import { LazyBookingModal } from '@/components/ui/LazyBookingModal';
import { VisitorTracker } from '@/components/ui/VisitorTracker';

function BookingButton({ label, service }: { label: string; service: string }) {
  const { openBooking } = useBooking();
  return <button type="button" onClick={() => openBooking({ type: 'service', name: service })}
    className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#C8956C] px-7 text-sm font-bold text-[#152E4A] shadow-[0_18px_42px_rgba(200,149,108,0.18)] transition hover:-translate-y-0.5 hover:bg-[#D4A574]">
    {label}
  </button>;
}

export function ServiceBookingCta(props: { label: string; service: string }) {
  return <BookingProvider><VisitorTracker /><BookingButton {...props} /><LazyBookingModal /></BookingProvider>;
}
