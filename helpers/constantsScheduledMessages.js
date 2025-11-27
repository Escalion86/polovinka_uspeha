export const SCHEDULED_MESSAGE_STATUSES = {
  NEED_CHECK: 'needCheck',
  READY: 'ready',
  SENT: 'sent',
}

export const SCHEDULED_MESSAGE_STATUS_OPTIONS = [
  { value: SCHEDULED_MESSAGE_STATUSES.NEED_CHECK, name: 'Надо проверить' },
  { value: SCHEDULED_MESSAGE_STATUSES.READY, name: 'Готово к отправке' },
  { value: SCHEDULED_MESSAGE_STATUSES.SENT, name: 'Отправлено' },
]

export const SCHEDULED_MESSAGE_STATUS_NAME = {
  [SCHEDULED_MESSAGE_STATUSES.NEED_CHECK]: 'Надо проверить',
  [SCHEDULED_MESSAGE_STATUSES.READY]: 'Готово к отправке',
  [SCHEDULED_MESSAGE_STATUSES.SENT]: 'Отправлено',
}
