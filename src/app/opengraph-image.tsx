import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Serenity Spa — Премиальный спа-центр в Ташкенте';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#152E4A',
          position: 'relative',
        }}
      >
        {/* Decorative top accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #C8956C, transparent)',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          {/* Brand name */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 300,
              color: '#E8DFD0',
              letterSpacing: '12px',
              textTransform: 'uppercase',
            }}
          >
            SERENITY
          </div>

          {/* Spa subtitle */}
          <div
            style={{
              fontSize: '48px',
              fontWeight: 300,
              color: '#C8956C',
              fontStyle: 'italic',
              marginTop: '-8px',
            }}
          >
            Spa
          </div>

          {/* Divider */}
          <div
            style={{
              width: '80px',
              height: '1px',
              backgroundColor: '#C8956C',
              marginTop: '16px',
              marginBottom: '16px',
              opacity: 0.6,
            }}
          />

          {/* Description */}
          <div
            style={{
              fontSize: '22px',
              fontWeight: 400,
              color: '#7A8BA8',
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}
          >
            Премиальный спа-центр
          </div>

          {/* Location */}
          <div
            style={{
              fontSize: '16px',
              fontWeight: 400,
              color: '#7A8BA8',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              opacity: 0.7,
            }}
          >
            Ташкент
          </div>
        </div>

        {/* Decorative bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #C8956C, transparent)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
