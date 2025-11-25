const TRUE_VALUES = ['true', '1', 'yes', 'on']
const FALSE_VALUES = ['false', '0', 'no', 'off']

const parseBooleanFromInput = (value, defaultValue = false) => {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'number') {
    if (Number.isNaN(value)) return defaultValue
    return value === 1
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (TRUE_VALUES.includes(normalized)) return true
    if (FALSE_VALUES.includes(normalized)) return false
    if (!normalized) return defaultValue
    return defaultValue
  }

  return defaultValue
}

export default parseBooleanFromInput
