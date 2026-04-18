'use client';

import Link from 'next/link';
import { useLang } from '@/lib/lang-context';

export default function NotFound() {
  const { locale, dictionary } = useLang();
  const { notFound } = dictionary;

  return (
    <main className="min-h-screen bg-[#152E4A] text-[#E8DFD0] flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-light mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-light mb-4">{notFound.title}</h2>
        <p className="text-[#E8DFD0]/75 mb-8">{notFound.message}</p>
        <Link
          href={`/${locale}`}
          className="inline-block px-6 py-3 bg-[#C8956C] text-white rounded-lg hover:bg-[#B8855C] transition-colors"
        >
          {notFound.backHome}
        </Link>
      </div>
    </main>
  );
}
