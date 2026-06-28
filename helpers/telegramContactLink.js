const TELEGRAM_HANDLE_LETTERS_REGEXP = /[a-z]/i

const normalizeTelegramValue = (value) =>
  String(value ?? '')
    .trim()
    .replace(/^tg:\/\/resolve\?(domain|phone)=/i, '')
    .replace(/^https?:\/\/t\.me\//i, '')
    .replace(/^t\.me\//i, '')
    .replace(/[?#].*$/, '')
    .replace(/^@/, '')
    .trim()

const normalizePhoneValue = (value) => {
  const digits = String(value ?? '').replace(/\D/g, '')

  return digits ? `+${digits}` : ''
}

export const getTelegramContactLink = ({ telegram, phone } = {}) => {
  const telegramValue = normalizeTelegramValue(telegram)
  const fallbackPhoneValue = normalizeTelegramValue(phone)
  const value = telegramValue || fallbackPhoneValue

  if (!value) return null

  if (TELEGRAM_HANDLE_LETTERS_REGEXP.test(value)) {
    return {
      href: `tg://resolve?domain=@${value}`,
      title: `@${value}`,
      type: 'domain',
    }
  }

  const phoneValue = normalizePhoneValue(value)
  if (!phoneValue) return null

  return {
    href: `tg://resolve?phone=${phoneValue}`,
    title: phoneValue,
    type: 'phone',
  }
}

export const buildTelegramContactLink = (telegram, phone) =>
  getTelegramContactLink({ telegram, phone })?.href ?? null

export default getTelegramContactLink
