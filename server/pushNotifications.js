import webpush from 'web-push'

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
  !PUSH_DEV_PRESIDENT_ONLY || ['dev', 'president'].includes(String(role || ''))

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
}) => {
  if (!ensureVapid()) return { success: false, reason: 'PUSH_NOT_CONFIGURED' }
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
  let successCount = 0
  let errorCount = 0

  for (const user of users) {
    const subscriptions = getPushSubscriptionsFromUser(user)
    if (!subscriptions.length) continue

    for (const subscription of subscriptions) {
      try {
        await webpush.sendNotification(
          subscription,
          JSON.stringify({
            title: pushTitle,
            body: pushBody,
            tag: tag || `pu-${location || 'global'}`,
            data,
          })
        )
        successCount += 1
      } catch (error) {
        errorCount += 1
        const statusCode = Number(error?.statusCode)
        if (![404, 410].includes(statusCode)) continue

        const userId = String(user?._id || '')
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

  return {
    success: true,
    successCount,
    errorCount,
  }
}
