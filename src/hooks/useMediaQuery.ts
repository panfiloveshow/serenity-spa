'use client';

import { useSyncExternalStore } from 'react';

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}

export function useMediaQuery(query: string, serverFallback = false): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === 'undefined') {
        return () => {};
      }

      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', onStoreChange);

      return () => {
        mediaQuery.removeEventListener('change', onStoreChange);
      };
    },
    () => {
      if (typeof window === 'undefined') {
        return serverFallback;
      }

      return window.matchMedia(query).matches;
    },
    () => serverFallback
  );
}
