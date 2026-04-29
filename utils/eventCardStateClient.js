'use client'

const eventCardStateCache = new Map()
const pendingBatches = new Map()
const BATCH_DELAY_MS = 40

const createDeferred = () => {
  let resolve
  let reject

  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

const getContextKey = ({ location, loggedUserId, activeRoleName }) =>
  [location || '', loggedUserId || '', activeRoleName || ''].join('::')

const getContextCache = (contextKey) => {
  if (!eventCardStateCache.has(contextKey)) {
    eventCardStateCache.set(contextKey, new Map())
  }

  return eventCardStateCache.get(contextKey)
}

const resolvePendingEntries = ({ contextKey, eventIds, dataById }) => {
  const contextCache = getContextCache(contextKey)

  for (const eventId of eventIds) {
    const entry = contextCache.get(eventId)
    if (!entry || entry.status !== 'pending') continue

    entry.status = 'resolved'
    entry.value = dataById?.[eventId] ?? null
    entry.resolve(entry.value)
  }
}

const flushBatch = async (contextKey) => {
  const pendingBatch = pendingBatches.get(contextKey)
  if (!pendingBatch) return

  pendingBatches.delete(contextKey)

  const eventIds = [...pendingBatch.eventIds]
  if (eventIds.length === 0) return

  try {
    const response = await fetch(`/api/${pendingBatch.location}/events/card-state`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventIds,
        loggedUserId: pendingBatch.loggedUserId,
        activeRoleName: pendingBatch.activeRoleName,
      }),
    })

    const payload = await response.json()
    if (!response.ok || !payload?.success) {
      throw new Error(payload?.data?.error?.message || response.statusText)
    }

    resolvePendingEntries({
      contextKey,
      eventIds,
      dataById: payload?.data || {},
    })
  } catch (error) {
    console.error('Failed to load event card state', error)
    resolvePendingEntries({
      contextKey,
      eventIds,
      dataById: {},
    })
  }
}

const scheduleBatch = ({
  contextKey,
  location,
  eventId,
  loggedUserId,
  activeRoleName,
}) => {
  if (!pendingBatches.has(contextKey)) {
    pendingBatches.set(contextKey, {
      location,
      loggedUserId,
      activeRoleName,
      eventIds: new Set(),
      timerId: null,
    })
  }

  const batch = pendingBatches.get(contextKey)
  batch.eventIds.add(eventId)

  if (!batch.timerId) {
    batch.timerId = setTimeout(() => flushBatch(contextKey), BATCH_DELAY_MS)
  }
}

export const readEventCardState = ({
  location,
  eventId,
  loggedUserId,
  activeRoleName,
}) => {
  if (!location || !eventId) return null

  const contextKey = getContextKey({ location, loggedUserId, activeRoleName })
  const contextCache = getContextCache(contextKey)
  const cachedEntry = contextCache.get(eventId)

  if (cachedEntry?.status === 'resolved') {
    return cachedEntry.value
  }

  if (cachedEntry?.status === 'pending') {
    throw cachedEntry.promise
  }

  const deferred = createDeferred()
  contextCache.set(eventId, {
    status: 'pending',
    promise: deferred.promise,
    resolve: deferred.resolve,
    reject: deferred.reject,
    value: null,
  })

  scheduleBatch({
    contextKey,
    location,
    eventId,
    loggedUserId,
    activeRoleName,
  })

  throw deferred.promise
}

export const invalidateEventCardStateByEvent = (eventId) => {
  if (!eventId) return

  for (const contextCache of eventCardStateCache.values()) {
    const entry = contextCache.get(eventId)
    if (entry?.status === 'pending' && typeof entry.resolve === 'function') {
      entry.resolve(null)
    }
    contextCache.delete(eventId)
  }
}

export const invalidateEventCardState = () => {
  for (const contextCache of eventCardStateCache.values()) {
    for (const entry of contextCache.values()) {
      if (entry?.status === 'pending' && typeof entry.resolve === 'function') {
        entry.resolve(null)
      }
    }
  }
  eventCardStateCache.clear()
  pendingBatches.clear()
}
