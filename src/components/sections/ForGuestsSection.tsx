import { getDictionary } from '@/lib/i18n';
import { approximateUsd, dayPassRows, formatPrice, serviceRows, USD_REFERENCE } from '@/lib/catalog';
import { BUSINESS_CONTACT } from '@/lib/business';

export async function ForGuestsSection() {
  const dictionary = await getDictionary('en');
  const rows = [...dayPassRows(dictionary, 'en'), ...serviceRows(dictionary).slice(0, 2)];
  return <section id="hotel-guests" aria-labelledby="hotel-guests-title" className="bg-[#152E4A] px-5 py-16 text-[#E8DFD0] md:px-12">
    <div className="mx-auto max-w-6xl">
      <h2 id="hotel-guests-title" className="text-3xl font-light md:text-4xl">For Hilton guests and visitors</h2>
      <p className="mt-5 max-w-3xl text-base leading-8 text-[#A0B0C8]">Find Serenity Spa on the 4th floor of Hilton Tashkent City, through the main hotel entrance. Advance booking is required for all guests. The pool, gym, jacuzzi, Finnish and steam saunas are complimentary for guests staying at the hotel and open 07:00–23:00. Pool and sauna access is charged separately from individual massages at the standard day-pass rate.</p>
      <div className="mt-7 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Selected spa prices in UZS with approximate USD comparisons</caption>
          <thead><tr className="border-b border-[#7A8BA8]/20 text-[#C8956C]"><th scope="col" className="py-3 pr-4">Experience</th><th scope="col" className="py-3 pr-4">Duration / access</th><th scope="col" className="py-3 pr-4">UZS</th><th scope="col" className="py-3">USD, approx.</th></tr></thead>
          <tbody>{rows.map(row => <tr key={`${row.name}-${row.duration}`} className="border-b border-[#7A8BA8]/10"><th scope="row" className="py-4 pr-4 font-medium">{row.name}</th><td className="py-4 pr-4 text-[#A0B0C8]">{row.duration}</td><td className="whitespace-nowrap py-4 pr-4">{formatPrice(row.price, 'en')}</td><td className="py-4">${approximateUsd(row.price)}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="mt-4 text-xs leading-6 text-[#A0B0C8]">USD figures are for comparison only, using 1 USD = {formatPrice(USD_REFERENCE.uzsPerUsd, 'en')} UZS on {USD_REFERENCE.date} (<a className="underline" href={USD_REFERENCE.source} target="_blank" rel="noopener noreferrer">Central Bank of Uzbekistan</a>). Prices are in UZS. {BUSINESS_CONTACT.acceptedCards.join(', ')} are accepted; ask the administrator about foreign-card, online and advance payments.</p>
      <p className="mt-5 text-sm leading-7 text-[#A0B0C8]">Towels, bathrobes and slippers are provided. Parking costs {formatPrice(BUSINESS_CONTACT.parkingPrice, 'en')} UZS for {BUSINESS_CONTACT.parkingHours} hours.</p>
      <p className="mt-5 text-sm leading-7 text-[#A0B0C8]">No Uzbek phone number? Leave your WhatsApp number, Telegram username or email in the booking form. Contact us on <a href={BUSINESS_CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-[#C8956C] underline">WhatsApp: {BUSINESS_CONTACT.whatsappDisplay}</a>, <a href={BUSINESS_CONTACT.telegramUrl} className="text-[#C8956C] underline">Telegram: @Serenity_Spa</a> or <a href={`mailto:${BUSINESS_CONTACT.email}`} className="text-[#C8956C] underline">{BUSINESS_CONTACT.email}</a>.</p>
    </div>
  </section>;
}
