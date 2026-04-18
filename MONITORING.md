# 📊 Мониторинг и обслуживание Serenity Spa

## Ежедневные проверки

### 1. Статус приложения

```bash
# Проверить что приложение работает
ssh root@${SERVER_IP} "pm2 status serenity-spa"

# Должно быть:
# - status: online
# - uptime: > 0
# - restarts: минимальное количество
```

### 2. Проверка логов

```bash
# Последние заявки
ssh root@${SERVER_IP} "tail -20 /var/log/serenity-spa/bookings.log"

# Ошибки приложения
ssh root@${SERVER_IP} "pm2 logs serenity-spa --err --lines 20 --nostream"

# Retry скрипт
ssh root@${SERVER_IP} "tail -20 /var/log/serenity-spa/retry.log"
```

### 3. Failed bookings

```bash
# Проверить наличие неотправленных заявок
ssh root@${SERVER_IP} "ls -la /var/www/serenity-spa/failed-bookings/ | grep -v archived"

# Если есть файлы старше 1 часа — проверить почему не отправляются
```

---

## Еженедельные проверки

### 1. Redis статистика

```bash
# Подключиться к Redis
ssh root@${SERVER_IP} "redis-cli -p 6380"

# Посмотреть количество ключей
> DBSIZE

# Посмотреть активные rate limits
> KEYS ratelimit:*

# Выйти
> exit
```

### 2. Размер логов

```bash
# Проверить размер логов
ssh root@${SERVER_IP} "du -sh /var/log/serenity-spa/"

# Logrotate должен автоматически ротировать логи
# Если размер > 100MB — проверить logrotate
```

### 3. Использование ресурсов

```bash
# CPU и память приложения
ssh root@${SERVER_IP} "pm2 monit"

# Общая нагрузка сервера
ssh root@${SERVER_IP} "top -n 1 | head -20"
```

---

## Метрики для отслеживания

### Ключевые показатели

1. **Успешность отправки заявок**
   ```bash
   # Подсчитать успешные заявки за сегодня
   ssh root@${SERVER_IP} "grep 'SUCCESS' /var/log/serenity-spa/bookings.log | grep '$(date +%Y-%m-%d)' | wc -l"
   
   # Подсчитать ошибки за сегодня
   ssh root@${SERVER_IP} "grep 'ERROR' /var/log/serenity-spa/bookings.log | grep '$(date +%Y-%m-%d)' | wc -l"
   ```

2. **Rate limiting срабатывания**
   ```bash
   # Сколько раз сработал IP rate limit
   ssh root@${SERVER_IP} "grep 'IP rate limit' /var/log/serenity-spa/bookings.log | wc -l"
   
   # Сколько раз сработал Phone rate limit
   ssh root@${SERVER_IP} "grep 'Phone rate limit' /var/log/serenity-spa/bookings.log | wc -l"
   ```

3. **Обнаружение ботов**
   ```bash
   # Honeypot срабатывания
   ssh root@${SERVER_IP} "grep 'Bot detected: honeypot' /var/log/serenity-spa/bookings.log | wc -l"
   
   # Timestamp срабатывания
   ssh root@${SERVER_IP} "grep 'Bot detected: submitted_too_fast' /var/log/serenity-spa/bookings.log | wc -l"
   ```

4. **Retry успешность**
   ```bash
   # Успешные retry
   ssh root@${SERVER_IP} "grep 'Successfully sent' /var/log/serenity-spa/retry.log | wc -l"
   
   # Архивированные (превысили лимит попыток)
   ssh root@${SERVER_IP} "ls -1 /var/www/serenity-spa/failed-bookings/*.archived.json 2>/dev/null | wc -l"
   ```

---

## Алерты и уведомления

### Критические ситуации (требуют немедленного внимания)

1. **Приложение упало**
   - PM2 status: stopped/errored
   - Действие: Проверить логи, перезапустить

2. **Redis недоступен**
   - `redis-cli -p 6380 ping` не отвечает
   - Действие: Перезапустить Redis

3. **Много failed bookings (> 10)**
   - Telegram API может быть недоступен
   - Действие: Проверить токен, проверить сеть

### Предупреждения (проверить в течение дня)

