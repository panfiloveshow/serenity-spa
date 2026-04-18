# 🔧 Troubleshooting Guide — Serenity Spa

## Частые проблемы и решения

---

## 1. Заявки не приходят в Telegram

### Симптомы
- Форма отправляется успешно
- Confetti показывается
- Но сообщение не приходит в Telegram

### Диагностика

```bash
# 1. Проверить логи
ssh root@${SERVER_IP} "tail -50 /var/log/serenity-spa/bookings.log"

# 2. Проверить failed bookings
ssh root@${SERVER_IP} "ls -la /var/www/serenity-spa/failed-bookings/"

# 3. Проверить переменные окружения
ssh root@${SERVER_IP} "cat /var/www/serenity-spa/.env.local"
```

### Решения

**Проблема: Неверный токен или chat_id**
```bash
# Проверить токен
curl "https://api.telegram.org/bot<YOUR_TOKEN>/getMe"

# Должен вернуть информацию о боте
# Если ошибка — токен неверный

# Обновить .env.local на сервере
ssh root@${SERVER_IP}
nano /var/www/serenity-spa/.env.local
# Исправить TG_BOT_TOKEN и TG_CHAT_ID
pm2 restart serenity-spa
exit
```

**Проблема: Telegram API недоступен**
```bash
# Проверить доступность API
curl "https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates"

# Если timeout — проблема с сетью сервера
# Заявки сохранятся в failed-bookings и отправятся автоматически
```

**Проблема: Retry скрипт не работает**
```bash
# Проверить cron
ssh root@${SERVER_IP} "crontab -l | grep retry"

# Должно быть:
# */5 * * * * cd /var/www/serenity-spa && /usr/bin/node scripts/retry-failed-bookings.js >> /var/log/serenity-spa/retry.log 2>&1

# Вручную запустить retry
ssh root@${SERVER_IP} "cd /var/www/serenity-spa && node scripts/retry-failed-bookings.js"

# Проверить логи retry
ssh root@${SERVER_IP} "tail -50 /var/log/serenity-spa/retry.log"
```

---

## 2. Приложение не запускается

### Симптомы
- PM2 показывает status: errored/stopped
- Сайт не открывается

### Диагностика

```bash
# 1. Проверить статус
ssh root@${SERVER_IP} "pm2 status serenity-spa"

# 2. Посмотреть логи ошибок
ssh root@${SERVER_IP} "pm2 logs serenity-spa --err --lines 100"

# 3. Проверить порт 3001
ssh root@${SERVER_IP} "netstat -tulpn | grep 3001"
```

### Решения

**Проблема: Порт занят**
```bash
# Найти процесс на порту 3001
ssh root@${SERVER_IP} "lsof -i :3001"

# Убить процесс
ssh root@${SERVER_IP} "kill -9 <PID>"

# Перезапустить PM2
ssh root@${SERVER_IP} "pm2 restart serenity-spa"
```

**Проблема: Отсутствуют зависимости**
```bash
# Переустановить зависимости
ssh root@${SERVER_IP} "cd /var/www/serenity-spa && npm install"

# Перезапустить
ssh root@${SERVER_IP} "pm2 restart serenity-spa"
```

**Проблема: Ошибка в коде**
```bash
# Посмотреть детали ошибки
ssh root@${SERVER_IP} "pm2 logs serenity-spa --err --lines 200"

# Если ошибка в вашем коде — исправить локально
npm run build

# Загрузить исправленную версию
rsync -avz --delete .next/ root@${SERVER_IP}:/var/www/serenity-spa/.next/

# Перезапустить
ssh root@${SERVER_IP} "pm2 restart serenity-spa"
```

---

## 3. Redis не работает

### Симптомы
- Rate limiting не работает
- В логах ошибки "Redis connection error"

### Диагностика

```bash
# 1. Проверить статус Redis
ssh root@${SERVER_IP} "systemctl status redis-server"

# 2. Проверить ping
ssh root@${SERVER_IP} "redis-cli -p 6380 ping"

# 3. Проверить порт
ssh root@${SERVER_IP} "netstat -tulpn | grep 6380"
```

### Решения

