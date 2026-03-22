import webpush from 'web-push'
import crypto from 'crypto'

const PUSH_PUBLIC_KEY = process.env.WEB_PUSH_VAPID_PUBLIC_KEY
const PUSH_PRIVATE_KEY = process.env.WEB_PUSH_VAPID_PRIVATE_KEY
const PUSH_SUBJECT =
  process.env.WEB_PUSH_VAPID_SUBJECT || 'mailto:support@polovinka-uspeha.ru'
const PUSH_DEV_PRESIDENT_ONLY =
  process.env.PUSH_NOTIFICATIONS_DEV_PRESIDENT_ONLY === 'true'

let vapidInitialized = false

const stripHtml = (value) => {
  if (!value) return ''

  return String(value)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const normalizePushSubscription = (value) => {
  if (!value || typeof value !== 'object') return null

  const endpoint = String(value?.endpoint || '').trim()
  const p256dh = String(value?.keys?.p256dh || '').trim()
  const auth = String(value?.keys?.auth || '').trim()

  if (!endpoint || !p256dh || !auth) return null

  return {
    endpoint,
    expirationTime:
      typeof value?.expirationTime === 'number' ? value.expirationTime : null,
    keys: {
      p256dh,
      auth,
    },
  }
}

export const canRoleUsePush = (role) =>
  !PUSH_DEV_PRESIDENT_ONLY ||
  ['dev', 'president', 'supervisor'].includes(String(role || ''))

export const canUserUsePush = (user) => canRoleUsePush(user?.role)

export const sanitizePushNotificationsForUserData = (
  userData = {},
  fallbackRole = null
) => {
  if (!PUSH_DEV_PRESIDENT_ONLY || !userData || typeof userData !== 'object') {
    return userData
  }

  const role = userData?.role ?? fallbackRole
  if (canRoleUsePush(role)) return userData

  const notifications =
    userData?.notifications && typeof userData.notifications === 'object'
      ? { ...userData.notifications }
      : {}

  const incomingPushActive = Boolean(notifications?.push?.active)
  const incomingPushSubscriptionsCount = Array.isArray(
    notifications?.push?.subscriptions
  )
    ? notifications.push.subscriptions.length
    : 0

  notifications.push = {
    active: false,
    subscriptions: [],
  }

  if (incomingPushActive || incomingPushSubscriptionsCount > 0) {
    console.log('[PushDebug][Server] sanitizePushNotificationsForUserData:blocked', {
      role: String(role || ''),
      pushDevPresidentOnly: PUSH_DEV_PRESIDENT_ONLY,
      incomingPushActive,
      incomingPushSubscriptionsCount,
    })
  }

  return {
    ...userData,
    notifications,
  }
}

const getPushSubscriptionsFromUser = (user) => {
  if (!canUserUsePush(user)) return []
  if (!user?.notifications?.push?.active) return []

  const subscriptions = Array.isArray(user?.notifications?.push?.subscriptions)
    ? user.notifications.push.subscriptions
    : []

  const uniq = new Map()
  for (const subscription of subscriptions) {
    const normalized = normalizePushSubscription(subscription)
    if (!normalized) continue
    uniq.set(normalized.endpoint, normalized)
  }
  return Array.from(uniq.values())
}

const ensureVapid = () => {
  if (vapidInitialized) return true
  if (!PUSH_PUBLIC_KEY || !PUSH_PRIVATE_KEY) return false

  webpush.setVapidDetails(PUSH_SUBJECT, PUSH_PUBLIC_KEY, PUSH_PRIVATE_KEY)
  vapidInitialized = true
  return true
}

export const isPushEnabled = () => Boolean(PUSH_PUBLIC_KEY && PUSH_PRIVATE_KEY)

export const supportsPushForUser = (user) =>
  getPushSubscriptionsFromUser(user).length > 0

export const pushTextFromHtml = (text) => stripHtml(text)

export const notifyUsersWithPush = async ({
  db,
  location,
  users = [],
  title,
  text,
  url,
  tag,
  notificationType = 'unknown',
  notificationTypes = [],
  entities = {},
}) => {
  if (!Array.isArray(users) || users.length === 0) {
    return { success: true, successCount: 0, errorCount: 0 }
  }

  const pushTitle = String(title || 'Половинка успеха').trim()
  const pushBody = stripHtml(text).slice(0, 1000)
  if (!pushBody) return { success: true, successCount: 0, errorCount: 0 }

  const data = {
    url: url || (process.env.DOMAIN ? `${process.env.DOMAIN}/${location}` : '/'),
    location,
  }

  const staleByUserId = new Map()
  const deliveryByUserId = new Map()
  let successCount = 0
  let errorCount = 0

  const normalizedTypes = Array.isArray(notificationTypes)
    ? notificationTypes.filter(Boolean)
    : []
  const resolvedTypes =
    normalizedTypes.length > 0
      ? normalizedTypes
      : notificationType
        ? [notificationType]
        : ['unknown']

  const buildAudience = () => {
    const roleIds = new Set()
    const statuses = new Set()
    for (const user of users) {
      const roleId = String(user?.role || '').trim()
      if (roleId) roleIds.add(roleId)
      const status = String(user?.status || '').trim()
      if (status) statuses.add(status)
    }
    return {
      roleIds: Array.from(roleIds),
      statuses: Array.from(statuses),
    }
  }

  const persistSharedHistory = async ({
    deliveryStateByUserId,
    forcedError = null,
  } = {}) => {
    if (!db) return

    const states = Array.from(deliveryStateByUserId?.values?.() || [])
    const attemptedUsers = states.filter((state) => state?.attempted).length
    const successUsers = states.filter((state) => state?.success).length
    const failedUsers = states.filter(
      (state) => state?.attempted && !state?.success
    ).length
    const skippedUsers = states.filter((state) => !state?.attempted).length

    const historyDoc = {
      scope: 'shared',
      notificationId: crypto.randomUUID(),
      type: resolvedTypes[0] || 'unknown',
      types: resolvedTypes,
      title: pushTitle,
      body: pushBody,
      url: data?.url || null,
      tag: tag || `pu-${location || 'global'}`,
      location: location || null,
      deliveredAt: new Date(),
      audience: buildAudience(),
      entities:
        entities && typeof entities === 'object'
          ? Object.fromEntries(
              Object.entries(entities).filter(([, value]) => value !== undefined)
            )
          : {},
      channels: {
        push: {
          attempted: attemptedUsers > 0,
          success: successUsers > 0,
          error: forcedError,
          attemptedUsers,
          successUsers,
          failedUsers,
          skippedUsers,
          totalUsers: users.length,
        },
      },
    }

    try {
      await db.model('NotificationsHistory').create(historyDoc)
    } catch (error) {
      console.log('notifyUsersWithPush history save error', {
        error,
        type: historyDoc.type,
        location,
      })
    }
  }

  if (!ensureVapid()) {
    const failedByUser = new Map()
    for (const user of users) {
      const userId = String(user?._id || '')
      if (!userId) continue
      failedByUser.set(userId, {
        attempted: false,
        success: false,
        error: 'PUSH_NOT_CONFIGURED',
      })
    }
    await persistSharedHistory({
      deliveryStateByUserId: failedByUser,
      forcedError: 'PUSH_NOT_CONFIGURED',
    })
    return { success: false, reason: 'PUSH_NOT_CONFIGURED' }
  }

  for (const user of users) {
    const userId = String(user?._id || '')
    if (userId) {
      deliveryByUserId.set(userId, {
        attempted: false,
        success: false,
        error: null,
      })
    }

    const subscriptions = getPushSubscriptionsFromUser(user)
    if (!subscriptions.length) {
      if (userId) {
        deliveryByUserId.set(userId, {
          attempted: false,
          success: false,
          error: 'NO_SUBSCRIPTIONS',
        })
      }
      continue
    }

    if (userId) {
      deliveryByUserId.set(userId, {
        attempted: true,
        success: false,
        error: null,
      })
    }

    for (const subscription of subscriptions) {
      try {
        const notificationId = crypto.randomUUID()
        await webpush.sendNotification(
          subscription,
          JSON.stringify({
            title: pushTitle,
            body: pushBody,
            tag: tag || `pu-${location || 'global'}`,
            data: {
              ...data,
              notificationId,
            },
          })
        )
        successCount += 1
        if (userId) {
          const prev = deliveryByUserId.get(userId) || {}
          deliveryByUserId.set(userId, {
            ...prev,
            attempted: true,
            success: true,
            error: null,
          })
        }
      } catch (error) {
        errorCount += 1
        const statusCode = Number(error?.statusCode)
        if (userId) {
          const prev = deliveryByUserId.get(userId) || {}
          deliveryByUserId.set(userId, {
            ...prev,
            attempted: true,
            success: Boolean(prev?.success),
            error:
              statusCode && Number.isFinite(statusCode)
                ? `PUSH_HTTP_${statusCode}`
                : 'PUSH_SEND_ERROR',
          })
        }
        if (![404, 410].includes(statusCode)) continue

        if (!userId) continue

        const staleEndpoints = staleByUserId.get(userId) || new Set()
        staleEndpoints.add(subscription.endpoint)
        staleByUserId.set(userId, staleEndpoints)
      }
    }
  }

  if (db && staleByUserId.size > 0) {
    for (const [userId, staleEndpointsSet] of staleByUserId.entries()) {
      const staleEndpoints = Array.from(staleEndpointsSet).filter(Boolean)
      if (staleEndpoints.length === 0) continue

      try {
        await db.model('Users').findByIdAndUpdate(userId, {
          $pull: {
            'notifications.push.subscriptions': {
              endpoint: {
                $in: staleEndpoints,
              },
            },
          },
        })
      } catch (error) {
        console.log('notifyUsersWithPush stale cleanup error', {
          userId,
          error,
        })
      }
    }
  }

  await persistSharedHistory({
    deliveryStateByUserId: deliveryByUserId,
  })

  return {
    success: true,
    successCount,
    errorCount,
  }
}
