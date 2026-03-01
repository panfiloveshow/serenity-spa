import type { Metadata } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  preload: true,
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "cyrillic"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Serenity Spa — Премиальный спа-центр в Ташкенте",
  description: "Serenity Spa — премиальный оздоровительный центр в Ташкенте. Массаж, пилинги, обёртывания, бассейн, сауна, хаммам, джакузи. Абонементы и программы для восстановления тела и разума.",
  keywords: ["спа Ташкент", "массаж Ташкент", "спа центр", "Serenity Spa", "оздоровительный центр", "сауна", "хаммам", "бассейн", "пилинг", "обёртывание", "spa Tashkent"],
  authors: [{ name: "Serenity Spa" }],
  metadataBase: new URL("https://serenityspa.uz"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://serenityspa.uz",
    siteName: "Serenity Spa",
    title: "Serenity Spa — Премиальный спа-центр в Ташкенте",
    description: "Премиальный оздоровительный центр в Ташкенте. Массаж, пилинги, обёртывания, бассейн, сауна, хаммам, джакузи.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Serenity Spa — Премиальный спа-центр в Ташкенте",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Serenity Spa — Премиальный спа-центр в Ташкенте",
    description: "Премиальный оздоровительный центр в Ташкенте. Массаж, пилинги, обёртывания, бассейн, сауна, хаммам, джакузи.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.telegram.org" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HealthAndBeautyBusiness",
              name: "Serenity Spa",
              description: "Премиальный оздоровительный центр в Ташкенте. Массаж, пилинги, обёртывания, бассейн, сауна, хаммам, джакузи.",
              url: "https://serenityspa.uz",
              image: "https://serenityspa.uz/opengraph-image",
              telephone: "+998712108895",
              address: {
                "@type": "PostalAddress",
                streetAddress: "ул. Ислама Каримова 2, 3-4 этаж, Укчи 1",
                postalCode: "100027",
                addressLocality: "Ташкент",
                addressCountry: "UZ",
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                opens: "07:00",
                closes: "23:00",
              },
              sameAs: [
                "https://www.instagram.com/serenityspa_tashkent",
                "https://t.me/Serenity_Spa",
              ],
              priceRange: "$$",
            }),
          }}
        />
      </head>
      <body className={`${manrope.variable} ${cormorant.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
