let cachedWebPush

const getVapidConfigurationStatus = () => {
  const publicKey =
    process.env.WEB_PUSH_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY ||
    ''
  const privateKey = process.env.WEB_PUSH_PRIVATE_KEY || ''

  const status = {
    hasPublicKey: Boolean(publicKey),
    hasPrivateKey: Boolean(privateKey),
    publicKeySource: process.env.WEB_PUSH_PUBLIC_KEY
      ? 'WEB_PUSH_PUBLIC_KEY'
      : process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
      ? 'NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY'
      : null,
    missing: [],
  }

  if (!status.hasPublicKey) status.missing.push('publicKey')
  if (!status.hasPrivateKey) status.missing.push('privateKey')

  return status
}

const hasVapidKeyPairConfigured = () => {
  const status = getVapidConfigurationStatus()
  return status.hasPublicKey && status.hasPrivateKey
}

const getWebPush = async () => {
  if (cachedWebPush) return cachedWebPush

  try {
    const module = await import('web-push')
    cachedWebPush = module?.default ?? module
  } catch (error) {
    console.error(
      '[sendPushNotification] Failed to load web-push module',
      error
    )
    throw error
  }

  const subject =
    process.env.WEB_PUSH_SUBJECT || process.env.NEXT_PUBLIC_WEB_PUSH_SUBJECT || 'mailto:admin@polovinka.ru'
  const publicKey =
    process.env.WEB_PUSH_PUBLIC_KEY || process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
  const privateKey = process.env.WEB_PUSH_PRIVATE_KEY

  if (hasVapidKeyPairConfigured()) {
    try {
      cachedWebPush.setVapidDetails(subject, publicKey, privateKey)
    } catch (error) {
      console.error('[sendPushNotification] Failed to set VAPID details', error)
    }
  } else {
    const status = getVapidConfigurationStatus()
    console.warn(
      '[sendPushNotification] VAPID keys are not configured, push delivery will fail',
      { status }
    )
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
  context,
  debug,
  onSubscriptionRejected,
} = {}) => {
  const targets = normalizeSubscriptions(subscription, subscriptions)

  if (targets.length === 0) {
    throw new Error('[sendPushNotification] `subscription` is required')
  }

  const debugEnabled =
    typeof debug === 'boolean' ? debug : process.env.NODE_ENV !== 'production'
  const logPrefix = context
    ? `[sendPushNotification:${context}]`
    : '[sendPushNotification]'
  const debugLog = (...args) => {
    if (debugEnabled) console.debug(logPrefix, ...args)
  }

  debugLog('Attempt to send push', {
    subscriptionCount: targets.length,
  })

  const webPush = await getWebPush()
  const serializedPayload = serializePayload(payload)

  const handleRejected = ({ error, subscription: rejectedSubscription, target }) => {
    if (typeof onSubscriptionRejected === 'function') {
      try {
        onSubscriptionRejected({
          error,
          subscription: rejectedSubscription,
          target,
        })
      } catch (callbackError) {
        console.error(
          `${logPrefix} Failed to handle rejected subscription callback`,
          callbackError
        )
      }
    }
  }

  const sendSingle = async (target) => {
    const normalizedSubscription = extractSubscription(target)

    if (!normalizedSubscription) {
      const error = new Error('[sendPushNotification] Invalid subscription payload')
      handleRejected({ error, subscription: normalizedSubscription, target })
      throw error
    }

    try {
      const response = await webPush.sendNotification(
        normalizedSubscription,
        serializedPayload,
        options
      )

      debugLog('Push delivered', {
        endpoint: normalizedSubscription.endpoint,
        statusCode: response?.statusCode,
      })

      return response
    } catch (error) {
      handleRejected({
        error,
        subscription: normalizedSubscription,
        target,
      })
      throw error
    }
  }

  if (targets.length === 1) {
    return sendSingle(targets[0])
  }

  const results = await Promise.allSettled(targets.map(sendSingle))

  results
    .filter((result) => result.status === 'rejected')
    .forEach((result) =>
      console.error(`${logPrefix} Push delivery failed`, result.reason)
    )

  const hasSuccessfulDeliveries = results.some(
    (result) => result.status === 'fulfilled'
  )

  if (!hasSuccessfulDeliveries) {
    throw new Error(`${logPrefix} Failed to deliver push notification`)
  }

  debugLog('Push delivery summary', {
    successful: results.filter((result) => result.status === 'fulfilled').length,
    failed: results.filter((result) => result.status === 'rejected').length,
  })

  return results
}

export default sendPushNotification
export { getWebPush, getVapidConfigurationStatus, hasVapidKeyPairConfigured }
