import type { Locale } from '@/types/i18n';
import { BUSINESS_CONTACT } from '@/lib/business';
import { getSeoContent } from '@/lib/seo';

const TITLES = { ru: 'Условия посещения', en: 'Plan your visit', uz: 'Tashrif shartlari' };

export function VisitInfoSection({ lang }: { lang: Locale }) {
  const content = getSeoContent(lang);
  const questions = [0, 2, 3, 5, 6].map(index => content.faqs[index]);
  const links = [
    { label: `WhatsApp: ${BUSINESS_CONTACT.whatsappDisplay}`, href: BUSINESS_CONTACT.whatsappUrl },
    { label: 'Telegram: @Serenity_Spa', href: BUSINESS_CONTACT.telegramUrl },
    { label: BUSINESS_CONTACT.email, href: `mailto:${BUSINESS_CONTACT.email}` },
    { label: 'Google Maps', href: BUSINESS_CONTACT.mapUrl },
    { label: 'Yandex Maps', href: BUSINESS_CONTACT.yandexUrl },
    { label: 'Facebook', href: BUSINESS_CONTACT.facebookUrl },
    { label: 'Tripadvisor', href: BUSINESS_CONTACT.tripadvisorUrl },
  ];
  return (
    <section id="visit-info" aria-labelledby="visit-info-title" className="px-4 pb-16 md:px-6 md:pb-24">
      <div className="mx-auto max-w-7xl rounded-3xl border border-[#7A8BA8]/15 bg-[#102844]/60 p-6 md:p-8">
        <h2 id="visit-info-title" className="text-2xl font-light text-[#E8DFD0]">{TITLES[lang]}</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {questions.map(item => (
            <article key={item.question}>
              <h3 className="text-base font-medium text-[#E8DFD0]">{item.question}</h3>
              <p className="mt-2 text-sm leading-7 text-[#A0B0C8]">{item.answer}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 border-t border-[#7A8BA8]/15 pt-5">
          {links.map(link => <a key={link.label} href={link.href} target={link.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer" className="break-all text-sm text-[#C8956C] underline underline-offset-4">{link.label}</a>)}
        </div>
      </div>
    </section>
  );
}
