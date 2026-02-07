'use client';

/**
 * Botanical SVG overlay for section backgrounds.
 * Renders decorative plant elements along edges with low opacity.
 * Variants control which edges get decoration.
 */

type Variant = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right' | 'full';

interface BotanicalOverlayProps {
  variant?: Variant;
  opacity?: number;
}

const POSITIONS: Record<string, { className: string; style: React.CSSProperties }[]> = {
  'top-left': [
    { className: 'absolute -top-[10%] -left-[10%] w-[50vw] h-[50vh]', style: { transform: 'rotate(-20deg)' } },
  ],
  'top-right': [
    { className: 'absolute -top-[12%] -right-[8%] w-[45vw] h-[45vh]', style: { transform: 'rotate(30deg) scaleX(-1)' } },
  ],
  'bottom-left': [
    { className: 'absolute -bottom-[10%] -left-[8%] w-[45vw] h-[45vh]', style: { transform: 'rotate(40deg) scaleY(-1)' } },
  ],
  'bottom-right': [
    { className: 'absolute -bottom-[8%] -right-[10%] w-[40vw] h-[40vh]', style: { transform: 'rotate(-25deg) scale(-1,-1)' } },
  ],
  left: [
    { className: 'absolute -top-[10%] -left-[10%] w-[50vw] h-[50vh]', style: { transform: 'rotate(-20deg)' } },
    { className: 'absolute -bottom-[10%] -left-[8%] w-[45vw] h-[45vh]', style: { transform: 'rotate(40deg) scaleY(-1)' } },
  ],
  right: [
    { className: 'absolute -top-[12%] -right-[8%] w-[45vw] h-[45vh]', style: { transform: 'rotate(30deg) scaleX(-1)' } },
    { className: 'absolute -bottom-[8%] -right-[10%] w-[40vw] h-[40vh]', style: { transform: 'rotate(-25deg) scale(-1,-1)' } },
  ],
  full: [
    { className: 'absolute -top-[10%] -left-[10%] w-[50vw] h-[50vh]', style: { transform: 'rotate(-20deg)' } },
    { className: 'absolute -top-[12%] -right-[8%] w-[45vw] h-[45vh]', style: { transform: 'rotate(30deg) scaleX(-1)' } },
    { className: 'absolute -bottom-[10%] -left-[8%] w-[45vw] h-[45vh]', style: { transform: 'rotate(40deg) scaleY(-1)' } },
    { className: 'absolute -bottom-[8%] -right-[10%] w-[40vw] h-[40vh]', style: { transform: 'rotate(-25deg) scale(-1,-1)' } },
  ],
};

export function BotanicalOverlay({ variant = 'full', opacity = 0.08 }: BotanicalOverlayProps) {
  const items = POSITIONS[variant] || POSITIONS.full;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-20">
      {items.map((item, i) => (
        <div key={i} className={item.className} style={{ ...item.style, opacity }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/botanical-pattern.svg" alt="" className="w-full h-full object-contain" draggable={false} />
        </div>
      ))}
    </div>
  );
}
