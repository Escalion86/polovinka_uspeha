# Миграция уведомлений `newEventsByTags -> newEvents`

## Назначение

Скрипт переводит legacy-ключ уведомлений `newEventsByTags` на новый ключ
`newEvents` в трех локациях: `krsk`, `nrsk`, `ekb`.

Миграция:
- `Users.notifications.settings.newEventsByTags -> Users.notifications.settings.newEvents`
- `Roles.notifications.newEventsByTags -> Roles.notifications.newEvents`
- после переноса legacy-ключ удаляется.

Скрипт идемпотентный: повторный запуск безопасен.

## Команды

- Dry-run (без записи):
```bash
npm run notifications-new-events:dry-run
```

- Применение (запись в БД):
```bash
npm run notifications-new-events:apply
```

- Dry-run по тестовым БД (`*_test`):
```bash
npm run notifications-new-events:dry-run:test
```

## Где смотреть отчет

После каждого запуска создается отчет:
- `docs/reports/migrate-new-events-notifications-<timestamp>.json`

В отчете:
- `summary.totalWouldUpdate` — сколько документов изменится в dry-run
- `summary.totalUpdated` — сколько документов реально обновлено в apply
- `perLocation` — разбивка по городам.

## Рекомендуемый порядок для продакшена

1. Запустить dry-run и сохранить отчет.
2. Проверить `summary/perLocation`.
3. Запустить apply.
4. Повторно запустить dry-run: ожидается `totalWouldUpdate = 0`.
