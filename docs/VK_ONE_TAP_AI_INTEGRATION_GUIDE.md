# VK ID One Tap для Next.js — универсальная инструкция

Дата: 2026-05-06  
Статус: ready-to-use playbook

## Цель

Подключить авторизацию и регистрацию через VK ID One Tap в Next.js проект без хранения секретов в браузере, без регрессий существующего входа и с понятной диагностикой проблем `scope`/телефона.

Инструкция подходит для проектов на Next.js App Router или Pages Router. Примеры ниже используют NextAuth credentials provider, но серверные helper'ы можно применить и с собственной session/JWT-логикой.

## Что подготовить в VK

1. Создать приложение именно с VK ID.
2. В разделе интеграции VK ID включить нужные поля профиля:
- `Номер телефона`;
- `Email`, если нужен.
3. Взять:
- `ID приложения` -> `VK_ID_APP_ID`;
- `Защищенный ключ` -> `VK_ID_CLIENT_SECRET`.
4. Не использовать `Сервисный ключ доступа` как `VK_ID_CLIENT_SECRET`: это другой ключ.
5. Добавить redirect URL, который буквально совпадает с production env:
- `https://example.com/api/vk-id/callback`.

## Обязательные ENV

Клиент/общие:

```env
NEXT_PUBLIC_VK_ID_SCOPE=phone email
```

Сервер:

```env
VK_AUTH_ENABLED=true
VK_ID_APP_ID=54464249
VK_ID_CLIENT_SECRET=защищенный_ключ_из_VK
VK_ID_REDIRECT_URI=https://example.com/api/vk-id/callback
VK_ID_DOMAIN=id.vk.ru
```

Опционально для диагностики:

```env
VK_DEBUG_LOGS=true
NEXT_PUBLIC_VK_DEBUG_LOGS=true
```

Важно: `NEXT_PUBLIC_VK_ID_SCOPE` — это список доступов (`phone email`), а не email поддержки, не URL и не произвольная строка. Если scope пустой или неверный, VK успешно вернет токены, но `/oauth2/user_info` может прийти без `phone`.

## Целевой flow

1. Пользователь нажимает VK One Tap на странице входа/регистрации.
2. VK SDK возвращает `code`, `device_id`, `state` и иногда `code_verifier`.
3. Клиент отправляет на сервер `code/deviceId/codeVerifier/state`.
4. Если SDK не вернул `code_verifier`, клиент может выполнить fallback `VKID.Auth.exchangeCode(code, deviceId)` и отправить на сервер `accessToken`/`idToken`.
5. Сервер получает профиль через `/oauth2/user_info`.
6. Сервер валидирует обязательные поля, находит или создает локального пользователя.
7. NextAuth/custom auth создает сессию, клиент делает redirect после успешного входа.

## Что переносим

Минимальный набор:

- `VkIdOneTapAuth` или аналогичный client component.
- `server/vkIdAuth.js` с `exchangeVkCode` и `fetchVkUserInfo`.
- NextAuth credentials provider `id: 'vk'` или `id: 'vkid'`.
- callback route `/api/vk-id/callback`.
- endpoint доступности VK auth, например `/api/global/auth/vk-status`.

## Серверный helper

`exchangeVkCode({ code, deviceId, codeVerifier, state })`:

- endpoint: `POST https://id.vk.ru/oauth2/auth`;
- query params:
  - `client_id`;
  - `grant_type=authorization_code`;
  - `redirect_uri`;
  - `device_id`;
  - `state`;
  - `code_verifier`, если есть;
- form body:
  - `code`.

Практический нюанс: для `/oauth2/auth` не складывай все параметры в body. В рабочем flow VK ожидает основную часть OAuth-параметров в query string, а `code` в form body.

`fetchVkUserInfo({ accessToken, idToken })`:

- endpoint: `POST https://id.vk.ru/oauth2/user_info`;
- query params:
  - `client_id`;
- form body:
  - `access_token`.

Парсинг профиля делай терпимым к структуре ответа:

- `json.user.phone`;
- `json.user.phone_number`;
- `json.phone`;
- `json.phone_number`;
- `json.data.phone`;
- `json.data.phone_number`;
- `json.data.user.phone`;
- `json.data.user.phone_number`.

Для `email` и `user_id` тоже лучше проверить `json`, `json.user`, `json.data`, `json.data.user`.

## Клиентский компонент One Tap

Загрузка SDK:

```js
https://unpkg.com/@vkid/sdk@2.6.5/dist-sdk/umd/index.js
```

Инициализация:

