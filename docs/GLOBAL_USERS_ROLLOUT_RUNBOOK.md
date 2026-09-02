# GlobalUsers: rollout, контроль и откат

Дата актуализации: 03.09.2026.

## Назначение

Runbook описывает подготовленный runtime-контур `один пользователь -> много городов`:

- поэтапное включение по локациям;
- независимое управление чтением и записью;
- поиск существующих локальных профилей до создания (не замена уникальному индексу при конкурентных запросах);
- обезличенная проверка связей;
- быстрый откат без изменения данных.

## Runtime-флаги

Текущее поведение сохраняется при отсутствии новых ENV: GlobalUsers включен для
`krsk,nrsk,ekb`, чтение и запись активны. Локальный fallback и проверки
идентичности не отключаются флагами: их отключение могло бы создавать дубли.

- `GLOBAL_USERS_ENABLED=true|false` — общий аварийный выключатель.
- `GLOBAL_USERS_ROLLOUT_LOCATIONS=krsk,nrsk,ekb` — города активного rollout.
- `GLOBAL_PROFILE_READ_FROM_GLOBAL=true|false` — чтение профиля и связей из
  глобальной БД.
- `GLOBAL_PROFILE_WRITE_TO_GLOBAL=true|false` — синхронизация изменений в
  глобальную БД.

`GLOBAL_PROFILE_LOCAL_FALLBACK`, `GLOBAL_USERS_DEDUP_GUARD` и
`GLOBAL_USERS_REQUIRE_LINK` из ранних документов не реализованы как переключатели.
При `WRITE=false` helper поиска не изменяет даже локальную проекцию: новый
межгородской профиль не создается, поскольку его нельзя атомарно связать.

Конфигурация реализована в `server/globalUsersRuntimeConfig.mjs` и используется
в credentials, VK, Telegram, recovery, session и CRUD sync-потоках, а также при
чтении global consent в API пользователей и Telegram fallback рассылок.
Выключатель относится к `GlobalUsers`, не к `GlobalContent` (политики городов
продолжают работать).

## Проверка перед rollout

Все отчеты ниже работают без записи. Summary-режимы не сохраняют телефоны,
ФИО и идентификаторы пользователей.

```bash
npm run global-users:backfill:summary
npm run verify:global-links:summary
npm run global-users:cleanup-stale-profiles:dry-run
```

Критерии допуска:

- `invalidPhones = 0`;
- `duplicatePhonesWithinCity = 0`;
- все категории в `verify-global-links` равны `0`;
- dry-run очистки возвращает `staleProfilesFound = 0`.

## Поэтапное включение

1. Shadow write: `GLOBAL_PROFILE_READ_FROM_GLOBAL=false`, `GLOBAL_PROFILE_WRITE_TO_GLOBAL=true`.
2. Read rollout для `krsk`.
3. Расширение на `krsk,ekb`.
4. Полный rollout `krsk,nrsk,ekb`; ограничения закрывающегося `nrsk`
   продолжают определяться `cityPolicies`.
5. После каждого шага повторить summary verify и smoke auth-потоков.

## Очистка устаревших cityProfiles

Скрипт удаляет только недействительную связь `GlobalUsers.cityProfiles.<city>`
и соответствующий элемент из `cities[]`. Сам `GlobalUsers` и локальные анкеты
не удаляются. Неполные обратные связи, неоднозначные конфликты и случаи,
когда возможна перевязка на существующего пользователя, оставляются на ручной разбор.

```bash
npm run global-users:cleanup-stale-profiles:dry-run
# N — staleProfilesFound из согласованного dry-run, не произвольное число.
npm run global-users:cleanup-stale-profiles:apply -- --confirm-backup --confirm-maintenance --expected-count=N
npm run verify:global-links:summary
```

Write-запуск разрешен только после backup всех БД, проверки dry-run и остановки
writers на время maintenance. Скрипт сначала проверяет весь план; при неоднозначных
связях или другом количестве кандидатов ничего не меняет. Перед каждым изменением
сохраняет исходную ссылку в `globalusers_cityprofile_cleanup_backups`; фильтр
update защищает от замены уже изменившегося `cityProfiles`.

Для восстановления использовать backup из этой коллекции: после проверки
восстановить исходный `cityProfiles.<location>` и вернуть город в `cities[]`.
Если связь уже изменилась, не перезаписывать её вслепую. Для полного отката
данных использовать backup БД.

## Быстрый откат

### Уровень 1: отключить global read

```text
GLOBAL_PROFILE_READ_FROM_GLOBAL=false
GLOBAL_PROFILE_WRITE_TO_GLOBAL=true
```

Авторизация и сессии читают локальные анкеты, синхронизация в GlobalUsers
продолжается.

Перед отключением global read приостановить маркетинговые рассылки и cron:
локальная копия согласия может отставать от глобальной. Возобновлять отправку
только после отдельной сверки согласий. Флаги сами по себе не останавливают cron.

### Уровень 2: полностью отключить runtime GlobalUsers

```text
GLOBAL_USERS_ENABLED=false
```

Чтение и запись GlobalUsers прекращаются. Городские `Users` остаются рабочим
источником данных. После изменения ENV перезапустить приложение и проверить
login/recovery в `krsk`, `nrsk`, `ekb`.

### Уровень 3: откат по городу

Убрать проблемный город из `GLOBAL_USERS_ROLLOUT_LOCATIONS`, не меняя остальные
локации.

## Матрица smoke (приемка, не перечень уже выполненных проверок)

- credentials: существующий локальный пользователь и перенос в другой город;
- register/recovery: телефон, пароль, повторный вход;
- VK ID: login, register agreements, account-not-found, fallback на телефон;
- Telegram: вход по global Telegram ID и локальный fallback;
- session: глобальный профиль + локальные role/status/notification settings;
- события: запись и отмена не меняют связи пользователя;
- рассылки: согласие берется из GlobalUsers, городские настройки сохраняются.

## Подтверждено на 03.09.2026

- На обновленной локальной копии: 2 872 Users, 2 851 GlobalUsers; все категории
  связности равны нулю после удаления шести устаревших ссылок `krsk`.
  В этой копии также выполнен штатный backfill (2 845 GlobalUsers обновлено).
  Production не изменялся. Локальный cleanup 02.09 предшествовал добавлению
  backup-коллекции; исходное состояние этой копии восстанавливается повторным
  копированием из production, а не из ещё не созданных backup-записей.
- Повторный cleanup dry-run: 0 кандидатов; сами глобальные профили сохранены.
- Поведенческие unit-тесты rollback/read-only/конфликтов/локального ban для трех
  городов; внешние сервисы и отправка уведомлений в них подставлены.
- VK runtime test-mode: отрицательный login, модалка согласий, register UI
  и мобильный viewport `krsk`; пользователь не создан.
- Повторный UI smoke 03.09: VK register скрыт до двух обязательных согласий;
  login/recovery шести маршрутов возвращают HTTP 200. Это проверка загрузки,
  а не успешного восстановления пароля.
- Не подтверждены: полный успешный auth/recovery/Telegram flow, отправка реальных
  уведомлений, авторизация реального VK-пользователя, production rollout и его метрики.
  Эти проверки остаются критериями закрытия U1-T7/U1-T9/VK-T6.
