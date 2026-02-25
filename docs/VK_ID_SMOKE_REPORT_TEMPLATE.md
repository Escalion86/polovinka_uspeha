# VK ID Smoke Report Template

Дата: `YYYY-MM-DD`  
Окружение: `dev|stage|prod`  
Релиз/коммит: `<sha>`

## 1. Конфиг и флаги

- `VK_ID_APP_ID`: установлен
- `VK_ID_REDIRECT_URI`: установлен и совпадает с VK Console
- `allowVkAuth`:
  - `krsk`: `true|false`
  - `nrsk`: `true|false`
  - `ekb`: `true|false`

## 2. Smoke по локациям

### krsk
- login page widget: `PASS|FAIL`
- register page widget: `PASS|FAIL`
- login success (linked user): `PASS|FAIL`
- login fallback (phone): `PASS|FAIL`
- telegram login unaffected: `PASS|FAIL`
- recovery unaffected: `PASS|FAIL`
- notes:

### nrsk
- login page widget: `PASS|FAIL`
- register page widget: `PASS|FAIL`
- login success (linked user): `PASS|FAIL`
- login fallback (phone): `PASS|FAIL`
- telegram login unaffected: `PASS|FAIL`
- recovery unaffected: `PASS|FAIL`
- notes:

### ekb
- login page widget: `PASS|FAIL`
- register page widget: `PASS|FAIL`
- login success (linked user): `PASS|FAIL`
- login fallback (phone): `PASS|FAIL`
- telegram login unaffected: `PASS|FAIL`
- recovery unaffected: `PASS|FAIL`
- notes:

## 3. Серверные проверки

- `[VK DEBUG] exchangeVkCode response`: `YES|NO`
- `[VK DEBUG] fetchVkUserInfo response`: `YES|NO`
- критичные ошибки callback/exchange: `NONE|LIST`

## 4. Метрики окна наблюдения (24ч)

- auth error rate change: `<%>`
- vk login success rate: `<%>`
- conversion login/register delta: `<%>`
- fallback-to-phone rate: `<%>`

## 5. Итог

- rollout decision: `GO|HOLD|ROLLBACK`
- owner:
- next review date:
