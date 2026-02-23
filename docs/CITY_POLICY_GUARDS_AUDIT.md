# Аудит guard-покрытия по правилам городов

Дата: 2026-02-23  
Контекст: введены ограничения по флагу `allowEventManagement` ("Управление")

## 1. Целевое правило
При `allowEventManagement=false` должны быть заблокированы операции создания/редактирования/удаления для:
- мероприятий (`Events`)
- пользователей (`Users`)
- услуг (`Services`)
- товаров (`Products`)
- транзакций (`Payments`)

## 2. Серверное покрытие

### 2.1 Базовый слой (CRUD)
Файл: `server/CRUD.js`

Для методов `POST/PUT/DELETE` добавлен guard `assertCityOperationAllowed(location, 'event_management')` для схем:
- `Events`
- `Users`
- `Services`
- `Products`
- `Payments`

Это автоматически покрывает большинство endpoint’ов `pages/api/[location]/*`, использующих `CRUD`.

### 2.2 Ручные write-endpoint’ы вне CRUD
Проверены и закрыты обходы:

1. `pages/api/[location]/payments/autofill.js`
- ранее: прямая запись `Payments.insertMany(...)` без city-guard
- сейчас: добавлен `event_management` guard перед выполнением

2. `pages/api/[location]/users/duplicates/merge.js`
- ранее: прямые изменения `Users` (`findByIdAndUpdate`, `deleteMany`) без city-guard
- сейчас: добавлен `event_management` guard перед выполнением

## 3. UI-покрытие

### 3.1 Разделы кабинета
Добавлен баннер + скрытие `AddButton` при `allowEventManagement=false`:
- `layouts/content/EventsContent.js`
- `layouts/content/UsersContent.js`
- `layouts/content/ServicesContent.js`
- `layouts/content/ProductsContent.js`
- `layouts/content/PaymentsContent.js`

Компоненты:
- `hooks/useCityManagementAccess.js`
- `components/CityManagementBlockedBanner.jsx`

### 3.2 Карточные действия (edit/delete/status/clone)
Отключены action-кнопки в карточках:
- `components/cardButtons/EventCardButtons.js`
- `components/cardButtons/UserCardButtons.js`
- `components/cardButtons/ServiceCardButtons.js`
- `components/cardButtons/ProductCardButtons.js`
- `components/cardButtons/PaymentCardButtons.js`

### 3.3 Модальный слой (защита от обхода UI)
В `state/modalsFuncAtom.js` добавлен runtime-check `allowEventManagement` перед открытием модалок изменения данных для целевых сущностей.

## 4. Публичные сценарии login/register
Сделаны отдельные fallback-экраны при отключенных `allowLogin`/`allowRegistration`:
- `app/_components/location/LocationLoginClient.jsx`
- `app/_components/location/LocationRegisterClient.jsx`

Источник данных:
- `pages/api/global/cities/access.js`

## 5. Что осознанно не блокируется этим правилом
- read-only сценарии (просмотр данных, отчеты, история)
- операции других сущностей, не входящих в целевой список этого правила
- сценарии, регулируемые отдельными флагами (например `allowEventSignup`)

## 6. Статус аудита
- Сервер: `covered` для целевого набора сущностей и найденных ручных обходов.
- UI: `covered` на уровне разделов, карточек и модального слоя.
- Рекомендация: при добавлении нового write-endpoint’а для целевых сущностей обязательно добавлять `event_management` guard.
