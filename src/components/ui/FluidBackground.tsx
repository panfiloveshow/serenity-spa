'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';

export function FluidBackground() {
  const isMobile = useMediaQuery('(max-width: 767px)');

  // On mobile: plain background color, no animated blobs, no SVG filters
  if (isMobile) {
    return <div className="fixed inset-0 z-0 pointer-events-none bg-[#152E4A]" />;
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#152E4A]">
      {/* Static atmosphere: keeps the brand depth without a perpetual SVG filter + JS animation loop. */}
      <div className="absolute left-[14%] top-[14%] h-[480px] w-[480px] rounded-full bg-[#234A72]/32 blur-[96px] mix-blend-screen" />
      <div className="absolute bottom-[12%] right-[12%] h-[560px] w-[560px] rounded-full bg-[#263A5E]/24 blur-[120px] mix-blend-screen" />
      <div className="absolute left-[48%] top-[36%] h-[340px] w-[340px] rounded-full bg-[#C8956C]/10 blur-[80px] mix-blend-overlay" />
      
      {/* Grain Overlay (already in globals, but ensuring layer order) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
    </div>
  );
}
