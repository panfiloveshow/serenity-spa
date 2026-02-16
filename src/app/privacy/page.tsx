import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности | Serenity Spa',
  description: 'Политика конфиденциальности Serenity Spa: какие данные мы собираем, как используем и защищаем персональную информацию клиентов.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#152E4A] text-[#E8DFD0] px-6 py-24">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-light mb-8">Политика конфиденциальности</h1>
        <div className="space-y-6 text-[#E8DFD0]/75 leading-relaxed">
          <p>
            Serenity Spa уважает право каждого посетителя на конфиденциальность. Мы обрабатываем
            персональные данные только для записи на услуги, обратной связи и повышения качества сервиса.
          </p>
          <section>
            <h2 className="text-xl text-[#C8956C] mb-2">1. Какие данные мы собираем</h2>
            <p>
              Имя, номер телефона, выбранная услуга, желаемая дата записи, комментарий к заявке,
              а также технические данные визита (источник перехода, UTM-метки, тип устройства,
              браузер, IP-адрес) для аналитики и обработки заявок.
            </p>
          </section>
          <section>
            <h2 className="text-xl text-[#C8956C] mb-2">2. Цели обработки</h2>
            <p>
              Данные используются для связи с клиентом, подтверждения и сопровождения записи,
              улучшения качества услуг, оценки эффективности рекламных каналов и защиты от злоупотреблений.
            </p>
          </section>
          <section>
            <h2 className="text-xl text-[#C8956C] mb-2">3. Защита данных</h2>
            <p>
              Мы принимаем технические и организационные меры для защиты персональных данных от
              несанкционированного доступа, изменения, раскрытия или уничтожения.
            </p>
          </section>
          <section>
            <h2 className="text-xl text-[#C8956C] mb-2">4. Контакты</h2>
            <p>
              По вопросам обработки данных вы можете обратиться по телефону <a className="text-[#C8956C]" href="tel:+998712108895">+998 71 210 88 95</a>
              {' '}или по email <a className="text-[#C8956C]" href="mailto:info@serenity-spa.uz">info@serenity-spa.uz</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
