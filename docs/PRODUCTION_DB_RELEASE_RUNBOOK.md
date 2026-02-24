# Runbook: подготовка БД перед открытием авторизации в продакшне

Дата: 2026-02-23  
Владелец процесса: `dev`

## Цель

Перед открытием авторизации в продакшне безопасно выполнить миграции и проверки БД, чтобы не дать пользователям зайти на частично обновленную схему/логику.

## Схема запуска (рекомендуемая)

1. Выкатить релиз в прод.
2. Включить режим ограниченного доступа к логину (см. раздел ниже).
3. Выполнить миграции БД (dry-run -> apply -> верификация).
4. Пройти smoke-check критичных сценариев.
5. Открыть авторизацию для всех.

## Режим "логин только для DEV"

Поддерживается через env:
- `AUTH_DEV_ONLY_MODE=true`
- `AUTH_DEV_ONLY_ALLOW_PHONES=79990001122,79990003344` (опционально)

Как работает:
- при включенном `AUTH_DEV_ONLY_MODE` логин доступен только пользователям с ролью `dev`;
- дополнительно можно разрешить доступ по телефону через `AUTH_DEV_ONLY_ALLOW_PHONES`;
- ограничения применяются к auth-потокам `credentials`, `telegram`, `vk` и к phone-потоку (`/api/telefonip`).
- публичные страницы редиректятся на `/{location}/maintenance` (или `/maintenance`);
- исключения: `/{location}/logindev` и кабинет для уже авторизованного `dev` (или телефона из allowlist).

Важно:
- это не заменяет инфраструктурный maintenance-режим, но закрывает авторизацию на уровне приложения;
- для максимальной безопасности можно комбинировать с ограничением на уровне ingress/WAF.

## Подготовка (до миграций)

1. Зафиксировать версию релиза и commit hash.
2. Снять резервную копию БД (`mongodump`) по всем локациям:
   - `MONGODB_KRSK_DBNAME`
   - `MONGODB_NRSK_DBNAME`
   - `MONGODB_EKB_DBNAME`
3. Включить ограничение авторизации:
   - `AUTH_DEV_ONLY_MODE=true`
   - при необходимости указать `AUTH_DEV_ONLY_ALLOW_PHONES`
4. Убедиться, что все обязательные env заданы в проде.
5. Проверить доступность БД и отсутствие аварийных ошибок подключения.

## Обязательные миграционные шаги

Порядок: всегда `dry-run -> apply -> dry-run`.

### 1) Миграция ключа уведомлений `newEventsByTags -> newEvents`

```bash
npm run notifications-new-events:dry-run
npm run notifications-new-events:apply
npm run notifications-new-events:dry-run
```

Критерий успеха:
- в финальном dry-run `summary.totalWouldUpdate = 0`.

Документация:
- `docs/NEW_EVENTS_NOTIFICATIONS_MIGRATION.md`

### 2) Backfill `authProviders` / `registrationType`

```bash
npm run auth-providers:dry-run
npm run auth-providers:apply
npm run auth-providers:dry-run
```

Критерий успеха:
- в финальном dry-run `summary.totalUsersWouldUpdate = 0`.

### 3) Проверка дублей телефонов (контроль качества)

```bash
npm run duplicates:phones
```

Критерий успеха:
- нет новых критичных аномалий, которые ломают login/link пользователей.

### 4) Backfill `GlobalUsers` (обязательно при первом прод-раскрытии глобального профиля)

```bash
npm run global-users:backfill:dry-run
npm run global-users:backfill:apply
npm run global-users:backfill:dry-run
```

Критерий успеха:
- нет ошибок в apply;
- в dry-run после apply не появляется новых критичных аномалий;
- дубли телефонов внутри одного города устранены до apply.

## Опциональные шаги (по необходимости релиза)

- Dry-run по `GlobalUsers`:
```bash
npm run global-users:dry-run
```

- Индексы (если релиз требует):
```bash
node scripts/create-indexes.js
```

## Проверка отчетов

Все отчеты смотреть в:
- `docs/reports/*.json`

Минимум проверять:
- есть ли ошибки в запуске скриптов;
- значения `wouldUpdate/updated` по каждому городу;
- что повторный dry-run показывает нули.

## Smoke перед открытием авторизации

1. `/{location}/login` (credentials, telegram, VK если включен).
2. `/{location}/register`.
3. `recovery` через `telefonip`.
4. Проверка с ролью `dev` и обычным пользователем.
5. Проверка, что уведомления "Новые мероприятия" сохраняются и читаются корректно.

## Открытие авторизации

1. Выключить режим ограничения:
   - `AUTH_DEV_ONLY_MODE=false` (или удалить переменную)
2. Снять инфраструктурные ограничения (maintenance/allowlist), если использовались.
3. Включить доступ к `/[location]/login` и `/api/auth/*` для всех.
4. Наблюдать 30-60 минут:
   - 4xx/5xx по auth endpoints;
   - резкий рост ошибок login/register;
   - жалобы на недоступность входа.

## Быстрый откат

Если обнаружена критичная проблема:

1. Немедленно вернуть ограничение доступа к логину на уровне инфраструктуры.
2. Откатить релиз приложения.
3. При необходимости откатить БД из бэкапа.
4. Зафиксировать инцидент и отчет по причине.
