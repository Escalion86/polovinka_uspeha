# Global Users Architecture

## Цель
- Перейти к модели `один человек -> одна глобальная анкета` при сохранении текущих городских БД.
- Избежать breaking changes и выполнить мягкий rollout.

## Проблема текущей модели
- Пользователь может иметь разные анкеты с одним и тем же телефоном в разных БД городов.
- Сложнее поддерживать единый профиль, авторизацию и аналитику.
- Риски рассинхронизации данных по одному человеку.

## Принцип перехода
- Не объединяем все городские БД в одну сразу.
- Добавляем центральный слой `GlobalUsers`.
- Городские `Users` остаются как локальные профили города (совместимость).

## Данные

### Центральная БД
- Название (рабочее): `MONGODB_GLOBAL_DBNAME`.
- Коллекции:
  - `globalusers`
  - `globalusers_migration_logs` (опционально)
  - `globalusers_conflicts` (опционально)

### Коллекция `globalusers`
- Пример документа:

```json
{
  "_id": "ObjectId",
  "phone": 79991234567,
  "profile": {
    "firstName": "Иван",
    "secondName": "Иванов",
    "gender": "male",
    "birthday": "1990-01-01T00:00:00.000Z",
    "images": []
  },
  "cities": ["krsk", "ekb"],
  "cityProfiles": {
    "krsk": {
      "userId": "ObjectId",
      "status": "active",
      "role": "client",
      "linkedAt": "2026-02-17T00:00:00.000Z"
    },
    "ekb": {
      "userId": "ObjectId",
      "status": "active",
      "role": "client",
      "linkedAt": "2026-02-17T00:00:00.000Z"
    }
  },
  "meta": {
    "source": "migration|register|login",
    "version": 1
  },
  "createdAt": "2026-02-17T00:00:00.000Z",
  "updatedAt": "2026-02-17T00:00:00.000Z"
}
```

## Индексы
- `globalusers.phone` -> unique
- `globalusers.cities` -> non-unique
- `globalusers.cityProfiles.krsk.userId` -> optional helper index
- `globalusers.cityProfiles.nrsk.userId` -> optional helper index
- `globalusers.cityProfiles.ekb.userId` -> optional helper index

## Поток авторизации и регистрации

### Login
1. Пользователь вводит `phone + password + location`.
2. Сервис ищет `GlobalUser` по `phone`.
3. Если `GlobalUser` найден:
  - ищем `cityProfiles[location]`.
  - если отсутствует, создаем локального `Users` в выбранном городе и связываем.
4. Проверка пароля выполняется по локальной анкете города (этап совместимости).

### Register
1. После успешного подтверждения телефона:
  - создаем/обновляем `GlobalUser`.
  - создаем локального `Users` только для текущего города.
  - добавляем связь в `cityProfiles`.

### Recovery
- По телефону сначала определяется `GlobalUser`, затем выбирается локальный профиль выбранного города.

## Стратегия миграции

### Этап A (подготовка)
- Внедрить схему и доступ к центральной БД.
- Добавить read-only поиск `GlobalUser` в login/register (без обязательного использования).

### Этап B (скрипт миграции)
- Для каждого города:
  - прочитать `Users`;
  - нормализовать `phone`;
  - upsert в `GlobalUsers`;
  - записать `cityProfiles[location].userId`.

### Этап C (feature flag)
- Флаг `GLOBAL_USERS_ENABLED=true`:
  - включаем новый поток связывания в runtime.
- Флаг `GLOBAL_USERS_REQUIRE_LINK=true`:
  - включается только после стабилизации.

### Этап D (поэтапный rollout)
- Rollout по городам: `krsk -> nrsk -> ekb`.
- На каждом шаге мониторим ошибки login/register/recovery.

## Конфликты данных
- Базовое правило приоритетов:
  - `phone`: всегда глобальный ключ.
  - `firstName/secondName/birthday`: брать наиболее заполненный и свежий профиль.
  - `images`: объединение без дублей.
- Спорные случаи писать в `globalusers_conflicts` для ручной проверки.

## Идемпотентность миграции
- Обязателен режим `dry-run`.
- Повторный запуск не создает дубли (`upsert` по `phone`).
- Логи миграции содержат:
  - количество обработанных;
  - создано новых `GlobalUsers`;
  - обновлено существующих;
  - конфликтов.

## Обратная совместимость
- Текущие городские коллекции (`Users`, `EventsUsers`, `Payments`, `Roles`) не ломаются.
- Старые API-контракты сохраняются.
- Новый слой добавляется поверх текущей логики.

## План отката
- Выключить `GLOBAL_USERS_ENABLED`.
- Возврат к текущему потоку по локальным БД.
- Данные `GlobalUsers` остаются, но не используются в runtime.

## Риски
- Ошибки нормализации телефонов.
- Пользователь без телефона или с невалидным телефоном.
- Конфликт Telegram-привязок между городами.
- Частично заполненные профили после миграции.

## Метрики качества перехода
- Доля пользователей с валидной связкой `GlobalUser -> cityProfiles`.
- Ошибки login/register/recovery после включения фичефлага.
- Число конфликтов в `globalusers_conflicts`.
- Время обработки миграции и количество повторных запусков.

## Следующий шаг реализации
- Реализовать `dbConnectGlobal` и схему `globalUsersSchema`.
- Добавить минимальный read-path в login/register (без mandatory режима).