**Проблема: Redis не запущен**
```bash
# Запустить Redis
ssh root@${SERVER_IP} "systemctl start redis-server"

# Включить автозапуск
ssh root@${SERVER_IP} "systemctl enable redis-server"

# Проверить
ssh root@${SERVER_IP} "redis-cli -p 6380 ping"
# Должно быть: PONG
```

**Проблема: Порт 6380 занят**
```bash
# Проверить что использует порт
ssh root@${SERVER_IP} "lsof -i :6380"

# Если другой процесс — изменить порт в конфиге
ssh root@${SERVER_IP} "nano /etc/redis/redis.conf"
# Найти: port 6380
# Изменить на другой порт (например 6381)

# Обновить код (src/lib/redis.ts)
# Изменить port: 6380 на новый порт

# Перезапустить Redis
ssh root@${SERVER_IP} "systemctl restart redis-server"
```

**Проблема: Redis падает при старте**
```bash
# Посмотреть логи Redis
ssh root@${SERVER_IP} "journalctl -u redis-server -n 100"

# Проверить конфиг
ssh root@${SERVER_IP} "redis-server /etc/redis/redis.conf --test-memory 1"

# Если ошибка в конфиге — восстановить дефолтный
ssh root@${SERVER_IP} "cp /etc/redis/redis.conf.bak /etc/redis/redis.conf"
ssh root@${SERVER_IP} "systemctl restart redis-server"
```

---

## 4. Rate limiting не работает

### Симптомы
- Можно отправлять много заявок подряд
- Нет блокировки по IP или телефону

### Диагностика

```bash
# 1. Проверить Redis
ssh root@${SERVER_IP} "redis-cli -p 6380 ping"

# 2. Проверить ключи rate limit
ssh root@${SERVER_IP} "redis-cli -p 6380 KEYS 'ratelimit:*'"

# 3. Проверить логи
ssh root@${SERVER_IP} "grep 'rate limit' /var/log/serenity-spa/bookings.log"
```

### Решения

**Проблема: Redis не подключен**
```bash
# Проверить src/lib/redis.ts
# Убедиться что порт и хост правильные

# Перезапустить приложение
ssh root@${SERVER_IP} "pm2 restart serenity-spa"
```

**Проблема: Ключи не создаются**
```bash
# Проверить права Redis
ssh root@${SERVER_IP} "redis-cli -p 6380 CONFIG GET dir"
ssh root@${SERVER_IP} "redis-cli -p 6380 CONFIG GET dbfilename"

# Проверить что Redis может писать
ssh root@${SERVER_IP} "redis-cli -p 6380 SET test 'value'"
ssh root@${SERVER_IP} "redis-cli -p 6380 GET test"
# Должно вернуть: "value"
```

---

## 5. Форма не отправляется

### Симптомы
- Кнопка "Отправить" не работает
- Ничего не происходит при клике
- Или показывается ошибка

### Диагностика

```bash
# 1. Открыть DevTools в браузере (F12)
# 2. Перейти на вкладку Console
# 3. Попробовать отправить форму
# 4. Посмотреть ошибки в консоли

# На сервере:
ssh root@${SERVER_IP} "pm2 logs serenity-spa --lines 50"
```

### Решения

**Проблема: Валидация блокирует отправку**
- Проверьте что имя содержит только буквы
- Проверьте что телефон полный (+998 XX XXX XX XX)
- Inline ошибки покажут что не так

**Проблема: CORS ошибка**
```bash
# Проверить next.config.ts
# Убедиться что нет блокировки API routes

# Если проблема — добавить CORS headers
# В src/app/api/booking/route.ts
```

**Проблема: Timeout**
```bash
# Увеличить timeout в BookingModal.tsx
# Текущий: 15000ms (15 секунд)
# Можно увеличить до 30000ms (30 секунд)
```

---

## 6. Confetti не показывается

### Симптомы
- Заявка отправляется успешно
- Но confetti анимация не появляется

### Решения

**Проблема: canvas-confetti не установлен**
```bash
# Локально
npm install canvas-confetti @types/canvas-confetti

# На сервере
ssh root@${SERVER_IP} "cd /var/www/serenity-spa && npm install canvas-confetti"

# Пересобрать и задеплоить
npm run build
rsync -avz --delete .next/ root@${SERVER_IP}:/var/www/serenity-spa/.next/
ssh root@${SERVER_IP} "pm2 restart serenity-spa"
```

