export const PHONE_MASK = '+7 (___) ___-____'
export const PHONE_REPLACEMENT = { _: /\d/ }

export const normalizePhoneValue = (rawValue) => {
  if (!rawValue) return ''

  let digits = String(rawValue).replace(/\D/g, '')
  if (!digits) return ''

  if (digits.length > 11) digits = digits.slice(-11)

  if (digits.length === 10) return `7${digits}`

  if (digits.length === 11) {
    if (digits[0] === '8') return `7${digits.slice(1)}`
    if (digits[0] === '7') return digits
    return `7${digits.slice(-10)}`
  }

  if (digits[0] === '8') return `7${digits.slice(1)}`
  if (digits[0] === '7') return digits
  return `7${digits}`
}

export const normalizePhoneFromPaste = (clipboardText) => {
  const digits = String(clipboardText ?? '').replace(/\D/g, '')
  if (!digits) return ''

  if (digits.length >= 11 && ['7', '8'].includes(digits[0])) {
    return normalizePhoneValue(digits.slice(0, 11))
  }

  return normalizePhoneValue(digits)
}

export const getPhoneAnomalyReasons = (rawValue) => {
  const digits = String(rawValue ?? '').replace(/\D/g, '')
  const reasons = []

  if (!digits) {
    reasons.push('empty')
    return reasons
  }

  if (digits.length !== 11) reasons.push('invalid_length')
  if (!['7', '8'].includes(digits[0])) reasons.push('invalid_prefix')
  if (/^77\d{9}$/.test(digits)) reasons.push('double_country_code_7')
  if (digits.length === 11 && digits[0] === '8') reasons.push('starts_with_8')

  return reasons
}

export const hasPhoneAnomaly = (rawValue) =>
  getPhoneAnomalyReasons(rawValue).length > 0
