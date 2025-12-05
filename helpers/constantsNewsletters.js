export const NEWSLETTER_SEND_MODES = {
  IMMEDIATE: 'immediate',
  SCHEDULED: 'scheduled',
}

export const NEWSLETTER_SEND_MODE_LABELS = {
  [NEWSLETTER_SEND_MODES.IMMEDIATE]: 'Отправить сразу',
  [NEWSLETTER_SEND_MODES.SCHEDULED]: 'Отправить в выбранное время',
}

export const NEWSLETTER_SEND_MODE_OPTIONS = Object.entries(
  NEWSLETTER_SEND_MODE_LABELS
).map(([value, name]) => ({ value, name }))

export const NEWSLETTER_SENDING_STATUSES = {
  DRAFT: 'draft',
  WAITING: 'waiting',
  SENT: 'sent',
}

export const NEWSLETTER_SENDING_STATUS_LABELS = {
  [NEWSLETTER_SENDING_STATUSES.DRAFT]: 'Черновик',
  [NEWSLETTER_SENDING_STATUSES.WAITING]: 'Ожидает отправки',
  [NEWSLETTER_SENDING_STATUSES.SENT]: 'Отправлено',
}

export const NEWSLETTER_SENDING_STATUS_OPTIONS = Object.entries(
  NEWSLETTER_SENDING_STATUS_LABELS
).map(([value, name]) => ({ value, name }))

export const NEWSLETTER_SENDING_STATUS_OPTIONS_EDITABLE =
  NEWSLETTER_SENDING_STATUS_OPTIONS.filter(
    ({ value }) =>
      value === NEWSLETTER_SENDING_STATUSES.DRAFT ||
      value === NEWSLETTER_SENDING_STATUSES.WAITING
  )

const buildTimeOptions = () =>
  Array.from({ length: 48 }).map((_, index) => {
    const hours = String(Math.floor(index / 2)).padStart(2, '0')
    const minutes = index % 2 === 0 ? '00' : '30'
    const value = `${hours}:${minutes}`
    return { value, name: value }
  })

export const NEWSLETTER_TIME_OPTIONS = buildTimeOptions()
