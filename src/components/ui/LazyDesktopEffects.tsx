'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const VelocityCursor = dynamic(
  () => import('@/components/ui/VelocityCursor').then((mod) => mod.VelocityCursor),
  { ssr: false }
);

const FluidBackground = dynamic(
  () => import('@/components/ui/FluidBackground').then((mod) => mod.FluidBackground),
  { ssr: false }
);

export function LazyDesktopEffects() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const hasFinePointer = useMediaQuery('(pointer: fine)');
  const [canRenderEffects, setCanRenderEffects] = useState(false);

  useEffect(() => {
    if (!isDesktop) {
      return;
    }

    const win = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof win.requestIdleCallback === 'function') {
      const idleId = win.requestIdleCallback(() => setCanRenderEffects(true), { timeout: 2000 });
      return () => win.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(() => setCanRenderEffects(true), 1200);
    return () => window.clearTimeout(timeoutId);
  }, [isDesktop]);

  if (!isDesktop || !canRenderEffects) {
    return null;
  }

  return (
    <>
      {hasFinePointer ? <VelocityCursor /> : null}
      <FluidBackground />
    </>
  );
}
