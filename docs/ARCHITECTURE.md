# Архитектура проекта

## 1. Контекст
`Половинка успеха` — мульти-локационная платформа офлайн-мероприятий (`krsk`, `nrsk`, `ekb`) на App Router:
- App Router: пользовательские страницы и HTTP API (`app/*`)
- Серверные обработчики API: `server/api/*`, подключаются через `app/api/**/route.js`

Текущая версия: см. `package.json`.

## 2. Технологический стек
- Next.js 16 + React 19
- MongoDB + Mongoose
- NextAuth (`credentials`, `telegram`, `vk`)
- Jotai (atoms/selectors/async)
- Tailwind + Flowbite + MUI
- Интеграции: TELEFONIP, Telegram, WhatsApp, DeepSeek, Google Calendar

## 3. Точки входа и роутинг
Основные entrypoints:
- `app/page.jsx` — общая city-agnostic главная
- `app/[location]/page.jsx` — локационная главная
- `app/[location]/login/page.jsx`
- `app/[location]/register/page.jsx`
- `app/[location]/recovery/page.jsx`
- `app/[location]/events/page.jsx`
- `app/[location]/cabinet/page.jsx`
- `app/api/auth/[...nextauth]/route.js` — NextAuth в App Router
- `app/api/*` — HTTP API проекта

## 4. Границы слоев
- `app/`, `components/`, `layouts/`, `blocks/`:
  UI-слой (презентация + клиентские сценарии)
- `state/*`:
  глобальное состояние, derived-логика, триггеры модалок
- `app/api/*`:
  HTTP endpoints (глобальные и локационные)
- `server/api/*`:
  бизнес-обработчики HTTP API, вынесенные из legacy Pages Router
- `server/*`:
  бизнес-правила, guard-ы, auth, интеграции
- `schemas/*`:
  модели MongoDB (локационные и глобальные)
- `utils/dbConnect*.js`:
  подключение к БД (локальные и global)

## 5. Мульти-локационная модель
- Локационные данные живут в отдельных БД через `dbConnect(location)`.
- Глобальные сущности (города, политики, global content, `GlobalUsers`) живут в центральной БД через `dbConnectGlobal`.
- В новых изменениях нельзя фиксироваться на одной локации без явного согласования.

## 6. Auth и сессии
Ключевой файл: `server/authOptions.js`.

Провайдеры:
- `credentials` (телефон + пароль)
- `telegram`
- `vk` (VK ID)

Особенности:
- Перед входом работают city-guard проверки (`assertCityOperationAllowed`).
- Поддержан read-path через `GlobalUsers` для межгородской связки профиля.
- В `session` callback сессия расширяется полями пользователя из БД локации.

## 7. API слой
Структура:
- `app/api/[location]/*` — доменные CRUD/операции по городу
- `app/api/global/*` — глобальные конфиги/справочники
- `app/api/telefonip/route.js` — регистрация/recovery через телефонию
- `app/api/cron/route.js` — фоновые рассылки/процессы
- `server/api/*` — общий слой обработчиков, подключаемый route handler’ами

Общий CRUD-движок:
- `server/CRUD.js` используется множеством локационных endpoint’ов
- автоматически пишет `Histories` при POST/PUT/DELETE
- включает guard для `Events` на изменение в закрытых/архивных городах

## 8. Состояние и модалки
- Центральный диспетчер модалок: `state/modalsFuncAtom.js`
- Все ключевые пользовательские действия (запись на событие, редактирование, подтверждения) проходят через модальные сценарии.
- Это критичная зона: при правках проверять цепочку `itemsFuncAtom` -> selectors -> modals.

## 9. Критичные зоны
- Auth и сессии: `server/authOptions.js`
- Рассылки/уведомления: `app/api/cron/route.js`, `server/sendNewsletterMessages.js`
- Роли/права: `app/api/[location]/roles/route.js`, role selectors/guards
- Городские политики и guard-ы: `server/getCityPolicy.js`, `server/assertCityOperationAllowed.js`
- Телефония: `app/api/telefonip/route.js`, `docs/TELEFONIP_PORTING_GUIDE.md`

## 10. Документы, которые читать первыми
1. `AGENTS.md`
2. `docs/ROADMAP.md`
3. `docs/API_CONTRACTS.md`
4. `docs/FEATURES.md`
5. `docs/DOMAIN.md`
