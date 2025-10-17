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

const sendPushNotification = async ({ subscription, payload, options } = {}) => {
  if (!subscription) {
    throw new Error('[sendPushNotification] `subscription` is required')
  }

  const webPush = await getWebPush()

  return webPush.sendNotification(subscription, serializePayload(payload), options)
}

export default sendPushNotification
export { getWebPush }
