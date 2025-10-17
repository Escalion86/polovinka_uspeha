import checkLocationValid from '@server/checkLocationValid'
import sendPushNotification, {
  getVapidConfigurationStatus,
  hasVapidKeyPairConfigured,
} from '@server/sendPushNotification'
import getUsersPushSubscriptions from '@server/getUsersPushSubscriptions'
import { createInvalidPushSubscriptionCollector } from '@server/pushSubscriptionsCleanup'
import dbConnect from '@utils/dbConnect'

const summarizeDeliveryResults = (result) => {
  if (!result) {
    return { total: 0, successful: 0, failed: 0, statusCodes: [] }
  }

  if (!Array.isArray(result)) {
    const statusCode = result?.statusCode
    return {
      total: 1,
      successful: 1,
      failed: 0,
      statusCodes: typeof statusCode === 'number' ? [statusCode] : [],
    }
  }

  const total = result.length
  const successful = result.filter((item) => item.status === 'fulfilled').length
  const failed = total - successful
  const statusCodes = result.map((item) => {
    if (item.status === 'fulfilled') {
      return item.value?.statusCode ?? 'fulfilled'
    }
    return item.reason?.statusCode ?? item.reason?.status ?? 'rejected'
  })

  return { total, successful, failed, statusCodes }
}

export default async function handler(req, res) {
  const { method, query } = req
  const location = query?.location

  if (!location)
    return res?.status(400).json({ success: false, error: 'No location' })

  if (!checkLocationValid(location))
    return res?.status(400).json({ success: false, error: 'Invalid location' })

  if (method !== 'POST') {
    return res
      ?.status(405)
      .json({ success: false, error: 'Method not allowed', meta: { method } })
  }

  const vapidStatus = getVapidConfigurationStatus()
  if (!hasVapidKeyPairConfigured()) {
    return res?.status(400).json({
      success: false,
      error: 'VAPID ключи не настроены',
      meta: { vapid: vapidStatus },
    })
  }

  const db = await dbConnect(location)
  if (!db) return res?.status(400).json({ success: false, error: 'db error' })

  const Users = db.model('Users')

  try {
    const usersWithPush = await Users.find({
      'notifications.push.active': true,
      'notifications.push.subscriptions.0': { $exists: true },
    }).lean()

    const subscriptions = getUsersPushSubscriptions(usersWithPush)

    if (subscriptions.length === 0) {
      return res?.status(200).json({
        success: true,
        data: {
          message: 'Нет активных push-подписок',
          subscriptions: 0,
          deliveries: { total: 0, successful: 0, failed: 0, statusCodes: [] },
          cleanup: { removed: 0, users: 0 },
        },
      })
    }

    const pushCleanup = createInvalidPushSubscriptionCollector({
      db,
      logPrefix: '[notifications/push-test] Broadcast',
    })

    let deliveryResult
    let cleanupResult

    try {
      const result = await sendPushNotification({
        subscriptions,
        payload: {
          title: 'Тестовое уведомление',
          body: 'Это тестовое push-уведомление для проверки доставки.',
          data: {
            type: 'push-test',
            createdAt: new Date().toISOString(),
          },
        },
        context: 'push-test-broadcast',
        debug: process.env.NODE_ENV !== 'production',
        onSubscriptionRejected: pushCleanup.handleRejected,
      })

      deliveryResult = summarizeDeliveryResults(result)
    } catch (error) {
      console.error('[notifications/push-test] Failed to send test push', error)
      deliveryResult = {
        total: subscriptions.length,
        successful: 0,
        failed: subscriptions.length,
        statusCodes: [],
        error: error?.message,
      }
    } finally {
      cleanupResult = await pushCleanup.flush()
    }

    return res?.status(200).json({
      success: true,
      data: {
        subscriptions: subscriptions.length,
        deliveries: deliveryResult,
        cleanup: cleanupResult,
        vapid: vapidStatus,
      },
    })
  } catch (error) {
    console.error('[notifications/push-test] Unexpected error', error)
    return res?.status(500).json({
      success: false,
      error: 'Не удалось отправить тестовое push-уведомление',
    })
  }
}
