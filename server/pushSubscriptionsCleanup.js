const normalizeUserId = (userId) => {
  if (!userId) return null
  if (typeof userId === 'string') return userId
  if (typeof userId === 'number') return String(userId)
  if (typeof userId === 'object') {
    if (typeof userId.toString === 'function') {
      const value = userId.toString()
      return value && value !== '[object Object]' ? value : null
    }
  }
  return null
}

const isExpiredSubscriptionStatus = (statusCode) => {
  const code = Number(statusCode)
  return Number.isInteger(code) && (code === 404 || code === 410)
}

const removeInvalidPushSubscriptions = async ({
  db,
  invalidSubscriptions = [],
  logPrefix = '[push] cleanup',
}) => {
  if (!db) {
    console.warn(
      `${logPrefix} Skip removing invalid push subscriptions: db connection is missing`
    )
    return { removed: 0, users: 0 }
  }

  if (!Array.isArray(invalidSubscriptions) || invalidSubscriptions.length === 0) {
    return { removed: 0, users: 0 }
  }

  const Users = typeof db.model === 'function' ? db.model('Users') : null
  if (!Users) {
    console.warn(
      `${logPrefix} Skip removing invalid push subscriptions: Users model is unavailable`
    )
    return { removed: 0, users: 0 }
  }

  const grouped = new Map()
  invalidSubscriptions.forEach((item) => {
    if (!item) return
    const userId = normalizeUserId(item.userId)
    if (!userId) return

    const endpointsSource = Array.isArray(item.endpoints)
      ? item.endpoints
      : item.endpoint
      ? [item.endpoint]
      : []

    if (!endpointsSource.length) return

    const existing = grouped.get(userId) || new Set()
    endpointsSource.forEach((endpoint) => {
      if (typeof endpoint === 'string' && endpoint) existing.add(endpoint)
    })
    if (existing.size > 0) grouped.set(userId, existing)
  })

  if (grouped.size === 0) {
    return { removed: 0, users: 0 }
  }

  const now = new Date().toISOString()

  const results = await Promise.allSettled(
    Array.from(grouped.entries()).map(async ([userId, endpointsSet]) => {
      const endpoints = Array.from(endpointsSet)
      if (endpoints.length === 0) return null

      try {
        const updatedUser = await Users.findByIdAndUpdate(
          userId,
          {
            $pull: {
              'notifications.push.subscriptions': { endpoint: { $in: endpoints } },
            },
            $set: {
              'notifications.push.updatedAt': now,
            },
          },
          { new: true }
        ).lean()

        if (!updatedUser) {
          console.warn(
            `${logPrefix} User not found while removing invalid push subscriptions`,
            { userId, endpoints }
          )
          return null
        }

        const subscriptions =
          updatedUser?.notifications?.push?.subscriptions || []
        const remaining = Array.isArray(subscriptions) ? subscriptions.length : 0

        if (remaining === 0 && updatedUser?.notifications?.push?.active) {
          await Users.findByIdAndUpdate(userId, {
            $set: {
              'notifications.push.active': false,
              'notifications.push.updatedAt': now,
            },
          })
        }

        return { userId, removed: endpoints.length, remaining }
      } catch (error) {
        console.error(
          `${logPrefix} Failed to remove invalid push subscriptions`,
          {
            userId,
            endpoints,
          },
          error
        )
        return null
      }
    })
  )

  let removed = 0
  let users = 0

  results.forEach((result) => {
    if (result.status === 'fulfilled' && result.value) {
      users += 1
      removed += result.value.removed || 0
      if ((result.value?.removed || 0) > 0) {
        console.info(
          `${logPrefix} Removed invalid push subscriptions for user`,
          {
            userId: result.value.userId,
            removed: result.value.removed,
            remaining: result.value.remaining,
          }
        )
      }
    }
  })

  return { removed, users }
}

const createInvalidPushSubscriptionCollector = ({ db, logPrefix }) => {
  const invalidSubscriptions = []

  const handleRejected = ({ subscription, target, error }) => {
    if (!subscription || typeof subscription !== 'object') return
    const endpoint = subscription.endpoint
    if (!endpoint || typeof endpoint !== 'string') return

    const statusCode = error?.statusCode ?? error?.status
    if (!isExpiredSubscriptionStatus(statusCode)) return

    const userId =
      normalizeUserId(target?.userId) ||
      normalizeUserId(target?.user?._id)
    if (!userId) return

    invalidSubscriptions.push({ userId, endpoint, statusCode })
  }

  const flush = async () => {
    if (invalidSubscriptions.length === 0) return { removed: 0, users: 0 }

    try {
      return await removeInvalidPushSubscriptions({
        db,
        invalidSubscriptions,
        logPrefix,
      })
    } finally {
      invalidSubscriptions.length = 0
    }
  }

  const hasInvalid = () => invalidSubscriptions.length > 0

  return {
    handleRejected,
    flush,
    hasInvalid,
  }
}

export {
  createInvalidPushSubscriptionCollector,
  removeInvalidPushSubscriptions,
  isExpiredSubscriptionStatus,
}
