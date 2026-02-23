# Половинка успеха

Платформа для знакомств и живых офлайн-встреч через мероприятия.

## Что это
- Мульти-локационный продукт: `krsk`, `nrsk`, `ekb`
- Гибридная архитектура Next.js: `app/` + `pages/`
- Бэкенд: MongoDB + Mongoose + NextAuth
- UI: React 19, Tailwind, Flowbite, MUI

## Быстрый старт
1. Установить зависимости:
```bash
npm install
```
2. Заполнить `.env.local` (переменные и группы описаны в `docs/LOCAL_SETUP.md`).
3. Запустить dev:
```bash
npm run dev
```
4. Проверить линт:
```bash
npx eslint .
```

## Основные команды
- `npm run dev` - запуск в режиме разработки
- `npm run build` - production build
- `npm run start` - запуск production сервера
- `npm run lint` - линтинг
- `npm run global-users:dry-run` - dry-run миграции global users
- `npm run duplicates:phones` - поиск дублей телефонов

## Карта проекта
- `app/` - актуальные страницы App Router
- `pages/` - legacy страницы и API routes
- `pages/api/` - серверные endpoint'ы
- `server/` - бизнес-логика и интеграции
- `state/` - Jotai atoms/selectors/async
- `schemas/` - Mongoose схемы
- `docs/` - документация проекта

## Документация
Точка входа в документацию: `docs/README.md`

Ключевые документы:
- `AGENTS.md`
- `docs/ROADMAP.md`
- `docs/ARCHITECTURE.md`
- `docs/FEATURES.md`
- `docs/API_CONTRACTS.md`
- `docs/DOMAIN.md`
- `docs/LOCAL_SETUP.md`

## Критичные зоны
- Auth и сессии: `server/authOptions.js`
- Телефония: `pages/api/telefonip.js`, `docs/TELEFONIP_PORTING_GUIDE.md`
- Роли и доступ: `pages/api/[location]/roles.js`, селекторы ролей
- Модалки: `state/modalsFuncAtom.js` и `layouts/modals/*`
- Рассылки: `pages/api/cron.js`, `server/sendNewsletterMessages.js`

## Важные правила
- Поддерживать все локации (`krsk`, `nrsk`, `ekb`).
- Не вносить однолокационные изменения без явного согласования.
- Для новых/изменяемых API использовать единый формат ответа:
  - успех: `{"success": true, "data": ...}`
  - ошибка: `{"success": false, "data": {"error": {"type": "...", "message": "..."}}}`
