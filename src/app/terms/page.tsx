import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Пользовательское соглашение | Serenity Spa',
  description:
    'Пользовательское соглашение Serenity Spa: условия использования сайта, порядок записи и взаимодействия с сервисом.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#152E4A] text-[#E8DFD0] px-6 py-24">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-light mb-8">Пользовательское соглашение</h1>
        <div className="space-y-6 text-[#E8DFD0]/75 leading-relaxed">
          <p>
            Используя сайт Serenity Spa, вы подтверждаете согласие с условиями настоящего
            соглашения. Сервис предназначен для информирования об услугах и отправки заявок на
            запись.
          </p>

          <section>
            <h2 className="text-xl text-[#C8956C] mb-2">1. Назначение сайта</h2>
            <p>
              Сайт предоставляет информацию об услугах, программах и контактных данных Serenity
              Spa. Отправка формы записи означает запрос на обратную связь и подтверждение визита.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-[#C8956C] mb-2">2. Запись на услуги</h2>
            <p>
              Дата и время записи считаются подтверждёнными только после связи с администратором.
              Serenity Spa оставляет за собой право уточнять детали заявки и предлагать ближайшие
              доступные слоты.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-[#C8956C] mb-2">3. Ограничение ответственности</h2>
            <p>
              Информация на сайте предоставляется на условиях «как есть». Serenity Spa прилагает
              усилия для её актуальности, однако не гарантирует абсолютное отсутствие неточностей.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-[#C8956C] mb-2">4. Контакты</h2>
            <p>
              По вопросам работы сайта и записи обращайтесь по телефону{' '}
              <a className="text-[#C8956C]" href="tel:+998712108895">
                +998 71 210 88 95
              </a>{' '}
              или email{' '}
              <a className="text-[#C8956C]" href="mailto:info@serenity-spa.uz">
                info@serenity-spa.uz
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
