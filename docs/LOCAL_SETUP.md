# Локальный запуск и проверка

## 1. Предпосылки
- Node.js 20+ (рекомендуется LTS)
- npm 10+
- MongoDB (локально или доступ к нужным БД)

## 2. Установка
```bash
npm install
```

## 3. ENV-переменные (минимум)
Заполнить `.env.local` на основе инфраструктуры проекта.

Ключевые группы:
- БД:
  - `MONGODB_URI`
  - `MONGODB_KRSK_DBNAME`
  - `MONGODB_NRSK_DBNAME`
  - `MONGODB_EKB_DBNAME`
  - `MONGODB_GLOBAL_DBNAME` (для global сущностей)
- Auth:
  - `SECRET`
- TELEFONIP:
  - `TELEFONIP`
- Telegram:
  - `TELEGRAM_TOKEN_KRSK`, `TELEGRAM_TOKEN_NRSK`, `TELEGRAM_TOKEN_EKB`
  - `TELEGRAM_BOT_NAME_KRSK`, `TELEGRAM_BOT_NAME_NRSK`, `TELEGRAM_BOT_NAME_EKB`
- WhatsApp:
  - `WHATSAPP_API_URL_*`
  - `WHATSAPP_ID_INSTANCE_*`
  - `WHATSAPP_TOKEN_*`
- Email:
  - `EMAIL_SERVICE`, `EMAIL_USERNAME`, `EMAIL_PASSWORD`
- Прочее:
  - `DOMAIN`
  - `MODE`
  - `TELEGRAM_NOTIFICATION_DEV_ONLY`
  - `DEEPSEEK_KEY`

## 4. Команды разработки
- Запуск dev:
```bash
npm run dev
```
- Линт:
```bash
npx eslint .
```
- Сборка:
```bash
npm run build
```

## 5. Полезные утилиты
- Dry-run миграции `GlobalUsers`:
```bash
npm run global-users:dry-run
```
- Backfill `GlobalUsers` (по умолчанию dry-run):
```bash
npm run global-users:backfill:dry-run
```
- Проверка дублей телефонов:
```bash
npm run duplicates:phones
```

## 6. Минимальный smoke-чек перед merge
1. Вход/регистрация/восстановление в локации.
2. Проверка ролей и ограничений доступа.
3. Проверка модалок в затронутом разделе.
4. Проверка рассылок/уведомлений, если меняли эти зоны.

## 7. Важные ограничения безопасности
- Не коммитить `.env*` и токены.
- Не выводить секреты в логи.
- Не логировать персональные данные без необходимости.
