'use client';

import { useEffect, useRef, useState } from 'react';

const OSM_EMBED_SRC =
  'https://www.openstreetmap.org/export/embed.html?bbox=69.2717%2C41.3066%2C69.2877%2C41.3156&layer=mapnik&marker=41.3111%2C69.2797';

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
