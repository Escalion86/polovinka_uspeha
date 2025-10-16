import checkLocationValid from '@server/checkLocationValid'
import sendPushNotification from '@server/sendPushNotification'
import getUsersPushSubscriptions from '@server/getUsersPushSubscriptions'
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

  if (method === 'POST') {
    const { userId, subscription, userAgent } = body || {}
    const sanitizedSubscription = sanitizeSubscription(subscription)
    if (!userId || !sanitizedSubscription)
      return res
        ?.status(400)
        .json({ success: false, error: 'userId or subscription missing' })

    const user = await Users.findById(userId).lean()
    if (!user) return res?.status(404).json({ success: false, error: 'user not found' })

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

    if (updatedUser?.notifications?.push?.active) {
      const subscriptions = getUsersPushSubscriptions([updatedUser])
      await sendPushNotification({
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
      })
    }

    return res?.status(200).json({ success: true, data: updatedUser })
  }

  if (method === 'DELETE') {
    const { userId, endpoint } = body || {}
    if (!userId || !endpoint)
      return res?.status(400).json({ success: false, error: 'userId or endpoint missing' })

    const user = await Users.findById(userId).lean()
    if (!user) return res?.status(404).json({ success: false, error: 'user not found' })

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
}
