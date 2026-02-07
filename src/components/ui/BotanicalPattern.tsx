'use client';

import { motion } from 'framer-motion';

interface BotanicalPatternProps {
  opacity?: number;
  color?: string;
  animated?: boolean;
}

export function BotanicalPattern({ 
  opacity = 0.15, 
  color = '#7A8BA8',
  animated = true 
}: BotanicalPatternProps) {
  const items = [
    // Top-left cluster: curved branch + lotus
    { type: 'olive', x: '2%', y: '2%', rotate: 20, scale: 1.0 },
    { type: 'lotus', x: '8%', y: '22%', rotate: -10, scale: 1.1 },
    // Top-center: small leaf branch
    { type: 'leaf-branch', x: '35%', y: '5%', rotate: -25, scale: 0.8 },
    // Top-right: rosemary
    { type: 'rosemary', x: '72%', y: '0%', rotate: -40, scale: 1.0 },
    { type: 'rosemary', x: '88%', y: '8%', rotate: -55, scale: 0.85 },
    // Mid-left: small branch
    { type: 'leaf-branch', x: '0%', y: '48%', rotate: 30, scale: 0.7 },
    // Center: lotus (subtle)
    { type: 'lotus', x: '42%', y: '35%', rotate: 5, scale: 0.55 },
    // Mid-right: olive branch
    { type: 'olive', x: '78%', y: '40%', rotate: -15, scale: 0.7 },
    // Bottom-left: lotus large
    { type: 'lotus', x: '5%', y: '68%', rotate: 15, scale: 1.0 },
    // Bottom-center: leaf branch
    { type: 'leaf-branch', x: '38%', y: '78%', rotate: 35, scale: 0.75 },
    // Bottom-right: rosemary + lotus
    { type: 'rosemary', x: '65%', y: '65%', rotate: 10, scale: 0.6 },
    { type: 'lotus', x: '75%', y: '80%', rotate: -20, scale: 0.9 },
    // Extra scattered small elements
    { type: 'leaf-branch', x: '55%', y: '15%', rotate: -40, scale: 0.5 },
    { type: 'olive', x: '20%', y: '50%', rotate: 45, scale: 0.55 },
    { type: 'rosemary', x: '50%', y: '55%', rotate: -30, scale: 0.45 },
    { type: 'leaf-branch', x: '85%', y: '60%', rotate: 20, scale: 0.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: item.x,
            top: item.y,
            opacity,
          }}
          initial={animated ? { opacity: 0, scale: 0.8 } : undefined}
          animate={animated ? { 
            opacity, 
            scale: item.scale,
            rotate: item.rotate,
          } : {
            scale: item.scale,
            rotate: item.rotate,
          }}
          transition={animated ? {
            duration: 1.5,
            delay: i * 0.08,
            ease: [0.22, 1, 0.36, 1],
          } : undefined}
        >
          {item.type === 'lotus' && <LotusFlower color={color} />}
          {item.type === 'leaf-branch' && <LeafBranch color={color} />}
          {item.type === 'rosemary' && <Rosemary color={color} />}
          {item.type === 'olive' && <OliveBranch color={color} />}
        </motion.div>
      ))}
    </div>
  );
}

function LotusFlower({ color }: { color: string }) {
  return (
    <svg width="160" height="140" viewBox="0 0 160 140" fill="none">
      {/* Center petal */}
      <path d="M80 120 C78 100 72 75 70 55 C68 40 72 25 80 20 C88 25 92 40 90 55 C88 75 82 100 80 120Z" 
        stroke={color} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* Inner left petal */}
      <path d="M80 120 C72 105 55 80 45 60 C38 48 40 32 50 28 C58 30 65 42 68 55 C74 78 78 100 80 120Z" 
        stroke={color} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* Inner right petal */}
      <path d="M80 120 C88 105 105 80 115 60 C122 48 120 32 110 28 C102 30 95 42 92 55 C86 78 82 100 80 120Z" 
        stroke={color} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* Outer left petal */}
      <path d="M80 120 C68 108 42 88 28 72 C18 60 15 42 22 32 C32 28 42 38 48 50 C60 72 72 98 80 120Z" 
        stroke={color} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.8" />
      {/* Outer right petal */}
      <path d="M80 120 C92 108 118 88 132 72 C142 60 145 42 138 32 C128 28 118 38 112 50 C100 72 88 98 80 120Z" 
        stroke={color} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.8" />
      {/* Far outer left petal */}
      <path d="M80 120 C65 112 35 95 18 82 C6 72 2 55 8 42 C16 36 28 44 36 56 C50 76 68 100 80 120Z" 
        stroke={color} strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* Far outer right petal */}
      <path d="M80 120 C95 112 125 95 142 82 C154 72 158 55 152 42 C144 36 132 44 124 56 C110 76 92 100 80 120Z" 
        stroke={color} strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* Petal veins */}
      <path d="M80 115 C79 95 76 70 75 50" stroke={color} strokeWidth="0.4" fill="none" opacity="0.3" />
      <path d="M80 115 C81 95 84 70 85 50" stroke={color} strokeWidth="0.4" fill="none" opacity="0.3" />
      <path d="M80 115 C73 100 58 78 50 60" stroke={color} strokeWidth="0.4" fill="none" opacity="0.25" />
      <path d="M80 115 C87 100 102 78 110 60" stroke={color} strokeWidth="0.4" fill="none" opacity="0.25" />
    </svg>
  );
}

