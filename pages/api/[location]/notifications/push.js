import checkLocationValid from '@server/checkLocationValid'
import sendPushNotification, {
<<<<<<< HEAD
  getVapidConfigurationStatus,
=======
>>>>>>> 249f1281 (Skip achievement pushes without VAPID keys)
  hasVapidKeyPairConfigured,
} from '@server/sendPushNotification'
import getUsersPushSubscriptions from '@server/getUsersPushSubscriptions'
import { createInvalidPushSubscriptionCollector } from '@server/pushSubscriptionsCleanup'
import dbConnect from '@utils/dbConnect'

const sanitizeSubscription = (subscription) => {
  if (!subscription || typeof subscription !== 'object') return null
  const { endpoint, keys, expirationTime } = subscription
  if (!endpoint || typeof endpoint !== 'string') return null
  return {
    endpoint,
    keys: keys ? { auth: keys.auth, p256dh: keys.p256dh } : undefined,
    expirationTime: expirationTime ?? null,
  }
}

export default async function handler(req, res) {
  const { query, method, body } = req
  const location = query?.location

  if (!location)
    return res?.status(400).json({ success: false, error: 'No location' })

  if (!checkLocationValid(location))
    return res?.status(400).json({ success: false, error: 'Invalid location' })

  const db = await dbConnect(location)
  if (!db) return res?.status(400).json({ success: false, error: 'db error' })

  const Users = db.model('Users')

  try {
    if (method === 'POST') {
      const { userId, subscription, userAgent } = body || {}
      const sanitizedSubscription = sanitizeSubscription(subscription)
      if (!userId || !sanitizedSubscription)
        return res
          ?.status(400)
          .json({ success: false, error: 'userId or subscription missing' })

      const user = await Users.findById(userId).lean()
      if (!user)
        return res?.status(404).json({ success: false, error: 'user not found' })

      const push = user.notifications?.push || {}
      const now = new Date().toISOString()
      const existingSubscriptions = Array.isArray(push.subscriptions)
        ? push.subscriptions
        : []

      const existingSubscription = existingSubscriptions.find(
        ({ endpoint }) => endpoint === sanitizedSubscription.endpoint
      )

      const filtered = existingSubscriptions.filter(
        ({ endpoint }) => endpoint !== sanitizedSubscription.endpoint
      )

      const updatedSubscriptions = [
        ...filtered,
        {
          ...sanitizedSubscription,
          userAgent: userAgent || existingSubscription?.userAgent || null,
          createdAt: existingSubscription?.createdAt || now,
          updatedAt: now,
        },
      ]

      const updatedUser = await Users.findByIdAndUpdate(
        userId,
        {
          $set: {
            'notifications.push.active': true,
            'notifications.push.subscriptions': updatedSubscriptions,
            'notifications.push.updatedAt': now,
          },
        },
        { new: true }
      ).lean()

<<<<<<< HEAD
<<<<<<< HEAD
      const debugEnabled = process.env.NODE_ENV !== 'production'
      const vapidStatus = getVapidConfigurationStatus()
      const responsePayload = { success: true, data: updatedUser }

      if (updatedUser?.notifications?.push?.active) {
        const subscriptions = getUsersPushSubscriptions([updatedUser])

        if (!hasVapidKeyPairConfigured()) {
          console.warn(
            '[notifications/push] Skip confirmation push: VAPID keys are not configured',
            { status: vapidStatus }
          )
        } else if (subscriptions.length === 0) {
          if (debugEnabled) {
            console.debug(
              '[notifications/push] Skip confirmation push: no subscriptions found for user',
              { userId }
            )
          }
        } else {
<<<<<<< HEAD
          const pushCleanup = createInvalidPushSubscriptionCollector({
            db,
            logPrefix: '[notifications/push] Confirmation push',
          })

=======
>>>>>>> 0af74715 (Add debug logging for push notifications)
          try {
            const result = await sendPushNotification({
=======
      if (updatedUser?.notifications?.push?.active) {
        if (!hasVapidKeyPairConfigured()) {
=======
      if (updatedUser?.notifications?.push?.active) {
        const hasVapidKeys = Boolean(
          (process.env.WEB_PUSH_PUBLIC_KEY ||
            process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY) &&
            process.env.WEB_PUSH_PRIVATE_KEY
        )

        if (!hasVapidKeys) {
>>>>>>> 2639adba (Gracefully handle missing push VAPID keys)
          console.warn(
            '[notifications/push] Skip confirmation push: VAPID keys are not configured'
          )
        } else {
          const subscriptions = getUsersPushSubscriptions([updatedUser])

          try {
            await sendPushNotification({
<<<<<<< HEAD
>>>>>>> 249f1281 (Skip achievement pushes without VAPID keys)
=======
>>>>>>> 2639adba (Gracefully handle missing push VAPID keys)
              subscriptions,
              payload: {
                title: 'Push-уведомления подключены',
                body: 'Вы успешно подключили push-уведомления на сайте Половинка успеха.',
                data: {
                  url: process.env.DOMAIN
                    ? `${process.env.DOMAIN}/${location}/cabinet/notifications`
                    : `/${location}/cabinet/notifications`,
                },
              },
<<<<<<< HEAD
<<<<<<< HEAD
              context: 'push-confirmation',
              debug: debugEnabled,
<<<<<<< HEAD
              onSubscriptionRejected: pushCleanup.handleRejected,
=======
>>>>>>> 0af74715 (Add debug logging for push notifications)
            })

            if (debugEnabled) {
              console.debug('[notifications/push] Confirmation push result', {
                userId,
                subscriptions: subscriptions.length,
                statusCode: Array.isArray(result)
                  ? result
                      .map((item) =>
                        item.status === 'fulfilled'
                          ? item.value?.statusCode
                          : 'rejected'
                      )
                      .join(',')
                  : result?.statusCode,
              })
            }
=======
            })
>>>>>>> 249f1281 (Skip achievement pushes without VAPID keys)
=======
            })
>>>>>>> 2639adba (Gracefully handle missing push VAPID keys)
          } catch (error) {
            console.error(
              '[notifications/push] Failed to send confirmation push',
              error
            )
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
          } finally {
            await pushCleanup.flush()
=======
>>>>>>> 0af74715 (Add debug logging for push notifications)
=======
>>>>>>> 249f1281 (Skip achievement pushes without VAPID keys)
=======
>>>>>>> 2639adba (Gracefully handle missing push VAPID keys)
          }
        }
      }

<<<<<<< HEAD
<<<<<<< HEAD
      if (debugEnabled) {
        responsePayload.meta = {
          vapid: vapidStatus,
          subscriptionsCount: Array.isArray(
            updatedUser?.notifications?.push?.subscriptions
          )
            ? updatedUser.notifications.push.subscriptions.length
            : 0,
        }
      }

      return res?.status(200).json(responsePayload)
=======
      return res?.status(200).json({ success: true, data: updatedUser })
>>>>>>> 249f1281 (Skip achievement pushes without VAPID keys)
=======
      return res?.status(200).json({ success: true, data: updatedUser })
>>>>>>> 2639adba (Gracefully handle missing push VAPID keys)
    }

    if (method === 'DELETE') {
      const { userId, endpoint } = body || {}
      if (!userId || !endpoint)
        return res
          ?.status(400)
          .json({ success: false, error: 'userId or endpoint missing' })

      const user = await Users.findById(userId).lean()
      if (!user)
        return res?.status(404).json({ success: false, error: 'user not found' })

      const push = user.notifications?.push || {}
      const existingSubscriptions = Array.isArray(push.subscriptions)
        ? push.subscriptions
        : []

      const updatedSubscriptions = existingSubscriptions.filter(
        (subscriptionItem) => subscriptionItem?.endpoint !== endpoint
      )

      const update = {
        'notifications.push.subscriptions': updatedSubscriptions,
        'notifications.push.updatedAt': new Date().toISOString(),
      }

      if (updatedSubscriptions.length === 0) {
        update['notifications.push.active'] = false
      }

      const updatedUser = await Users.findByIdAndUpdate(
        userId,
        {
          $set: update,
        },
        { new: true }
      ).lean()

      return res?.status(200).json({ success: true, data: updatedUser })
    }

    return res?.status(405).json({ success: false, error: 'Method not allowed' })
  } catch (error) {
    console.error('[notifications/push] handler failed', error)
    return res?.status(500).json({
      success: false,
      error: error?.message || 'Internal server error',
    })
  }
}
