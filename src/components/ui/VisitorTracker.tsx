'use client';

import { useEffect } from 'react';
import { initVisitorTracking } from '@/lib/visitor-tracker';

export function VisitorTracker() {
  useEffect(() => {
    const run = () => initVisitorTracking();
    const win = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof win.requestIdleCallback === 'function') {
      const idleId = win.requestIdleCallback(run, { timeout: 1500 });

      return () => {
        win.cancelIdleCallback?.(idleId);
      };
    }

    const timeoutId = globalThis.setTimeout(run, 300);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
