# Runbook: безопасный запуск нового города

Дата: 2026-02-22  
Владелец процесса: `dev` / `president`

## Цель

Безопасно запустить новый город без регрессий в авторизации, событиях, ролях и уведомлениях.

## Предусловия

- Создан город в Dev UI (`slug`, `title`, `timeZone`).
- У города заданы флаги:
  - `isVisibleInPublicSelector=false`
  - `allowPublicListing=false`
  - `allowRegistration=false`
  - `allowLogin=false`
  - `allowEventSignup=false`
  - `allowEventManagement=false`
  - `allowVkAuth=false`
- Назначены ответственные по контенту и модерации.

## Этап 1. Техническая подготовка (hidden)

1. Проверить, что город есть в `/api/global/cities` и корректно сохраняется после редактирования.
2. Проверить, что город отсутствует в публичном селекторе (`/api/global/cities/public`).
3. Проверить, что регистрация и логин в новом городе заблокированы guard-ами.
4. Проверить наличие базового контента:
   - карточки позиционирования,
   - контакты,
   - правила/юридические тексты.

Критерий выхода: город полностью скрыт и недоступен для пользовательских операций.

## Этап 2. Внутренний smoke

1. Проверить `/{slug}` (рендер без ошибок).
2. Проверить `/{slug}/login`, `/{slug}/register`, `/{slug}/events`.
3. Проверить API:
   - `/api/[slug]/site`
   - `/api/[slug]/events`
   - `/api/[slug]/telefonip` (должен соблюдать флаги доступа).
4. Проверить роли:
   - `dev`/`president` могут управлять городом,
   - пользователи без прав не могут менять city settings.

Критерий выхода: нет 5xx, нет критичных UI/API ошибок.

## Этап 3. Soft launch

1. Включить:
   - `allowLogin=true`
   - `allowRegistration=true`
2. Оставить:
   - `isVisibleInPublicSelector=false`
   - `allowPublicListing=false`
3. При необходимости отдельно включить `allowVkAuth=true` только после VK smoke.
4. Протестировать первые реальные регистрации и входы в малом объеме.

Критерий выхода: стабильные login/register, без роста ошибок.

## Этап 4. Public launch

1. Включить:
   - `allowPublicListing=true`
   - `isVisibleInPublicSelector=true`
2. Проверить, что город появился на главной и в селекторах.
3. Проверить запись на мероприятия и базовую аналитику конверсии.

Критерий выхода: город публично доступен, ключевые сценарии проходят.

## Мониторинг 48 часов после запуска

- Ошибки API 4xx/5xx по `/{slug}` и `pages/api/[slug]/*`.
- Конверсия `visit -> register -> first event`.
- Количество неуспешных логинов/регистраций.
- Жалобы по уведомлениям и ролям.

## Откат

При критичных инцидентах немедленно:

1. `isVisibleInPublicSelector=false`
2. `allowPublicListing=false`
3. `allowRegistration=false`
4. `allowEventSignup=false`
5. `allowEventManagement=false`
6. Опционально `allowLogin=false` (только при тяжелом инциденте безопасности)

После отката зафиксировать причину, таймлайн и корректирующие действия.