function LeafBranch({ color }: { color: string }) {
  return (
    <svg width="140" height="100" viewBox="0 0 140 100" fill="none">
      {/* Main curved stem */}
      <path d="M5 85 C20 75 40 60 60 48 C80 36 100 28 130 15" 
        stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Paired leaves along stem — left side */}
      <path d="M25 76 C20 68 14 62 10 66 C8 72 14 76 25 76Z" 
        stroke={color} strokeWidth="0.7" fill="none" strokeLinecap="round" />
      <path d="M45 64 C38 56 30 50 27 55 C26 62 34 64 45 64Z" 
        stroke={color} strokeWidth="0.7" fill="none" strokeLinecap="round" />
      <path d="M65 50 C58 42 50 36 47 41 C46 48 54 52 65 50Z" 
        stroke={color} strokeWidth="0.7" fill="none" strokeLinecap="round" />
      <path d="M88 38 C82 30 74 24 71 29 C70 36 78 40 88 38Z" 
        stroke={color} strokeWidth="0.7" fill="none" strokeLinecap="round" />
      <path d="M110 26 C104 18 96 12 93 17 C92 24 100 28 110 26Z" 
        stroke={color} strokeWidth="0.7" fill="none" strokeLinecap="round" />
      {/* Paired leaves — right side */}
      <path d="M25 76 C28 66 34 58 38 62 C40 68 34 74 25 76Z" 
        stroke={color} strokeWidth="0.7" fill="none" strokeLinecap="round" />
      <path d="M45 64 C50 54 58 46 60 51 C60 58 54 62 45 64Z" 
        stroke={color} strokeWidth="0.7" fill="none" strokeLinecap="round" />
      <path d="M65 50 C72 40 80 34 81 39 C80 46 74 50 65 50Z" 
        stroke={color} strokeWidth="0.7" fill="none" strokeLinecap="round" />
      <path d="M88 38 C95 28 103 22 104 27 C103 34 96 38 88 38Z" 
        stroke={color} strokeWidth="0.7" fill="none" strokeLinecap="round" />
      <path d="M110 26 C117 16 125 10 126 15 C125 22 118 26 110 26Z" 
        stroke={color} strokeWidth="0.7" fill="none" strokeLinecap="round" />
      {/* Leaf veins */}
      <path d="M25 76 L16 66" stroke={color} strokeWidth="0.3" fill="none" opacity="0.4" />
      <path d="M45 64 L35 54" stroke={color} strokeWidth="0.3" fill="none" opacity="0.4" />
      <path d="M65 50 L55 40" stroke={color} strokeWidth="0.3" fill="none" opacity="0.4" />
      <path d="M88 38 L78 28" stroke={color} strokeWidth="0.3" fill="none" opacity="0.4" />
    </svg>
  );
}

