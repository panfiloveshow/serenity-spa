'use client';

/**
 * BotanicalLayer — a single absolute-positioned layer that spans the entire page height.
 * Botanical SVG elements are placed at specific vertical positions along the edges.
 * When a lotus sits at a section boundary, the top half is visible in one section
 * and the bottom half reveals as you scroll into the next section — seamless continuity.
 *
 * This component must be placed inside a relative wrapper that contains all sections,
 * so it shares the same scroll context and stretches to the full page height.
 */

/* eslint-disable @next/next/no-img-element */

const BOTANICAL_ELEMENTS = [
  // === Section 1 boundary (Hero → Infrastructure) ===
  { top: '90vh', left: '-6%', width: '35vw', rotate: -15, mirror: false, opacity: 0.07 },
  { top: '95vh', right: '-4%', width: '28vw', rotate: 20, mirror: true, opacity: 0.06 },

  // === Section 2 area (Infrastructure) — left edge ===
  { top: '140vh', left: '-8%', width: '30vw', rotate: 35, mirror: false, opacity: 0.06 },

  // === Section 2→3 boundary (Infrastructure → Services) ===
  { top: '195vh', right: '-5%', width: '32vw', rotate: -25, mirror: true, opacity: 0.07 },
  { top: '200vh', left: '-7%', width: '25vw', rotate: 50, mirror: false, opacity: 0.05 },

  // === Section 3 area (Services) — right edge ===
  { top: '260vh', right: '-6%', width: '28vw', rotate: 15, mirror: true, opacity: 0.06 },

  // === Section 3→4 boundary (Services → Packages) ===
  { top: '310vh', left: '-5%', width: '33vw', rotate: -20, mirror: false, opacity: 0.07 },

  // === Section 4 area (Packages) — right ===
  { top: '400vh', right: '-7%', width: '30vw', rotate: 40, mirror: true, opacity: 0.06 },

  // === Section 4→5 boundary (Packages → Membership) ===
  { top: '520vh', left: '-6%', width: '28vw', rotate: -35, mirror: false, opacity: 0.07 },
  { top: '530vh', right: '-4%', width: '25vw', rotate: 10, mirror: true, opacity: 0.05 },

  // === Section 5 area (Membership) — left ===
  { top: '600vh', left: '-8%', width: '32vw', rotate: 25, mirror: false, opacity: 0.06 },

  // === Section 5→6 boundary (Membership → Contacts) ===
  { top: '680vh', right: '-5%', width: '30vw', rotate: -30, mirror: true, opacity: 0.07 },

  // === Section 6 (Contacts) + Footer ===
  { top: '750vh', left: '-6%', width: '28vw', rotate: 45, mirror: false, opacity: 0.06 },
  { top: '800vh', right: '-7%', width: '25vw', rotate: -15, mirror: true, opacity: 0.05 },
];

export function BotanicalLayer() {
  // Hidden on mobile via CSS — avoids loading 14 SVG images on small screens
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-[15] overflow-visible hidden md:block">
      {BOTANICAL_ELEMENTS.map((el, i) => {
        const posStyle: React.CSSProperties = {
          position: 'absolute',
          top: el.top,
          width: el.width,
          aspectRatio: '1',
          opacity: el.opacity,
          transform: `rotate(${el.rotate}deg)${el.mirror ? ' scaleX(-1)' : ''}`,
        };

        if ('left' in el && el.left) posStyle.left = el.left;
        if ('right' in el && el.right) posStyle.right = el.right;

        return (
          <div key={i} style={posStyle}>
            <img
              src="/botanical-pattern.svg"
              alt=""
              aria-hidden="true"
              role="presentation"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
        );
      })}
    </div>
  );
}
