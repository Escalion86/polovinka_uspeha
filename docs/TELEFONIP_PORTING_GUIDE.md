# TELEFONIP API Quick Guide (для переноса в другой проект)

## 1) Суть интеграции
Подтверждение телефона строится в 2 этапа:
1. Основной канал: обратный звонок TELEFONIP.
2. Fallback: SMS-код, если звонок не подтвержден или истек.

После успешного подтверждения номера разрешается завершить регистрацию или восстановление пароля.

---

## 2) Что нужно в ENV
- `TELEFONIP=<API_TOKEN>`

---

## 3) Формат телефона
Для TELEFONIP номер нужно отправлять в формате `8XXXXXXXXXX`.

Рекомендуемая нормализация пользовательского ввода:
- убрать все нецифровые символы
- если номер начинается с `7`, заменить первую цифру на `8`
- если начинается с `8`, оставить как есть
- если 10 цифр без префикса, добавить `8` спереди

---

## 4) TELEFONIP endpoint'ы
Базовые вызовы:

1. Старт обратного звонка:
`GET https://api.telefon-ip.ru/api/v1/authcalls/{TOKEN}/reverse_auth_phone_get?phone={PHONE_8_FORMAT}`

2. Проверка статуса звонка:
`GET https://api.telefon-ip.ru/api/v1/authcalls/{TOKEN}/reverse_auth_phone_check/{CALL_ID}`

3. Баланс (необязательно, для админки):
`GET https://api.telefon-ip.ru/api/v1/authcalls/{TOKEN}/get_balance/`

---

## 5) Минимальный внутренний API вашего проекта
Чтобы ИИ быстро реализовал в новом проекте, достаточно 4 endpoint'ов:

## 5.1 `POST /api/phone/verify/start`
Запускает обратный звонок.

Body:
```json
{
  "phone": "79XXXXXXXXX",
  "flow": "register|recovery"
}
```

Действия:
- валидировать телефон
- проверить бизнес-правила:
  - `register`: номер не должен быть уже зарегистрирован
  - `recovery`: номер должен существовать
- вызвать `reverse_auth_phone_get`
- сохранить запись подтверждения: `phone`, `callId`, `confirmed=false`

Возврат:
```json
{
  "success": true,
  "data": {
    "id": 12345,
    "auth_phone": "79XXXXXXXXX",
    "url_image": "https://..."
  }
}
```

## 5.2 `POST /api/phone/verify/check`
Проверяет, подтвердился ли звонок.

Body:
```json
{
  "phone": "79XXXXXXXXX",
  "callId": 12345
}
```

Действия:
- вызвать `reverse_auth_phone_check/{callId}`
- если статус `ok`, сравнить телефон из TELEFONIP с телефоном пользователя
- если совпал: выставить `confirmed=true`

Возврат:
```json
{
  "success": true,
  "data": {
    "status": "ok|expired|pending|..."
  }
}
```

## 5.3 `POST /api/phone/verify/sms/send` (fallback)
Используется, если звонок не сработал.

Body:
```json
{
  "phone": "79XXXXXXXXX"
}
```

Действия:
- сгенерировать PIN (4-6 цифр)
- отправить SMS через ваш SMS-провайдер
- сохранить `code`, `tryNum`, `confirmed=false`, `updatedAt`
- применить rate limit (например, 1 запрос в 60 сек)

## 5.4 `POST /api/phone/verify/sms/check` (fallback)
Проверка введенного SMS-кода.

Body:
```json
{
  "phone": "79XXXXXXXXX",
  "code": "1234"
}
```

Действия:
- проверить код и TTL
- при успехе: `confirmed=true`

---

## 6) Завершение процесса
Отдельный endpoint:
`POST /api/phone/verify/finalize`

Body:
```json
{
  "phone": "79XXXXXXXXX",
  "password": "plainPassword",
  "flow": "register|recovery"
}
```

Правила:
- завершать только если по этому `phone` есть `confirmed=true`
- `register`: создать пользователя (или дозаполнить существующего без пароля)
- `recovery`: обновить пароль существующего пользователя
- пароль обязательно хешировать
- после успеха удалить запись подтверждения

---

## 7) Клиентский flow
1. Пользователь вводит телефон.
2. `verify/start`.
3. UI показывает номер для звонка + QR.
4. Polling каждые 3 сек: `verify/check`.
5. Если `ok` -> шаг ввода пароля.
6. Если `expired`/таймаут -> предложить SMS fallback (`sms/send`, `sms/check`).
7. `finalize`.

---

## 8) Что важно для надежности
- rate limit на `start/check/sms/send`
- TTL подтверждения (например, 10-15 минут)
- лимит попыток ввода SMS-кода
- единый формат ошибок:
```json
{
  "success": false,
  "error": {
    "type": "phone|code|rate_limit|not_found|unknown",
    "message": "Текст ошибки"
  }
}
```

---

## 9) Короткий промпт для ИИ
```text
Реализуй подтверждение телефона через TELEFONIP:
- start: reverse_auth_phone_get
- check: reverse_auth_phone_check (polling)
- fallback: SMS send/check
- finalize: регистрация или reset пароля только при confirmed=true

Добавь:
- нормализацию телефона в 8XXXXXXXXXX для TELEFONIP
- хеширование пароля
- rate limit и TTL
- понятные JSON-ошибки
- polling 3 секунды на клиенте
```

