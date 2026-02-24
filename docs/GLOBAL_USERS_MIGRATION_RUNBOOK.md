# GlobalUsers Migration Runbook (Safe Mode)

## Цель
- Перейти к модели `один пользователь -> одна глобальная анкета` без потери данных.
- Выполнять миграцию только через проверяемые этапы и с возможностью отката.

## Жесткие правила безопасности
- Никаких `write`-операций до завершения dry-run и ручного согласования отчета.
- Перед каждым этапом — полный backup всех городских БД и (если есть) глобальной БД.
- Любое включение нового потока — только через feature flags и поэтапно.
- При аномалиях — немедленный откат на старый поток.

## Этап 0. Подготовка
- Проверить ENV:
  - `MONGODB_URI`
  - `MONGODB_KRSK_DBNAME`
  - `MONGODB_NRSK_DBNAME`
  - `MONGODB_EKB_DBNAME`
  - `MONGODB_GLOBAL_DBNAME` (опционально, для сверки с `GlobalUsers`)
- Убедиться, что есть `docs/GLOBAL_USERS_ARCHITECTURE.md`.
- Снять backup трех городских БД.

## Этап 1. Dry-run аудит (без записи)
- Запустить:
  - `npm run duplicates:phones`
  - `npm run global-users:dry-run`
  - `npm run global-users:backfill:dry-run`
- Скрипт:
  - читает пользователей из `krsk/nrsk/ekb`;
  - нормализует телефоны;
  - строит кандидатов `GlobalUsers`;
  - считает конфликты и дубли;
  - сохраняет JSON-отчет в `docs/reports/`.

## Этап 2. Ручное согласование
- Проверить в отчете:
  - `duplicates:phones`:
    - `duplicatesByCityGroups` — дубли внутри одного города (критично, исправить до write);
  - `invalidPhones` — невалидные телефоны;
  - `duplicatePhonesWithinCity` — дубли в одном городе;
  - `conflicts` — конфликтующие поля профиля по одному телефону;
  - `crossCityUsers` — пользователи, присутствующие в нескольких городах.
- До подтверждения владельцем продукта записи в `GlobalUsers` запрещены.

## Этап 2.5. Backfill `GlobalUsers` (после согласования)
- Запустить:
  - `npm run global-users:backfill:apply`
  - `npm run global-users:backfill:dry-run`
- Критерий успеха:
  - в apply нет ошибок;
  - в финальном dry-run `summary.candidates` соответствует ожидаемому объему;
  - `summary.duplicatePhonesWithinCity = 0` (или осознанно обработаны отдельно).

## Этап 3. Shadow-режим (после согласования)
- Включить только копирование в `GlobalUsers` (dual-write), чтение оставить по старому потоку.
- Мониторить:
  - ошибки login/register/recovery;
  - рассинхрон между локальными `Users` и `GlobalUsers`.

## Этап 4. Ограниченный rollout
- Включить read-path из `GlobalUsers` только для 1 локации/группы.
- После стабильности расширять rollout по локациям:
  - `krsk -> nrsk -> ekb`.

## Этап 5. Полный переход
- Полный switch только после стабильного периода и нулевых критичных ошибок.
- Старые данные не удалять до завершения окна наблюдения.

## Откат
- Выключить feature flags нового потока.
- Вернуть read/write на старую локальную модель.
- Зафиксировать инцидент и причину в changelog/report.
