# VK One Tap Button для Next.js — инструкция для ИИ

Дата: 2026-03-16  
Статус: ready-to-use playbook

## Цель

Быстро перенести рабочий flow авторизации/регистрации через VK ID One Tap из этого проекта в другой Next.js проект без хранения секретов на клиенте и без регрессий существующего login.

## Что переносим (минимум)

1. Клиентский компонент One Tap:
- `app/_components/location/VkIdOneTapAuth.jsx`

2. Серверный helper обмена и профиля VK:
- `server/vkIdAuth.js`

3. NextAuth provider `vk`:
- блок `CredentialsProvider({ id: 'vk', ... })` в `server/authOptions.js`

4. Callback route для popup:
- `app/api/vk-id/callback/route.js`

5. Встраивание в UI:
- `app/_components/location/LocationLoginClient.jsx`
- `app/_components/location/LocationRegisterClient.jsx`

## Обязательные ENV

Клиент:
- `NEXT_PUBLIC_VK_ID_APP_ID`
- `NEXT_PUBLIC_VK_ID_REDIRECT_URI` (рекомендуемо, иначе fallback на `${origin}/api/vk-id/callback`)
- `NEXT_PUBLIC_VK_ID_SCOPE` (по умолчанию `phone email`)
- `NEXT_PUBLIC_VK_DEBUG_LOGS=true|false` (опционально)

Сервер:
- `VK_ID_APP_ID`
- `VK_ID_CLIENT_SECRET` (только сервер)
- `VK_ID_REDIRECT_URI`
- `VK_ID_DOMAIN` (опционально, default `id.vk.ru`)
- `VK_DEBUG_LOGS=true|false` (опционально)
- `SECRET` (NextAuth)

## Целевой flow

1. Пользователь кликает VK One Tap на login/register.
2. VK SDK возвращает `code`, `device_id` (и иногда `code_verifier`).
3. Клиент вызывает `signIn('vk', { code, deviceId, ... })`.
4. Серверный provider:
- меняет `code` на `access_token` (`/oauth2/auth`);
- получает профиль (`/oauth2/user_info`);
- связывает/создает локального пользователя;
- возвращает сессионный payload.
5. Клиент делает post-login redirect.

## Пошаговое подключение в новом проекте

1. Подключить `next-auth` и настроить базовый `authOptions`.
2. Добавить серверный модуль `vkIdAuth.js`:
- `exchangeVkCode({ code, deviceId, codeVerifier, state })`
- `fetchVkUserInfo({ accessToken })`
- единый формат ответа:  
  `{"success": true, "data": ...}` / `{"success": false, "data": {"error": {"type": "...", "message": "..."}}}`
3. В `authOptions` добавить credentials provider `id: 'vk'`:
- принять `code/deviceId/location/mode/...`;
- валидировать вход;
- вызвать exchange + user_info;
- маппить ошибки на короткие коды (`VK_EXCHANGE_FAILED`, `VK_USERINFO_FAILED`, `VK_PHONE_REQUIRED` и т.д.);
- найти/создать пользователя и вернуть payload сессии.
4. Добавить callback route `/api/vk-id/callback`, который возвращает HTML с `window.close()`.
5. Добавить клиентский компонент One Tap:
- грузить SDK `https://unpkg.com/@vkid/sdk@2.6.5/dist-sdk/umd/index.js`;
- `VKID.Config.init({ app, redirectUrl, responseMode: Callback, source: LOWCODE, scope })`;
- на `LOGIN_SUCCESS` вызывать `signIn('vk', { redirect: false, ... })`;
- показывать человекочитаемые ошибки.
6. Встроить компонент в страницы login/register:
- login: `mode="login"`;
- register: `mode="register"` + флаги обязательных согласий;
- не показывать кнопку VK, если фича отключена policy/feature-flag.
7. Добавить endpoint флага доступности VK (опционально, но рекомендуется):
- пример: `GET /api/global/auth/vk-status?location=...` -> `{ success, data: { allowVkAuth } }`.

## Важные детали, которые нельзя пропускать

1. Секреты VK (`VK_ID_CLIENT_SECRET`) никогда не отправлять в браузер.
2. На сервере валидировать `location/mode` и бизнес-guard для login/registration.
3. Для `register` обязательно проверять юридические согласия до создания пользователя.
4. Не логировать токены и PII; в debug логах маскировать телефон.
5. Добавить защиту от повторной отправки auth (на клиенте уже есть `authInFlightRef`).

## Минимальный acceptance checklist

1. `/login`: виджет отображается, успешный вход создает/обновляет сессию.
2. `/register`: без обязательных согласий VK-вход блокируется.
3. Ошибки VK корректно маппятся в UI-сообщения.
4. При невалидном `location` сервер возвращает контролируемую ошибку.
5. При отключенной фиче VK кнопка не отображается.
6. Recovery flow работает независимо от VK.

## Готовый промпт для ИИ (вставить в новый проект)

```text
Нужно интегрировать VK ID One Tap в Next.js проект с NextAuth.

Сделай реализацию по шагам:
1) Добавь серверный модуль vkIdAuth с методами exchangeVkCode и fetchVkUserInfo (VK OAuth endpoints /oauth2/auth и /oauth2/user_info), единый формат ответов success/error.
2) Добавь в NextAuth credentials provider с id='vk', который принимает code/deviceId/location/mode и выполняет серверный exchange + user_info + login/register логику.
3) Добавь клиентский компонент VkIdOneTapAuth:
   - загрузка VK SDK из https://unpkg.com/@vkid/sdk@2.6.5/dist-sdk/umd/index.js
   - VKID.Config.init(...)
   - обработка LOGIN_SUCCESS -> signIn('vk', { redirect:false, ... })
   - маппинг кодов ошибок на user-friendly сообщения.
4) Добавь callback route /api/vk-id/callback с window.close().
5) Встрой компонент в login/register страницы:
   - login: mode='login'
   - register: mode='register' + передача флагов обязательных согласий
6) Добавь feature-flag endpoint VK availability и условный рендер виджета.
7) Прогони smoke-checklist: успешный login/register, блокировка без согласий, fallback ошибки, выключение VK через flag.

Ограничения:
- не передавать VK client secret в клиент;
- не ломать существующий credentials login;
- сохранить текущий стиль кода проекта.
```

## Откуда брать референс в этом репозитории

- `app/_components/location/VkIdOneTapAuth.jsx`
- `server/vkIdAuth.js`
- `server/authOptions.js` (provider `id: 'vk'`)
- `app/api/vk-id/callback/route.js`
- `hooks/useVkAuthAvailability.js`
- `pages/api/global/auth/vk-status.js`
