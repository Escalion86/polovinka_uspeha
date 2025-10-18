import convertHtmlToText from '@helpers/convertHtmlToText'

let isConfigured = false
let configurationError = null
let cachedWebPush = null

const getWebPush = async () => {
  if (cachedWebPush) return cachedWebPush
  try {
    cachedWebPush = (await import('web-push')).default
    return cachedWebPush
  } catch (error) {
    configurationError = error
    return null
  }
}

const configureWebPush = async () => {
  if (isConfigured || configurationError) return { isConfigured, configurationError }

  const publicKey = process.env.WEB_PUSH_PUBLIC_KEY
  const privateKey = process.env.WEB_PUSH_PRIVATE_KEY
  const contact = process.env.WEB_PUSH_CONTACT_EMAIL || 'info@polovinkauspeha.ru'

  if (!publicKey || !privateKey) {
    configurationError = new Error('WEB_PUSH_PUBLIC_KEY or WEB_PUSH_PRIVATE_KEY not configured')
    return { isConfigured: false, configurationError }
  }

  const webpush = await getWebPush()
  if (!webpush) {
    return { isConfigured: false, configurationError }
  }
  webpush.setVapidDetails(`mailto:${contact}`, publicKey, privateKey)
  isConfigured = true
  return { isConfigured, configurationError }
}

const normalizePayload = (payload = {}) => {
  if (!payload) return null
  const normalized = { ...payload }
  if (normalized.body) {
    normalized.body = convertHtmlToText(normalized.body)
  }
  if (!normalized.icon) {
    normalized.icon = '/icon-192x192.png'
  }
  return normalized
}

const sendPushNotification = async ({ subscriptions = [], payload }) => {
  if (!subscriptions || subscriptions.length === 0) return { successes: [], errors: [] }

  const { isConfigured: configured, configurationError: configError } =
    await configureWebPush()

  if (!configured) {
    return {
      successes: [],
      errors: [{ error: configError || new Error('Push notifications not configured') }],
    }
  }

  const webpush = await getWebPush()
  if (!webpush) {
    return {
      successes: [],
      errors: [{ error: configurationError || new Error('web-push dependency not available') }],
    }
  }
  const notificationPayload = normalizePayload(payload)
  if (!notificationPayload) {
    return { successes: [], errors: [] }
  }

  const results = await Promise.allSettled(
    subscriptions.map(async ({ subscription }) => {
      const preparedSubscription = subscription?.endpoint
        ? subscription
        : undefined
      if (!preparedSubscription?.endpoint) {
        throw new Error('Invalid subscription payload')
      }
      const res = await webpush.sendNotification(
        preparedSubscription,
        JSON.stringify(notificationPayload)
      )
      return res
    })
  )

  const successes = []
  const errors = []

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      successes.push({
        subscription: subscriptions[index],
        response: result.value,
      })
    } else {
      errors.push({
        subscription: subscriptions[index],
        error: result.reason,
      })
    }
  })

  return { successes, errors }
}

export default sendPushNotification
