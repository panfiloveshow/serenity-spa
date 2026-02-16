'use client';

import dynamic from 'next/dynamic';
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

  if (!isDesktop) {
    return null;
  }

  return (
    <>
      <VelocityCursor />
      <FluidBackground />
    </>
  );
}
