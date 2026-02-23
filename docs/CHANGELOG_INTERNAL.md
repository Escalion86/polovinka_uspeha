# Внутренний changelog (операционный)

Этот файл фиксирует внутренние значимые изменения проекта в сжатом виде.
Для продуктовых планов и статусов задач использовать `docs/ROADMAP.md`.

## 2026-02-22
- Внедрен и доработан трек VK ID Login (`VK-T2`..`VK-T5`), `VK-T6` переведен в работу.
- Добавлены city policies + guard-слой операций города.
- Введен Dev UI/API управления городами (`CITY-T1`..`CITY-T5`).
- Реализован read-path `GlobalUsers` в auth/register/recovery.

## 2026-02-18
- Реализована общая city-agnostic главная страница `app/page.jsx`.
- Завершена согласованность контентного каркаса по `aboutSpaceCards`.

## 2026-02-17
- Добавлена архитектура `GlobalUsers` и подключение к global БД.
- Подготовлен runbook и dry-run скрипт миграции.

## 2026-02-15
- Создан и переведен в рабочий формат `docs/ROADMAP.md`.
- Выполнен первичный аудит и унификация позиционирования первого касания.

## 2026-02-23
- Добавлен блок "О нашем пространстве" на главную `app/page.jsx` с использованием глобальных карточек (`/api/global/content/about-space-cards`).
- Создан пакет онбординг-документов:
  - `docs/ARCHITECTURE.md`
  - `docs/FEATURES.md`
  - `docs/DOMAIN.md`
  - `docs/DECISIONS.md`
  - `docs/API_CONTRACTS.md`
  - `docs/LOCAL_SETUP.md`
  - `docs/CHANGELOG_INTERNAL.md`
