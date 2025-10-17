let cachedWebPush

const getWebPush = async () => {
  if (cachedWebPush) return cachedWebPush

  try {
    const module = await import('web-push')
    cachedWebPush = module?.default ?? module
  } catch (error) {
    console.error('[sendPushNotification] Failed to load web-push module', error)
    throw error
  }

  const subject =
    process.env.WEB_PUSH_SUBJECT || process.env.NEXT_PUBLIC_WEB_PUSH_SUBJECT || 'mailto:admin@polovinka.ru'
  const publicKey = process.env.WEB_PUSH_PUBLIC_KEY || process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
  const privateKey = process.env.WEB_PUSH_PRIVATE_KEY

  if (publicKey && privateKey) {
    try {
      cachedWebPush.setVapidDetails(subject, publicKey, privateKey)
    } catch (error) {
      console.error('[sendPushNotification] Failed to set VAPID details', error)
    }
  } else {
    console.warn('[sendPushNotification] VAPID keys are not configured, push delivery will fail')
  }

  return cachedWebPush
}

const serializePayload = (payload) => {
  if (payload === undefined || payload === null) return ''
  if (typeof payload === 'string') return payload
  try {
    return JSON.stringify(payload)
  } catch (error) {
    console.error('[sendPushNotification] Failed to serialise payload', error)
    return ''
  }
}

const normalizeSubscriptions = (subscription, subscriptions) => {
  const targets = []

  if (subscription) targets.push(subscription)

  if (subscriptions) {
    if (Array.isArray(subscriptions)) targets.push(...subscriptions)
    else targets.push(subscriptions)
  }

  return targets
}

const extractSubscription = (target) => {
  if (!target) return undefined
  if (target.subscription) return target.subscription
  return target
}

const sendPushNotification = async ({
  subscription,
  subscriptions,
  payload,
  options,
} = {}) => {
  const targets = normalizeSubscriptions(subscription, subscriptions)

  if (targets.length === 0) {
    throw new Error('[sendPushNotification] `subscription` is required')
  }

  const webPush = await getWebPush()
  const serializedPayload = serializePayload(payload)

  const sendSingle = async (target) => {
    const normalizedSubscription = extractSubscription(target)

    if (!normalizedSubscription) {
      throw new Error('[sendPushNotification] Invalid subscription payload')
    }

    return webPush.sendNotification(
      normalizedSubscription,
      serializedPayload,
      options
    )
  }

  if (targets.length === 1) {
    return sendSingle(targets[0])
  }

  const results = await Promise.allSettled(targets.map(sendSingle))

  results
    .filter((result) => result.status === 'rejected')
    .forEach((result) =>
      console.error('[sendPushNotification] Push delivery failed', result.reason)
    )

  const hasSuccessfulDeliveries = results.some(
    (result) => result.status === 'fulfilled'
  )

  if (!hasSuccessfulDeliveries) {
    throw new Error('[sendPushNotification] Failed to deliver push notification')
  }

  return results
}

export default sendPushNotification
export { getWebPush }
