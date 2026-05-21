# Функциональные сценарии и где они реализованы

## 1. Вход/регистрация/восстановление

### 1.1 Login (phone/password)
- UI: `app/[location]/login/page.jsx` -> `app/_components/location/LocationLoginClient.jsx`
- Auth: `server/authOptions.js` (`credentials`)
- Валидация доступа по городу: `server/assertCityOperationAllowed.js`
- Межгородской read-path профиля: `server/ensureLocalUserFromGlobalByPhone.js`

### 1.2 Register/Recovery через TELEFONIP
- UI:
  - `app/[location]/register/page.jsx` -> `app/_components/location/LocationRegisterClient.jsx`
  - `app/[location]/recovery/page.jsx` -> `app/_components/location/LocationRecoveryClient.jsx`
- API: `app/api/telefonip/route.js`
- Эталонный flow: `docs/TELEFONIP_PORTING_GUIDE.md`

### 1.3 Login/Register через VK ID
- Клиент: login/register location clients + VK OneTap/redirect flow
- Backend exchange/userinfo: `server/vkIdAuth.js`
- NextAuth provider: `server/authOptions.js` (`id: 'vk'`)
- Доп. статус API: `app/api/global/auth/vk-status/route.js`
- Runbook rollout: `docs/VK_ID_SMOKE_ROLLOUT_RUNBOOK.md`

### 1.4 Login/Register через Telegram
- Provider: `server/authOptions.js` (`id: 'telegram'`)
- Регистрация пользователя + телеграм-уведомление: `server/userRegisterTelegramNotification.js`

## 2. Локационные публичные страницы
- Общая главная: `app/page.jsx`
- Локационная главная: `app/[location]/index/page.jsx` + `app/_components/location/LocationIndexClient.jsx`
- Список событий: `app/[location]/events/page.jsx`
- Карточка события: `app/[location]/event/[id]/page.jsx`

## 3. Кабинет и админ-контур
- Кабинет: `app/[location]/cabinet/page.jsx`, `app/[location]/cabinet/[page]/page.jsx`
- Профиль пользователя: `app/[location]/user/[id]/page.jsx`
- Взаимодействия через модалки: `state/modalsFuncAtom.js` + `layouts/modals/*`

## 4. Запись на мероприятия
- Клиентские действия записи/отмены: `state/modalsFuncAtom.js` (ветка `event.signUp/signOut`)
- API записи: `app/api/[location]/eventsusers/route.js`
- Ограничения/guard-ы города: `server/assertCityOperationAllowed.js`

## 5. Роли и доступ
- API ролей: `app/api/[location]/roles/route.js`
- Текущий пользователь в сессии: `server/authOptions.js` (session callback)
- Проверки ролей в UI: `state/selectors/isLoggedUser*Selector.js`, `loggedUserActiveRoleSelector`

## 6. Контент и витрина
- Глобальные карточки "О нашем пространстве":
  - API: `app/api/global/content/about-space-cards/route.js`
  - Админ-редактирование: `layouts/content/AboutSpaceContent.js`
  - Публичный рендер: `app/_components/location/LocationIndexClient.jsx`, `app/page.jsx`
- Настройки сайта по локации: `app/api/[location]/site/route.js`

## 7. Города и политики
- Каталог городов:
  - API: `app/api/global/cities/route.js`, `app/api/global/cities/public/route.js`
  - Серверная нормализация: `server/citiesCatalog.js`
- Политики города (active/closing/archived и флаги):
  - API: `app/api/global/content/city-policies/route.js`
  - Guard: `server/getCityPolicy.js`, `server/assertCityOperationAllowed.js`

## 8. Рассылки и уведомления
- Cron и фоновые процессы: `app/api/cron/route.js`
- Рассылки: `server/sendNewsletterMessages.js`
- Каналы:
  - Telegram: `app/api/[location]/notifications/telegram/route.js`, `server/sendTelegramMessage.js`
  - WhatsApp: `app/api/[location]/notifications/whatsapp/route.js`

## 9. Рекомендованный smoke-чек после правок
1. Login/register/recovery (phone + VK + Telegram при наличии env).
2. Запись и отмена записи на мероприятие.
3. Ограничения по ролям в кабинетном UI.
4. Модалки в затронутом сценарии.
5. Cron/рассылки, если трогали соответствующие файлы.
