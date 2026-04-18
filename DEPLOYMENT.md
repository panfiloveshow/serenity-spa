# 🚀 Инструкция по деплою Serenity Spa

## 1️⃣ Подготовка к деплою

### Проверка перед деплоем

```bash
# 1. Убедитесь что вы в корне проекта
pwd
# Должно быть: /Users/panfiloveshow/Documents/ПРОЕКТЫ/spa/serenity-spa

# 2. Проверьте что все зависимости установлены
npm install

# 3. Соберите production версию
npm run build

# 4. Проверьте что .env.local содержит правильные переменные
cat .env.local
# Должны быть: TG_BOT_TOKEN и TG_CHAT_ID
```

---

## 2️⃣ Деплой на сервер

### Шаг 1: Загрузка файлов

```bash
# Загрузить собранное приложение
rsync -avz --delete .next/ root@${SERVER_IP}:/var/www/serenity-spa/.next/

# Загрузить скрипты (если изменились)
rsync -avz scripts/ root@${SERVER_IP}:/var/www/serenity-spa/scripts/
```

### Шаг 2: Установка зависимостей на сервере

```bash
# Подключиться к серверу
ssh root@${SERVER_IP}

# Перейти в папку проекта
cd /var/www/serenity-spa

# Установить новые зависимости (если добавляли)
npm install

# Выйти из SSH
exit
```

### Шаг 3: Перезапуск приложения

```bash
# Перезапустить PM2
ssh root@${SERVER_IP} "pm2 restart serenity-spa"

# Проверить статус
ssh root@${SERVER_IP} "pm2 status"

# Посмотреть логи
ssh root@${SERVER_IP} "pm2 logs serenity-spa --lines 20"
```

---

## 3️⃣ Проверка работоспособности

### После деплоя проверьте:

```bash
# 1. Приложение запущено
ssh root@${SERVER_IP} "pm2 status serenity-spa"
# Статус должен быть: online

# 2. Redis работает
ssh root@${SERVER_IP} "redis-cli -p 6380 ping"
# Ответ должен быть: PONG

# 3. Логи без критических ошибок
ssh root@${SERVER_IP} "pm2 logs serenity-spa --lines 50 --nostream"

# 4. Проверьте сайт в браузере
# http://${SERVER_IP}:3001
```

### Проверка функционала:

1. ✅ Откройте сайт
2. ✅ Нажмите "Записаться"
3. ✅ Заполните форму
4. ✅ Отправьте заявку
5. ✅ Проверьте Telegram — должно прийти сообщение
6. ✅ Должна появиться confetti анимация

---

## 🔧 Полезные команды

### Управление PM2

```bash
# Перезапустить
ssh root@${SERVER_IP} "pm2 restart serenity-spa"

# Остановить
ssh root@${SERVER_IP} "pm2 stop serenity-spa"

# Запустить
ssh root@${SERVER_IP} "pm2 start serenity-spa"

# Логи в реальном времени
ssh root@${SERVER_IP} "pm2 logs serenity-spa"

# Информация о процессе
ssh root@${SERVER_IP} "pm2 info serenity-spa"
```

### Управление Redis

```bash
# Проверить статус
ssh root@${SERVER_IP} "systemctl status redis-server"

# Перезапустить
ssh root@${SERVER_IP} "systemctl restart redis-server"

# Посмотреть ключи rate limiting
ssh root@${SERVER_IP} "redis-cli -p 6380 KEYS 'ratelimit:*'"

# Очистить все rate limits (осторожно!)
ssh root@${SERVER_IP} "redis-cli -p 6380 FLUSHDB"
```

### Логи и мониторинг

```bash
# Логи приложения
ssh root@${SERVER_IP} "tail -f /var/log/serenity-spa/bookings.log"

# Логи retry скрипта
ssh root@${SERVER_IP} "tail -f /var/log/serenity-spa/retry.log"

# Проверить failed bookings
ssh root@${SERVER_IP} "ls -la /var/www/serenity-spa/failed-bookings/"

# Посмотреть содержимое failed booking
ssh root@${SERVER_IP} "cat /var/www/serenity-spa/failed-bookings/[filename].json"
```

---

## 🆘 Решение проблем

### Приложение не запускается

```bash
# 1. Проверьте логи ошибок
ssh root@${SERVER_IP} "pm2 logs serenity-spa --err --lines 50"

# 2. Проверьте переменные окружения
ssh root@${SERVER_IP} "cat /var/www/serenity-spa/.env.local"

# 3. Пересоберите приложение
npm run build
rsync -avz --delete .next/ root@${SERVER_IP}:/var/www/serenity-spa/.next/
ssh root@${SERVER_IP} "pm2 restart serenity-spa"
```

### Redis не работает

```bash
# Проверить порт
ssh root@${SERVER_IP} "netstat -tulpn | grep 6380"

# Перезапустить Redis
ssh root@${SERVER_IP} "systemctl restart redis-server"

# Проверить логи Redis
ssh root@${SERVER_IP} "journalctl -u redis-server -n 50"
```

### Заявки не отправляются в Telegram

```bash
# 1. Проверьте токен и chat_id
ssh root@${SERVER_IP} "cat /var/www/serenity-spa/.env.local"

# 2. Проверьте failed bookings
ssh root@${SERVER_IP} "ls -la /var/www/serenity-spa/failed-bookings/"

# 3. Проверьте логи
ssh root@${SERVER_IP} "tail -f /var/log/serenity-spa/bookings.log"

# 4. Вручную запустите retry скрипт
ssh root@${SERVER_IP} "cd /var/www/serenity-spa && node scripts/retry-failed-bookings.js"
```

---

## 📋 Checklist деплоя

- [ ] Код собран локально (`npm run build`)
- [ ] .next загружен на сервер
- [ ] Зависимости установлены на сервере
- [ ] PM2 перезапущен
- [ ] Приложение в статусе `online`
- [ ] Redis отвечает `PONG`
- [ ] Сайт открывается в браузере
- [ ] Форма бронирования работает
- [ ] Заявка приходит в Telegram
- [ ] Confetti анимация показывается
- [ ] Логи без критических ошибок

---

## 🔐 Безопасность

**ВАЖНО:** Никогда не коммитьте в Git:
- `.env.local` (содержит секреты)
- `node_modules/`
- `.next/`
- Логи и failed bookings

Эти файлы уже в `.gitignore`.
