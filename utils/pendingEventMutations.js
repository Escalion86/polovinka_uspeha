'use client'

export const PENDING_EVENT_MUTATIONS_STORAGE_KEY =
  'polovinka:pending-event-mutations:v1'

export const PENDING_EVENT_MUTATIONS_CHANGED_EVENT =
  'pending-event-mutations-changed'

const isBrowserStorageAvailable = () =>
  typeof globalThis !== 'undefined' && Boolean(globalThis.localStorage)

const now = () => Date.now()

const createLocalId = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `local-${now()}-${Math.random().toString(36).slice(2)}`
}

const createMutationId = ({ operation, location, eventId }) => {
  if (operation === 'update' && eventId) {
    return `event-update:${location}:${eventId}`
  }

  return `event-create:${location}:${createLocalId()}`
}

const emitPendingEventMutationsChanged = (items) => {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function')
    return

  window.dispatchEvent(
    new CustomEvent(PENDING_EVENT_MUTATIONS_CHANGED_EVENT, {
      detail: { items },
    })
  )
}

export const getPendingEventMutations = () => {
  if (!isBrowserStorageAvailable()) return []

  try {
    const raw = globalThis.localStorage.getItem(
      PENDING_EVENT_MUTATIONS_STORAGE_KEY
    )
    if (!raw) return []

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const setPendingEventMutations = (items) => {
  if (!isBrowserStorageAvailable()) return []

  const safeItems = Array.isArray(items) ? items : []

  try {
    globalThis.localStorage.setItem(
      PENDING_EVENT_MUTATIONS_STORAGE_KEY,
      JSON.stringify(safeItems)
    )
    emitPendingEventMutationsChanged(safeItems)
    return safeItems
  } catch {
    return getPendingEventMutations()
  }
}

export const upsertPendingEventMutation = ({
  operation,
  location,
  eventId = null,
  payload,
}) => {
  const items = getPendingEventMutations()
  const timestamp = now()
  const id = createMutationId({ operation, location, eventId })
  const existing = items.find((item) => item.id === id)
  const nextItem = {
    id,
    operation,
    location,
    eventId,
    payload,
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
    attempts: 0,
    lastError: null,
    status: 'pending',
  }

  const nextItems = existing
    ? items.map((item) => (item.id === id ? nextItem : item))
    : [...items, nextItem]

  setPendingEventMutations(nextItems)
  return nextItem
}

export const removePendingEventMutation = (id) => {
  const nextItems = getPendingEventMutations().filter((item) => item.id !== id)
  setPendingEventMutations(nextItems)
  return nextItems
}

export const markPendingEventMutationFailed = (id, error) => {
  const nextItems = getPendingEventMutations().map((item) => {
    if (item.id !== id) return item

    return {
      ...item,
      attempts: Number(item.attempts || 0) + 1,
      lastError:
        error?.message ||
        error?.data?.data?.error?.message ||
        error?.data?.error?.message ||
        String(error || 'Не удалось сохранить мероприятие'),
      status: 'failed',
      updatedAt: now(),
    }
  })

  setPendingEventMutations(nextItems)
  return nextItems
}

export const clearPendingEventMutationsForLocation = (location) => {
  const nextItems = getPendingEventMutations().filter(
    (item) => item.location !== location
  )
  setPendingEventMutations(nextItems)
  return nextItems
}

export const getPendingEventMutationsForLocation = (location) =>
  getPendingEventMutations().filter((item) => item.location === location)
