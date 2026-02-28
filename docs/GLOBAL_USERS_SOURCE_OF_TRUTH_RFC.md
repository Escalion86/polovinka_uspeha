# RFC: GlobalUsers как единый источник истины

Статус: draft  
Дата: 2026-02-28  
Владелец: команда backend/frontend

## 1. Контекст и проблема

Сейчас профильные данные пользователя дублируются в двух местах:
- `GlobalUsers` (глобальная сущность)
- `Users` (локальная сущность города)

Это создает:
- расхождения профиля между городами;
- дубли локальных пользователей;
- нестабильные сценарии авторизации/линковки провайдеров (VK/Telegram/phone);
- высокую сложность сопровождения.

## 2. Целевое состояние

`GlobalUsers` становится единственным источником истины по профилю.

`Users` хранит только городскую проекцию:
- `_id`
- `globalUserId`
- `phone` (денормализация для связей и быстрых выборок)
- `role`
- `status`
- локальные метрики и счетчики (`signedUpEventsCount`, `eventAchievements`, техполя)

Профильные поля (ФИО, контакты, соцсети, фото, birthday, privacy/security и т.д.) читаются и изменяются только через `GlobalUsers`.

## 3. Инварианты

1. В рамках одного города у одного `globalUserId` должен быть один канонический `Users`.
2. Для каждого города связь хранится в `GlobalUsers.cityProfiles.<location>.userId`.
3. Вход через любой провайдер должен приводить к одному и тому же локальному `Users` для выбранного города.
4. Создание нового локального `Users` разрешено только если в выбранном городе связка отсутствует.

## 4. Границы хранения данных

### 4.1 Что остается в `Users`

- идентификаторы и связь с global;
- городские права/статусы;
- локальные счетчики;
- локальные технические поля, которые не имеют смысла глобально.

### 4.2 Что переносится в `GlobalUsers`

- персональные профильные поля;
- контакты и соцсети;
- настройки приватности;
- базовые notification-настройки пользователя.

## 5. План миграции

## Этап A. Контракт и freeze

Цель: остановить появление новых расхождений.

Задачи:
- зафиксировать контракт полей `GlobalUsers`/`Users`;
- запретить новые записи профильных полей в `Users`;
- оставить только временный fallback-read из `Users`.

Файлы:
- `server/authOptions.js`
- `server/ensureLocalUserFromGlobalByPhone.js`
- `server/syncGlobalUserLink.js`
- `schemas/usersSchema.js`
- `docs/API_CONTRACTS.md` (при необходимости)

## Этап B. Read-through (чтение профиля из global)

Цель: UI/API всегда показывает профиль из `GlobalUsers`.

Задачи:
- в `session` и серверных агрегаторах профиль брать из `GlobalUsers`;
- fallback к локальным полям оставить только как временный;
- добавить debug-метрики fallback-срабатываний.

Файлы:
- `server/authOptions.js` (callbacks.session)
- `server/fetchProps.js` и связанные server-read path
- UI-компоненты, зависящие от профиля (`layouts/content/*`, `layouts/modals/*`)

## Этап C. Write-through (запись профиля только в global)

Цель: все редактирование анкеты централизовано.

Задачи:
- обновления анкеты писать в `GlobalUsers`;
- локально в `Users` обновлять только city-поля;
- синхронизацию локальных дублей отключить.

Файлы:
- `server/CRUD.js` (ветки обновления `Users`)
- API анкеты и модалок пользователя
- `layouts/content/QuestionnaireContent.js`
- `layouts/modals/modalsFunc/userFunc.js`

## Этап D. Data migration + дедупликация

Цель: привести данные к целевой модели.

Задачи:
- dry-run отчет по дублям `Users` на один `phone/globalUserId`;
- выбор канонического `Users` по `cityProfiles.<location>.userId`;
- перенос нужных данных из локальных дублей;
- отвязка/архивация дублей;
- verify-скрипт связей.

Скрипты:
- `scripts/find-duplicate-phones.cjs`
- `scripts/verify-global-links.cjs`
- дополнительные скрипты дедупликации (новые)

## Этап E. Cleanup

Цель: удалить legacy-слой.

Задачи:
- удалить профильные поля из `usersSchema` (или пометить deprecated и убрать использование);
- удалить fallback-read из `Users`;
- обновить внутреннюю документацию и runbook.

Файлы:
- `schemas/usersSchema.js`
- `docs/GLOBAL_USERS_MIGRATION_RUNBOOK.md`
- `docs/ARCHITECTURE.md`

## 6. Фичефлаги rollout

Рекомендуемые флаги:
- `GLOBAL_PROFILE_READ_FROM_GLOBAL=true`
- `GLOBAL_PROFILE_WRITE_TO_GLOBAL=true`
- `GLOBAL_PROFILE_LOCAL_FALLBACK=true|false`
- `GLOBAL_USERS_DEDUP_GUARD=true`

Rollout:
1. Включить read-from-global.
2. Включить write-to-global.
3. Прогнать дедупликацию.
4. Выключить local-fallback.

## 7. Риски и меры

Риск: потеря части профильных данных.  
Мера: dry-run, бэкап, idempotent-скрипты, post-verify отчеты.

Риск: вход в неверный локальный профиль.  
Мера: жесткий приоритет `cityProfiles.<location>.userId` + дедуп guard.

Риск: регресс ролей/статусов по городам.  
Мера: отдельные проверки на `role/status` для `krsk/nrsk/ekb`.

## 8. Acceptance criteria

1. Нет новых дублей `Users` при auth через phone/VK/telegram.
2. Профиль пользователя одинаков в разных городах и читается из `GlobalUsers`.
3. При смене города создается ровно один локальный `Users` (если не было), со статусом/ролью по политике.
4. Все критичные сценарии проходят smoke:
- login/register/recovery;
- смена города;
- редактирование анкеты;
- запись/отмена записи на мероприятия;
- уведомления.

## 9. Ближайший practical backlog

1. Ввести явные фичефлаги в `server/authOptions.js` и `server/CRUD.js`.
2. Сделать API/скрипт безопасной дедупликации локальных `Users` по `globalUserId + location`.
3. Перевести обновление анкеты на write-to-global.
4. Добавить технический отчет: `globalUserId -> [local users by city]`.