function Rosemary({ color }: { color: string }) {
  return (
    <svg width="50" height="150" viewBox="0 0 50 150" fill="none">
      {/* Main stem — slightly curved */}
      <path d="M25 145 C24 120 23 90 24 60 C25 40 26 20 27 5" 
        stroke={color} strokeWidth="0.9" fill="none" strokeLinecap="round" />
      {/* Needle pairs — alternating left/right, getting smaller toward tip */}
      <path d="M24 130 C18 125 12 122 10 126" stroke={color} strokeWidth="0.5" fill="none" strokeLinecap="round" />
      <path d="M25 130 C30 124 36 120 38 124" stroke={color} strokeWidth="0.5" fill="none" strokeLinecap="round" />
      <path d="M24 118 C17 113 10 110 8 114" stroke={color} strokeWidth="0.5" fill="none" strokeLinecap="round" />
      <path d="M25 118 C31 112 38 108 40 112" stroke={color} strokeWidth="0.5" fill="none" strokeLinecap="round" />
      <path d="M24 106 C18 101 12 98 10 102" stroke={color} strokeWidth="0.5" fill="none" strokeLinecap="round" />
      <path d="M25 106 C30 100 36 96 38 100" stroke={color} strokeWidth="0.5" fill="none" strokeLinecap="round" />
      <path d="M24 94 C19 89 14 86 12 90" stroke={color} strokeWidth="0.5" fill="none" strokeLinecap="round" />
      <path d="M25 94 C30 88 35 84 37 88" stroke={color} strokeWidth="0.5" fill="none" strokeLinecap="round" />
      <path d="M24 82 C20 77 16 74 14 78" stroke={color} strokeWidth="0.5" fill="none" strokeLinecap="round" />
      <path d="M25 82 C29 76 33 72 35 76" stroke={color} strokeWidth="0.5" fill="none" strokeLinecap="round" />
      <path d="M24 70 C21 65 18 62 16 66" stroke={color} strokeWidth="0.5" fill="none" strokeLinecap="round" />
      <path d="M25 70 C28 64 31 60 33 64" stroke={color} strokeWidth="0.5" fill="none" strokeLinecap="round" />
      <path d="M25 58 C22 53 19 50 18 54" stroke={color} strokeWidth="0.45" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M25 58 C28 52 31 48 32 52" stroke={color} strokeWidth="0.45" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M25 46 C23 41 20 38 19 42" stroke={color} strokeWidth="0.4" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M26 46 C28 40 30 36 31 40" stroke={color} strokeWidth="0.4" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M26 34 C24 29 22 26 21 30" stroke={color} strokeWidth="0.35" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M26 34 C28 28 29 24 30 28" stroke={color} strokeWidth="0.35" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M26 22 C25 17 24 14 23 18" stroke={color} strokeWidth="0.3" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M27 22 C28 16 29 12 30 16" stroke={color} strokeWidth="0.3" fill="none" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function OliveBranch({ color }: { color: string }) {
  return (
    <svg width="160" height="120" viewBox="0 0 160 120" fill="none">
      {/* Main curved stem */}
      <path d="M10 100 C30 90 55 72 80 55 C105 38 130 25 150 15" 
        stroke={color} strokeWidth="0.9" fill="none" strokeLinecap="round" />
      {/* Leaves — elongated ovals along stem */}
      <ellipse cx="28" cy="90" rx="5" ry="12" transform="rotate(-50 28 90)" 
        stroke={color} strokeWidth="0.6" fill="none" />
      <ellipse cx="35" cy="82" rx="5" ry="12" transform="rotate(40 35 82)" 
        stroke={color} strokeWidth="0.6" fill="none" />
      <ellipse cx="50" cy="72" rx="5" ry="11" transform="rotate(-45 50 72)" 
        stroke={color} strokeWidth="0.6" fill="none" />
      <ellipse cx="58" cy="64" rx="5" ry="11" transform="rotate(35 58 64)" 
        stroke={color} strokeWidth="0.6" fill="none" />
      <ellipse cx="75" cy="56" rx="4.5" ry="10" transform="rotate(-40 75 56)" 
        stroke={color} strokeWidth="0.6" fill="none" />
      <ellipse cx="84" cy="48" rx="4.5" ry="10" transform="rotate(30 84 48)" 
        stroke={color} strokeWidth="0.6" fill="none" />
      <ellipse cx="100" cy="40" rx="4" ry="9" transform="rotate(-35 100 40)" 
        stroke={color} strokeWidth="0.6" fill="none" opacity="0.8" />
      <ellipse cx="110" cy="32" rx="4" ry="9" transform="rotate(25 110 32)" 
        stroke={color} strokeWidth="0.6" fill="none" opacity="0.8" />
      <ellipse cx="125" cy="25" rx="3.5" ry="8" transform="rotate(-30 125 25)" 
        stroke={color} strokeWidth="0.5" fill="none" opacity="0.7" />
      <ellipse cx="135" cy="20" rx="3.5" ry="8" transform="rotate(20 135 20)" 
        stroke={color} strokeWidth="0.5" fill="none" opacity="0.7" />
      {/* Leaf midribs */}
      <path d="M28 90 L22 80" stroke={color} strokeWidth="0.3" fill="none" opacity="0.3" />
      <path d="M50 72 L44 62" stroke={color} strokeWidth="0.3" fill="none" opacity="0.3" />
      <path d="M75 56 L69 46" stroke={color} strokeWidth="0.3" fill="none" opacity="0.3" />
      <path d="M100 40 L94 30" stroke={color} strokeWidth="0.3" fill="none" opacity="0.3" />
    </svg>
  );
}