```js
VKID.Config.init({
  app: Number(appId),
  redirectUrl,
  responseMode: VKID.ConfigResponseMode.Callback,
  source: VKID.ConfigSource.LOWCODE,
  scope: 'phone email',
})
```

Обработка успеха:

```js
oneTap
  .render({ container, showAlternativeLogin: true })
  .on(VKID.WidgetEvents.ERROR, onVkError)
  .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, async (payload) => {
    const code = payload?.code
    const deviceId = payload?.device_id
    const codeVerifier = payload?.code_verifier || payload?.codeVerifier || ''
    let accessToken = ''
    let idToken = ''

    if (!codeVerifier && VKID?.Auth?.exchangeCode) {
      const exchangeData = await VKID.Auth.exchangeCode(code, deviceId)
      accessToken = exchangeData?.access_token || exchangeData?.accessToken || ''
      idToken = exchangeData?.id_token || exchangeData?.idToken || ''
    }

    await signIn('vk', {
      redirect: false,
      code,
      deviceId,
      codeVerifier,
      accessToken,
      idToken,
      state: payload?.state || '',
      mode,
    })
  })
```

После ошибки авторизации виджет может исчезнуть или уйти в timeout. Храни render nonce/state и перерисовывай One Tap после ошибки, очищая `container.innerHTML`.

## Phone-first сценарий

Если продукт считает телефон главным источником истины:

1. Требуй `phone` из VK.
2. Нормализуй телефон на сервере.
3. Ищи пользователя только по телефону.
4. Если пользователь найден — это вход, даже если пользователь нажал кнопку на форме регистрации.
5. Если пользователь не найден — это регистрация, даже если пользователь нажал кнопку на форме входа.
6. `vkId` можно сохранить как дополнительную привязку, но не использовать как главный ключ входа.
7. Если `vkId` уже привязан к другому пользователю, а телефон указывает на текущего пользователя, телефон должен победить. Старую привязку `vkId` нужно снять или обработать контролируемо.

Если продукт считает главным `vkId`, адаптируй этот блок под свои правила, но все равно явно опиши конфликт `phone/vkId/email`.

## Feature flag endpoint

Рекомендуемый endpoint:

```http
GET /api/global/auth/vk-status
```

Ответ:

```json
{
  "success": true,
  "data": {
    "allowVkAuth": true,
    "appId": "54464249",
    "redirectUri": "https://example.com/api/vk-id/callback",
    "scope": "phone email",
    "debug": false
  }
}
```

Не показывай кнопку VK, если:

- `VK_AUTH_ENABLED !== 'true'`;
- нет `VK_ID_APP_ID`;
- нет `VK_ID_CLIENT_SECRET`;
- нет `VK_ID_REDIRECT_URI`;
- business guard запрещает VK auth для текущего tenant/location.

## Callback route

`/api/vk-id/callback` может возвращать минимальный HTML:

```html
<!doctype html>
<html lang="ru">
  <head><meta charset="utf-8" /><title>VK ID</title></head>
  <body>
    <script>
      window.close();
    </script>
  </body>
</html>
```

Headers:

```http
Content-Type: text/html; charset=utf-8
Cache-Control: no-store
```

## Debug logging

Debug должен быть выключен по умолчанию и включаться env-флагом:

```env
VK_DEBUG_LOGS=true
NEXT_PUBLIC_VK_DEBUG_LOGS=true
```

На клиенте можно логировать:

- ключи `LOGIN_SUCCESS payload`;
- `hasCode`;
- `hasDeviceId`;
- `hasCodeVerifier`;
- `hasState`;
- `type`;
- ключи результата `VKID.Auth.exchangeCode`;
- `hasAccessToken`;
- `hasIdToken`;
- `hasUserId`;
- `scope`.

Не логировать:

- `code`;
- `access_token`;
- `refresh_token`;
- `id_token`;
- полный телефон;
- email, если он считается PII в проекте.

На сервере можно логировать:

- endpoint path;
- HTTP status;
- top-level keys ответа VK;
- `userKeys`;
- наличие `phone/email/user_id`;
- маскированный телефон, например `7***0020`;
- keys decoded `id_token` payload без значений.

## Типовые проблемы и решения

### Кнопка VK не отображается

Проверь:

- `VK_AUTH_ENABLED=true`;
- `VK_ID_APP_ID`;
- `VK_ID_CLIENT_SECRET`;
- `VK_ID_REDIRECT_URI`;
- endpoint `/api/global/auth/vk-status`;
- business feature flag;
- нет ли ошибок загрузки SDK.

### `/api/vk-id/auth` возвращает `VK_EXCHANGE_FAILED`

