'use client';

import { useEffect, useRef, useState } from 'react';
import { BUSINESS_CONTACT } from '@/lib/business';

const { latitude, longitude } = BUSINESS_CONTACT;
const OSM_EMBED_SRC = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.004}%2C${latitude - 0.0025}%2C${longitude + 0.004}%2C${latitude + 0.0025}&layer=mapnik&marker=${latitude}%2C${longitude}`;

type LazyOsmEmbedProps = {
  title: string;
  className?: string;
};

export function LazyOsmEmbed({ title, className }: LazyOsmEmbedProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} className={className}>
      {mount ? (
        <iframe
          src={OSM_EMBED_SRC}
          className="w-full h-full absolute inset-0 pointer-events-none"
          style={{ border: 0, filter: 'brightness(0.25) contrast(1.3) saturate(0.2) hue-rotate(190deg) sepia(0.15)' }}
          loading="lazy"
          title={title}
        />
      ) : null}
    </div>
  );
}
