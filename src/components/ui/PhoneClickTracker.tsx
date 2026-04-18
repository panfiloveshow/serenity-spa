'use client';

import { useEffect } from 'react';
import { trackPhoneClick } from '@/lib/analytics';

export function PhoneClickTracker() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest('a[href^="tel:"]');
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      event.preventDefault();

      const phone = anchor.getAttribute('href') || '';
      const text = anchor.textContent?.trim() || '';
      const location = anchor.dataset.analyticsLocation || anchor.closest('[id]')?.id || window.location.pathname;

      trackPhoneClick({
        phone,
        location,
        text,
        navigateTo: anchor.href,
      });
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  return null;
}
