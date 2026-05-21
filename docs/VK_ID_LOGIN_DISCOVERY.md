# VK ID Login — discovery и технический контур

Дата: 2026-02-22  
Статус: VK-T1 (discovery) завершен

## Цель

Подключить авторизацию/регистрацию через VK ID в текущий auth-контур проекта без регрессий для существующих способов входа (`credentials`, `telegram`), с учетом мульти-локационного режима (`krsk`, `nrsk`, `ekb`) и ограничений city policy.

## Текущий контур (as-is)

1. Login:
- UI: `app/_components/location/LocationLoginClient.jsx`
- сервер: NextAuth credentials provider в `server/authOptions.js`

2. Register:
- UI: `app/_components/location/LocationRegisterClient.jsx`
- сервер: `app/api/telefonip/route.js` + создание локального `Users`

3. Telegram auth:
- NextAuth credentials provider `id: 'telegram'` в `server/authOptions.js`

4. Ограничения города:
- `server/assertCityOperationAllowed.js` + `server/getCityPolicy.js`
- режимы: `login`, `registration`, `event_signup`, `event_management`, `public_listing`

## Целевой контур (to-be)

1. Клиент:
- добавить VK ID OneTap на login/register страницы;
- на `LOGIN_SUCCESS` отправлять `code + device_id + location` на серверный endpoint;
- с клиента не хранить секреты VK.

2. Сервер:
- endpoint обмена и авторизации VK (внутренний серверный обмен кода);
- валидация location и city policy (`login`/`registration`);
- поиск существующего пользователя и безопасная привязка VK ID;
- создание нового пользователя при разрешенной регистрации.

3. Сессия:
- итоговая авторизация через NextAuth (или через внутренний sign-in flow с сохранением текущей модели сессии).

## Предлагаемая схема данных

В `Users` (локальная анкета) добавить:
- `authProviders.vk.id` (string/number, уникально в рамках локации)
- `authProviders.vk.connectedAt` (date)
- `authProviders.vk.profile` (минимальный срез: `firstName`, `lastName`, `avatar`, `phone?`)

Примечание:
- существующее поле `vk` (ссылка на профиль) не удалять;
- новый блок `authProviders.vk` использовать только для авторизации.

## Предлагаемые API (draft)

1. `POST /api/auth/vk/exchange`
- вход: `{ code, deviceId, location, mode, referralId?, consentToMailing?, attribution? }`
- где `mode` = `login | register | auto`
- успех: `{"success": true, "data": {...}}`
- ошибка: `{"success": false, "data": {"error": {"type": "...", "message": "..."}}}`

2. `POST /api/auth/vk/link` (опционально, этап 2)
- привязка VK аккаунта к уже авторизованному пользователю.

## Обработка сценариев

1. Пользователь уже есть по `authProviders.vk.id`:
- выполняем login.

2. Пользователь найден по телефону из VK:
- безопасно привязываем `authProviders.vk.id`, если не занято другим пользователем;
- выполняем login.

3. Пользователь не найден:
- если `registration` разрешен для города: создаем нового пользователя;
- если запрещен: возвращаем `CITY_OPERATION_BLOCKED`.

## Ограничения безопасности

1. Секреты только на сервере:
- `VK_ID_CLIENT_SECRET` не должен попадать в клиент.

2. Валидация callback:
- проверка обязательных параметров (`code`, `deviceId`, `location`);
- защита от повторного использования кода (идемпотентность на уровне exchange).

3. Логи:
- не логировать токены/PII в открытом виде.

## ENV (планируемые)

- `VK_ID_APP_ID`
- `VK_ID_CLIENT_SECRET`
- `VK_ID_REDIRECT_URI`
- `VK_ID_ENABLED` (`true|false`)

## Совместимость по локациям

1. Обязательно поддерживать:
- `krsk`, `nrsk`, `ekb`.

2. Поведение для `nrsk`:
- login разрешен;
- регистрация блокируется согласно city policy.

## План реализации (следующие этапы)

1. VK-T2:
- подключить клиентский OneTap-виджет в login/register UI;
- единый обработчик ошибок и состояние загрузки.

2. VK-T3:
- серверный endpoint exchange и базовая авторизация.

3. VK-T4:
- связка с `GlobalUsers` и read-only путь в мульти-городском контуре.

4. VK-T5:
- тексты согласий/ошибок и UX-правки.

5. VK-T6:
- smoke + rollout + мониторинг конверсии.

## Что нужно подтвердить перед VK-T2/VK-T3

1. Redirect URI:
- использовать единый `https://половинкауспеха.рф/` или отдельный callback-путь (`/api/auth/vk/callback`)?

2. Политика авто-регистрации:
- при первом входе через VK создавать аккаунт автоматически (`mode=auto`) или только через экран регистрации?

3. Приоритет матчинга:
- сначала `vkId`, затем телефон, затем создание нового пользователя — подтверждаем?

4. Минимальный набор данных из VK:
- какие поля обязательны для создания пользователя (имя, аватар, телефон)?

## Подтверждено владельцем продукта (2026-02-22)

1. Redirect URI:
- использовать отдельный callback-путь, не корневой URL.
- принято: `/api/vk-id/callback`.

2. Политика авторизации:
- авто-flow включен: если номер телефона из VK найден в базе — авторизация;
- если не найден — регистрация нового пользователя.

3. Приоритет матчинга:
- `vkId -> phone -> create user`.

4. Поля профиля для интеграции:
- имя, фамилия, отчество (если доступно), email, аватар, телефон, `vk id`.