**Проблема: CSP блокирует**
```bash
# Проверить в DevTools Console
# Если ошибка CSP — добавить в next.config.ts:
# script-src: 'unsafe-eval' (для confetti)
```

---

## 7. Логи не пишутся

### Симптомы
- Файлы логов пустые
- Или логи не создаются

### Диагностика

```bash
# Проверить существование папки
ssh root@${SERVER_IP} "ls -la /var/log/serenity-spa/"

# Проверить права
ssh root@${SERVER_IP} "ls -la /var/log/ | grep serenity-spa"
```

### Решения

**Проблема: Папка не существует**
```bash
# Создать папку
ssh root@${SERVER_IP} "mkdir -p /var/log/serenity-spa"

# Дать права
ssh root@${SERVER_IP} "chmod 755 /var/log/serenity-spa"

# Перезапустить приложение
ssh root@${SERVER_IP} "pm2 restart serenity-spa"
```

**Проблема: Нет прав на запись**
```bash
# Дать права пользователю PM2
ssh root@${SERVER_IP} "chown -R root:root /var/log/serenity-spa"
ssh root@${SERVER_IP} "chmod -R 755 /var/log/serenity-spa"
```

---

## 8. Высокая нагрузка / медленная работа

### Симптомы
- Сайт долго загружается
- Форма тормозит
- PM2 показывает высокий CPU/Memory

### Диагностика

```bash
# 1. Проверить нагрузку
ssh root@${SERVER_IP} "pm2 monit"

# 2. Проверить процессы
ssh root@${SERVER_IP} "top -n 1"

# 3. Проверить Redis memory
ssh root@${SERVER_IP} "redis-cli -p 6380 INFO memory"
```

### Решения

**Проблема: Много rate limit ключей в Redis**
```bash
# Проверить количество ключей
ssh root@${SERVER_IP} "redis-cli -p 6380 DBSIZE"

# Если > 10000 — очистить старые
ssh root@${SERVER_IP} "redis-cli -p 6380 FLUSHDB"
```

**Проблема: Большие логи**
```bash
# Проверить размер
ssh root@${SERVER_IP} "du -sh /var/log/serenity-spa/*"

# Ротировать вручную
ssh root@${SERVER_IP} "logrotate -f /etc/logrotate.d/serenity-spa"
```

**Проблема: Memory leak**
```bash
# Перезапустить PM2
ssh root@${SERVER_IP} "pm2 restart serenity-spa"

# Если проблема повторяется — проверить код на утечки
```

---

## Экстренное восстановление

### Если всё сломалось

```bash
# 1. Остановить всё
ssh root@${SERVER_IP} "pm2 stop serenity-spa"
ssh root@${SERVER_IP} "systemctl stop redis-server"

# 2. Пересобрать локально
npm install
npm run build

# 3. Загрузить на сервер
rsync -avz --delete .next/ root@${SERVER_IP}:/var/www/serenity-spa/.next/
rsync -avz scripts/ root@${SERVER_IP}:/var/www/serenity-spa/scripts/

# 4. Переустановить зависимости
ssh root@${SERVER_IP} "cd /var/www/serenity-spa && rm -rf node_modules && npm install"

# 5. Запустить всё заново
ssh root@${SERVER_IP} "systemctl start redis-server"
ssh root@${SERVER_IP} "pm2 restart serenity-spa"

# 6. Проверить
ssh root@${SERVER_IP} "pm2 status"
ssh root@${SERVER_IP} "redis-cli -p 6380 ping"
```

---

## Контакты поддержки

Если ничего не помогло:

1. Соберите диагностику:
```bash
ssh root@${SERVER_IP} "pm2 logs serenity-spa --lines 200 > ~/debug.log"
ssh root@${SERVER_IP} "tail -200 /var/log/serenity-spa/bookings.log >> ~/debug.log"
scp root@${SERVER_IP}:~/debug.log ./debug.log
```

2. Опишите проблему:
   - Что делали
   - Что ожидали
   - Что получили
   - Приложите debug.log

3. Проверьте документацию:
   - DEPLOYMENT.md
   - MONITORING.md
   - README.md
