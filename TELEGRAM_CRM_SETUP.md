# Настройка CRM-бота Serenity Spa, таблицы заявок и конверсий Google Ads

## 1. Как устроен доступ, рабочие часы и выгрузки

1. **Доступ к кнопкам и командам:** если `TG_MANAGER_USER_IDS` не задан, бот автоматически разрешает доступ всем участникам закрытой группы `TG_CHAT_ID` через Telegram `getChatMember` (включая новых менеджеров, добавленных в чат). В `TG_OWNER_USER_ID` указываются `user_id` руководителей (`345678901,456789012`) для личных 60-минутных алертов (нужно один раз нажать **Start** в `@spaserenity_bot`, иначе уведомление дублируется в группе).

   В `TG_OPERATOR_USER_IDS` укажите Telegram ID операторов из группы заявок через запятую, например `TG_OPERATOR_USER_IDS=123456789,234567890`. Свой ID оператор может узнать командой `/id`. Бот упомянет этих операторов в напоминании «15 минут без ответа». Если список операторов пуст, бот использует `TG_MANAGER_USER_IDS`. При пустых списках бот отправляет напоминание без упоминаний.

2. **Рабочие часы:** по умолчанию берутся с сайта (`07:00–23:00`, `Asia/Tashkent`, можно переопределить через `SPA_WORK_HOURS_START` / `SPA_WORK_HOURS_END`). Ночные заявки (23:00–07:00) считаются пришедшими в `07:00`.
3. **Google Таблица и Google Ads без настройки Google Cloud (CSV-фиды):**
   - Таблица заявок (`Заявки`): `https://serenityspa.uz/api/exports/leads.csv?token=<EXPORT_TOKEN>`
     — в любой лист Google Таблицы в ячейку `A1` вставляется формула:
     `=IMPORTDATA("https://serenityspa.uz/api/exports/leads.csv?token=<EXPORT_TOKEN>")`
   - Фиды конверсий Google Ads (`USD`, по курсу ЦБ РУз `cbu.uz`, защищены HTTP Basic Auth `ADS_EXPORT_BASIC_USER` / `ADS_EXPORT_BASIC_PASS`):
     - `Спа — запись`: `https://serenityspa.uz/api/exports/google-ads.csv?name=zapis` (резервный URL без `?`: `https://serenityspa.uz/api/exports/google-ads-zapis.csv`)
     - `Спа — визит`: `https://serenityspa.uz/api/exports/google-ads.csv?name=vizit` (резервный URL без `?`: `https://serenityspa.uz/api/exports/google-ads-vizit.csv`)
     - Подключаются в Google Ads (`ваш аккаунт` → **Менеджер данных → HTTPS → Конверсии → офлайн**) с ежедневным импортом.
   - Альтернативно поддерживается прямая запись через Google Sheets API (`GOOGLE_SHEETS_SPREADSHEET_ID` + `GOOGLE_SERVICE_ACCOUNT_KEY_FILE` / `GOOGLE_SERVICE_ACCOUNT_JSON`).

## 2. Регистрация Telegram Webhook (выполняется на сервере)

```bash
cd /var/www/serenity-spa
node scripts/setup-telegram-webhook.mjs
```

Регистрирует `https://serenityspa.uz/api/telegram/webhook` с `secret_token` и команды `/open`, `/svodka`, `/id`.