Проверь:

- `VK_ID_APP_ID` соответствует приложению, из которого взят One Tap код;
- `VK_ID_CLIENT_SECRET` — это защищенный ключ, а не сервисный ключ доступа;
- `VK_ID_REDIRECT_URI` буквально совпадает с redirect URL в VK;
- `/oauth2/auth` отправляет OAuth-параметры в query string, а `code` в body;
- если `code_verifier` нет, включен fallback через `VKID.Auth.exchangeCode`.

### `/api/vk-id/auth` возвращает `VK_PHONE_REQUIRED`

Проверь:

- в VK ID интеграции включен переключатель `Номер телефона`;
- `NEXT_PUBLIC_VK_ID_SCOPE=phone email`;
- пользователь заново дал согласие после изменения scope. Лучше тестировать в инкогнито или сбросить разрешения приложения в VK;
- browser debug показывает `scope`, где есть `phone`;
- server debug `/oauth2/user_info` показывает `json.user.phone.present: true` или другой phone-candidate.

Если `scope` не содержит `phone`, проблема в scope/env/согласиях VK. Если `scope` содержит `phone`, но `/oauth2/user_info` без телефона, проблема в настройках приложения VK ID или в том, что пользователь не предоставил номер.

### После ошибки кнопка пропадает

После неудачного входа VK widget может перейти в `timeout` или не перерендериться. На клиенте:

- храни `authInFlightRef`;
- после ошибки сбрасывай loading;
- увеличивай `renderNonce`;
- очищай контейнер перед render: `container.innerHTML = ''`.

## Acceptance checklist

1. `/login`: VK кнопка отображается при включенном флаге.
2. `/login`: успешный вход существующего пользователя по телефону создает сессию.
3. `/register`: если пользователь с телефоном уже есть, выполняется вход.
4. `/register`: если пользователя с телефоном нет, выполняется регистрация с нужными юридическими согласиями.
5. Если VK не отдал телефон, сервер возвращает контролируемую ошибку `VK_PHONE_REQUIRED`.
6. Если scope неверный, debug позволяет увидеть отсутствие `phone`.
7. Если VK feature flag выключен, кнопка не отображается.
8. Recovery/password flow работает независимо от VK.
9. Токены и PII не попадают в логи.
10. Точечный lint/build проходят.

## Готовый промпт для ИИ

```text
Нужно интегрировать VK ID One Tap в Next.js проект.

Сделай реализацию:
1) Добавь server helper vkIdAuth:
   - exchangeVkCode({ code, deviceId, codeVerifier, state })
   - fetchVkUserInfo({ accessToken, idToken })
   - /oauth2/auth: OAuth params в query string, code в form body
   - /oauth2/user_info: client_id в query string, access_token в body
   - единый формат success/error
2) Добавь auth provider или endpoint, который принимает code/deviceId/codeVerifier/accessToken/idToken/mode.
3) Добавь клиентский VkIdOneTapAuth:
   - SDK https://unpkg.com/@vkid/sdk@2.6.5/dist-sdk/umd/index.js
   - VKID.Config.init(..., scope: 'phone email')
   - LOGIN_SUCCESS -> серверный auth
   - fallback VKID.Auth.exchangeCode, если нет code_verifier
   - защита от повторной отправки
   - перерисовка виджета после ошибки
4) Добавь /api/vk-id/callback с window.close().
5) Добавь /api/global/auth/vk-status и условный render кнопки.
6) Реализуй phone-first логику: телефон VK обязателен, поиск/создание пользователя идет по телефону.
7) Добавь безопасный debug по VK_DEBUG_LOGS без токенов и полного телефона.
8) Прогони smoke checklist.

Ограничения:
- VK_ID_CLIENT_SECRET не отправлять в браузер;
- не логировать code/access_token/refresh_token/id_token;
- не ломать существующий вход по телефону/паролю;
- сохранить стиль текущего проекта.
```

## Референсные файлы

В проекте-источнике:

- `app/_components/location/VkIdOneTapAuth.jsx`
- `server/vkIdAuth.js`
- `server/authOptions.js` (provider `id: 'vk'`)
- `app/api/vk-id/callback/route.js`
- `hooks/useVkAuthAvailability.js`
- `app/api/global/auth/vk-status/route.js`

В ArtistCRM после адаптации:

- `app/login/loginInputs.js`
- `app/api/vk-id/auth/route.js`
- `app/api/vk-id/callback/route.js`
- `app/api/global/auth/vk-status/route.js`
- `server/vkIdAuth.js`
- `server/ensureVkUser.js`
