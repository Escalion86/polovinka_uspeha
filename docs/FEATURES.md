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
- API: `pages/api/telefonip.js`
- Эталонный flow: `docs/TELEFONIP_PORTING_GUIDE.md`

### 1.3 Login/Register через VK ID
- Клиент: login/register location clients + VK OneTap/redirect flow
- Backend exchange/userinfo: `server/vkIdAuth.js`
- NextAuth provider: `server/authOptions.js` (`id: 'vk'`)
- Доп. статус API: `pages/api/global/auth/vk-status.js`
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
- API записи: `pages/api/[location]/eventsusers/index.js`
- Ограничения/guard-ы города: `server/assertCityOperationAllowed.js`

## 5. Роли и доступ
- API ролей: `pages/api/[location]/roles.js`
- Текущий пользователь в сессии: `server/authOptions.js` (session callback)
- Проверки ролей в UI: `state/selectors/isLoggedUser*Selector.js`, `loggedUserActiveRoleSelector`

## 6. Контент и витрина
- Глобальные карточки "О нашем пространстве":
  - API: `pages/api/global/content/about-space-cards.js`
  - Админ-редактирование: `layouts/content/AboutSpaceContent.js`
  - Публичный рендер: `app/_components/location/LocationIndexClient.jsx`, `app/page.jsx`
- Настройки сайта по локации: `pages/api/[location]/site.js`

## 7. Города и политики
- Каталог городов:
  - API: `pages/api/global/cities/index.js`, `pages/api/global/cities/public.js`
  - Серверная нормализация: `server/citiesCatalog.js`
- Политики города (active/closing/archived и флаги):
  - API: `pages/api/global/content/city-policies.js`
  - Guard: `server/getCityPolicy.js`, `server/assertCityOperationAllowed.js`

## 8. Рассылки и уведомления
- Cron и фоновые процессы: `pages/api/cron.js`
- Рассылки: `server/sendNewsletterMessages.js`
- Каналы:
  - Telegram: `pages/api/[location]/notifications/telegram.js`, `server/sendTelegramMessage.js`
  - WhatsApp: `pages/api/[location]/notifications/whatsapp.js`

## 9. Рекомендованный smoke-чек после правок
1. Login/register/recovery (phone + VK + Telegram при наличии env).
2. Запись и отмена записи на мероприятие.
3. Ограничения по ролям в кабинетном UI.
4. Модалки в затронутом сценарии.
5. Cron/рассылки, если трогали соответствующие файлы.