1. **Высокий rate limiting (> 50 в день)**
   - Возможна атака или проблема с формой
   - Действие: Проверить логи, IP адреса

2. **Много bot detection (> 20 в день)**
   - Возможна bot атака
   - Действие: Проверить паттерны, возможно усилить защиту

3. **Restarts > 5**
   - Приложение нестабильно
   - Действие: Проверить логи ошибок, memory leaks

---

## Backup и восстановление

### Что нужно бэкапить

1. **Логи** (опционально, если нужна история)
   ```bash
   # Скачать логи за последний месяц
   scp -r root@${SERVER_IP}:/var/log/serenity-spa/ ./backup/logs/
   ```

2. **Failed bookings** (важно!)
   ```bash
   # Скачать неотправленные заявки
   scp -r root@${SERVER_IP}:/var/www/serenity-spa/failed-bookings/ ./backup/failed-bookings/
   ```

3. **Конфигурация**
   ```bash
   # .env.local (храните в безопасном месте!)
   scp root@${SERVER_IP}:/var/www/serenity-spa/.env.local ./backup/.env.local
   
   # PM2 конфигурация
   ssh root@${SERVER_IP} "pm2 save"
   ```

### Восстановление после сбоя

```bash
# 1. Восстановить код
npm run build
rsync -avz --delete .next/ root@${SERVER_IP}:/var/www/serenity-spa/.next/

# 2. Восстановить .env.local
scp ./backup/.env.local root@${SERVER_IP}:/var/www/serenity-spa/.env.local

# 3. Восстановить failed bookings
scp -r ./backup/failed-bookings/* root@${SERVER_IP}:/var/www/serenity-spa/failed-bookings/

# 4. Перезапустить всё
ssh root@${SERVER_IP} "systemctl restart redis-server && pm2 restart serenity-spa"
```

---

## Оптимизация производительности

### Если приложение тормозит

1. **Проверить Redis memory**
   ```bash
   ssh root@${SERVER_IP} "redis-cli -p 6380 INFO memory"
   ```

2. **Очистить старые rate limits**
   ```bash
   # Redis автоматически удаляет по TTL, но можно форсировать
   ssh root@${SERVER_IP} "redis-cli -p 6380 FLUSHDB"
   ```

3. **Проверить размер логов**
   ```bash
   ssh root@${SERVER_IP} "du -sh /var/log/serenity-spa/*"
   
   # Если большие — вручную ротировать
   ssh root@${SERVER_IP} "logrotate -f /etc/logrotate.d/serenity-spa"
   ```

---

## Контакты для экстренных ситуаций

**Сервер:** ${SERVER_IP}  
**Порт приложения:** 3001  
**Порт Redis:** 6380  

**Telegram Bot:** @[ваш_бот]  
**Telegram Chat ID:** [из .env.local]  

**Хостинг:** Timeweb VPS  
**Node версия:** 22.22.0  
**PM2 версия:** 6.0.14  
**Redis версия:** 7.0.15  

---

## Полезные скрипты

### Скрипт для ежедневной проверки

```bash
#!/bin/bash
# daily-check.sh

echo "=== Serenity Spa Daily Check ==="
echo ""

echo "1. PM2 Status:"
ssh root@${SERVER_IP} "pm2 status serenity-spa"
echo ""

echo "2. Redis Status:"
ssh root@${SERVER_IP} "redis-cli -p 6380 ping"
echo ""

echo "3. Failed Bookings:"
ssh root@${SERVER_IP} "ls -1 /var/www/serenity-spa/failed-bookings/*.json 2>/dev/null | wc -l"
echo ""

echo "4. Today's Bookings:"
ssh root@${SERVER_IP} "grep 'SUCCESS' /var/log/serenity-spa/bookings.log | grep '$(date +%Y-%m-%d)' | wc -l"
echo ""

echo "5. Today's Errors:"
ssh root@${SERVER_IP} "grep 'ERROR' /var/log/serenity-spa/bookings.log | grep '$(date +%Y-%m-%d)' | wc -l"
echo ""

echo "=== Check Complete ==="
```

Сохраните как `daily-check.sh`, дайте права `chmod +x daily-check.sh` и запускайте каждый день.
