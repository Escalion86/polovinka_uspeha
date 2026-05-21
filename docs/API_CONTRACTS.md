# API контракты и соглашения

## 1. Базовый формат ответа

Целевой стандарт для новых/изменяемых endpoint’ов:

### Успех
```json
{
  "success": true,
  "data": {}
}
```

### Ошибка
```json
{
  "success": false,
  "data": {
    "error": {
      "type": "ERROR_TYPE",
      "message": "Читаемое описание"
    }
  }
}
```

## 2. Фактическое состояние
- Большая часть endpoint’ов уже возвращает `success + data`.
- В legacy-частях встречаются ответы вида `{"success": false, "error": ...}`.
- При рефакторинге критичных API выравнивать формат постепенно, без breaking changes.

## 3. Ключевые endpoint’ы (ориентир)

### Auth и регистрация
- `POST /api/telefonip`
  - register/recovery flow через callback и установку пароля
  - city-guard на регистрацию
- `POST /api/auth/callback/credentials`
  - login через NextAuth `credentials`
- `POST /api/auth/callback/vk`
  - VK ID flow через NextAuth provider `vk`
- `POST /api/auth/callback/telegram`
  - Telegram auth flow

### Города и политики
- `GET /api/global/cities/public`
  - публичный список городов
  - может вернуть fallback при недоступной global БД
- `GET|POST /api/global/cities`
  - управление справочником городов (dev/president)
- `GET|POST /api/global/content/city-policies`
  - политики операций по городам

### Контент
- `GET|POST /api/global/content/about-space-cards`
  - карточки блока "О нашем пространстве"

### Локационные CRUD endpoint’ы
- Паттерн: `/api/[location]/<entity>`
- Во многих случаях обработка идет через `server/CRUD.js`

## 4. Политики доступов (server guard)
Операции проверяются через `assertCityOperationAllowed(location, operation)`:
- `login`
- `registration`
- `event_signup`
- `event_management`
- `public_listing`
- `vk_auth`

Если guard не пропускает операцию:
- обычно `403` + `success: false`
- payload зависит от конкретного endpoint’а

## 5. Рекомендации при добавлении нового API
1. Сразу закладывать единый envelope.
2. Добавлять guard-проверки по городу там, где операция может быть ограничена.
3. Не протаскивать локально-жесткие константы для одного города.
4. Учитывать аудит (`Histories`) для write-операций, если endpoint работает через CRUD-паттерн.
5. Не возвращать/логировать секреты, токены и лишние PII.

## 6. Примеры из текущего кода
- Унифицированный CRUD-ответ: `server/CRUD.js`
- Публичный список городов: `app/api/global/cities/public/route.js`
- Телефония register/recovery: `app/api/telefonip/route.js`
