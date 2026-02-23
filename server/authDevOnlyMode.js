import { normalizePhoneValue } from '@helpers/phoneUtils'

const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on'])

const parseBooleanEnv = (value) => {
  if (typeof value === 'boolean') return value
  if (typeof value !== 'string') return false
  return TRUE_VALUES.has(value.trim().toLowerCase())
}

const normalizePhone = (value) => normalizePhoneValue(value)

const getAllowedPhones = () => {
  const raw = process.env.AUTH_DEV_ONLY_ALLOW_PHONES || ''
  if (!raw) return new Set()

  return new Set(
    raw
      .split(',')
      .map((item) => normalizePhone(item))
      .filter(Boolean)
  )
}

export const isAuthDevOnlyModeEnabled = () =>
  parseBooleanEnv(process.env.AUTH_DEV_ONLY_MODE)

export const isAuthDevOnlyPhoneAllowed = (phone) => {
  const normalizedPhone = normalizePhone(phone)
  if (!normalizedPhone) return false
  return getAllowedPhones().has(normalizedPhone)
}

export const isAuthDevOnlyUserAllowed = (user, fallbackPhone) => {
  if (!isAuthDevOnlyModeEnabled()) return true
  if (user?.role === 'dev') return true

  if (isAuthDevOnlyPhoneAllowed(user?.phone)) return true
  if (isAuthDevOnlyPhoneAllowed(fallbackPhone)) return true

  return false
}
