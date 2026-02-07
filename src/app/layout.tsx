import type { Metadata } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Serenity Spa — Премиальное пространство гармонии",
  description: "Пространство абсолютной гармонии тела и разума. Массаж, пилинги, обёртывания, бассейн, сауна, джакузи.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${manrope.variable} ${cormorant.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
