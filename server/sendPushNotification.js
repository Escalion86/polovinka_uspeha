import crypto from 'crypto'
import http from 'http'
import https from 'https'
import { URL } from 'url'

const DEFAULT_TTL_SECONDS = 60 * 60 * 24
const DEFAULT_EXPIRATION_SECONDS = 12 * 60 * 60
const FALLBACK_SUBJECT = 'mailto:admin@polovinka.ru'

const normalizeVapidKey = (value) => (value ? value.replace(/\s+/g, '') : '')

const base64UrlEncode = (input) => {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input)
  return buffer
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

const base64UrlDecode = (input) => {
  if (!input) return Buffer.alloc(0)
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4 === 0 ? 0 : 4 - (normalized.length % 4)
  return Buffer.from(normalized.padEnd(normalized.length + padding, '='), 'base64')
}

const toPemFormat = (derBuffer, type) => {
  const base64 = derBuffer.toString('base64')
  const formatted = base64.replace(/(.{64})/g, '$1\n')
  if (type === 'private') {
    return `-----BEGIN EC PRIVATE KEY-----\n${formatted}\n-----END EC PRIVATE KEY-----`
  }
  return `-----BEGIN PUBLIC KEY-----\n${formatted}\n-----END PUBLIC KEY-----`
}

const createEcPrivateKeyPem = (privateKeyBase64Url, publicKeyBase64Url) => {
  const privateKey = base64UrlDecode(privateKeyBase64Url)
  const publicKey = base64UrlDecode(publicKeyBase64Url)

  if (privateKey.length !== 32) {
    throw new Error('[sendPushNotification] Invalid VAPID private key length')
  }
  if (publicKey.length !== 65) {
    throw new Error('[sendPushNotification] Invalid VAPID public key length')
  }

  const der = Buffer.concat([
    Buffer.from('30770201010420', 'hex'),
    privateKey,
    Buffer.from('a00a06082a8648ce3d030107a144034200', 'hex'),
    publicKey,
  ])

  return toPemFormat(der, 'private')
}

const createVapidToken = ({ audience, subject, publicKey, privateKey, expiresIn }) => {
  const expirationSeconds = expiresIn || DEFAULT_EXPIRATION_SECONDS
  const expiration = Math.floor(Date.now() / 1000) + expirationSeconds

  const header = { typ: 'JWT', alg: 'ES256' }
  const payload = { aud: audience, exp: expiration, sub: subject }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const data = `${encodedHeader}.${encodedPayload}`

  const pem = createEcPrivateKeyPem(privateKey, publicKey)
  const signature = crypto.sign('sha256', Buffer.from(data), {
    key: pem,
    dsaEncoding: 'ieee-p1363',
  })

  return `${data}.${base64UrlEncode(signature)}`
}

const getVapidConfigurationStatus = () => {
  const rawPublicKey =
    process.env.WEB_PUSH_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY ||
    ''
  const rawPrivateKey = process.env.WEB_PUSH_PRIVATE_KEY || ''

  const publicKey = normalizeVapidKey(rawPublicKey)
  const privateKey = normalizeVapidKey(rawPrivateKey)

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

const hkdfExtract = (salt, ikm) =>
  crypto.createHmac('sha256', salt).update(ikm).digest()

const hkdfExpand = (prk, info, length) => {
  const iterations = Math.ceil(length / 32)
  const buffers = []
  let prev = Buffer.alloc(0)

  for (let i = 0; i < iterations; i += 1) {
    const hmac = crypto.createHmac('sha256', prk)
    hmac.update(prev)
    hmac.update(info)
    hmac.update(Buffer.from([i + 1]))
    prev = hmac.digest()
    buffers.push(prev)
  }

  return Buffer.concat(buffers).slice(0, length)
}

const hkdf = (salt, ikm, info, length) => {
  const prk = hkdfExtract(salt, ikm)
  return hkdfExpand(prk, info, length)
}

const createContext = (receiverPublicKey, senderPublicKey) => {
  const label = Buffer.from('P-256', 'utf8')
  const separator = Buffer.from([0x00])
  const receiverLength = Buffer.alloc(2)
  receiverLength.writeUInt16BE(receiverPublicKey.length, 0)
  const senderLength = Buffer.alloc(2)
  senderLength.writeUInt16BE(senderPublicKey.length, 0)

  return Buffer.concat([
    label,
    separator,
    receiverLength,
    receiverPublicKey,
    senderLength,
    senderPublicKey,
  ])
}

const encryptPayload = (subscription, payloadBuffer) => {
  if (!payloadBuffer || payloadBuffer.length === 0) {
    return {
      body: Buffer.alloc(0),
      salt: null,
      serverPublicKey: null,
    }
  }

  const subscriptionKeys = subscription?.keys || {}
  const authSecret = base64UrlDecode(subscriptionKeys.auth)
  const receiverPublicKey = base64UrlDecode(subscriptionKeys.p256dh)

  if (authSecret.length === 0 || receiverPublicKey.length === 0) {
    throw new Error('[sendPushNotification] Subscription is missing encryption keys')
  }

  const salt = crypto.randomBytes(16)
  const serverECDH = crypto.createECDH('prime256v1')
  serverECDH.generateKeys()
  const serverPublicKey = serverECDH.getPublicKey()
  const sharedSecret = serverECDH.computeSecret(receiverPublicKey)

  const authInfo = Buffer.from('Content-Encoding: auth\0', 'utf8')
  const prk = hkdf(authSecret, sharedSecret, authInfo, 32)

  const context = createContext(receiverPublicKey, serverPublicKey)
  const nonceInfo = Buffer.concat([
    Buffer.from('Content-Encoding: nonce\0', 'utf8'),
    context,
  ])
  const cekInfo = Buffer.concat([
    Buffer.from('Content-Encoding: aes128gcm\0', 'utf8'),
    context,
  ])

  const nonce = hkdf(salt, prk, nonceInfo, 12)
  const contentEncryptionKey = hkdf(salt, prk, cekInfo, 16)

  const padding = Buffer.alloc(2)
  padding.writeUInt16BE(0, 0)
  const plaintext = Buffer.concat([padding, payloadBuffer])

  const cipher = crypto.createCipheriv('aes-128-gcm', contentEncryptionKey, nonce)
  cipher.setAuthTagLength(16)
  cipher.setAAD(Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02]))

  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()])
  const authTag = cipher.getAuthTag()

  return {
    body: Buffer.concat([ciphertext, authTag]),
    salt: base64UrlEncode(salt),
    serverPublicKey: base64UrlEncode(serverPublicKey),
  }
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

const sendPushRequest = async ({
  target,
  payloadBuffer,
  options,
  logPrefix,
  debugLog,
  onSubscriptionRejected,
}) => {
  const subscription = extractSubscription(target)

  if (!subscription?.endpoint) {
    const error = new Error('[sendPushNotification] Invalid subscription payload')
    if (typeof onSubscriptionRejected === 'function') {
      onSubscriptionRejected({ error, subscription, target })
    }
    throw error
  }

  const endpoint = subscription.endpoint
  const endpointUrl = new URL(endpoint)
  const audience = `${endpointUrl.protocol}//${endpointUrl.host}`

  if (!hasVapidKeyPairConfigured()) {
    const status = getVapidConfigurationStatus()
    console.warn(
      `${logPrefix} VAPID keys are not configured, push delivery will fail`,
      { status }
    )
    throw new Error(`${logPrefix} VAPID keys are not configured`)
  }

  const publicKey = normalizeVapidKey(
    process.env.WEB_PUSH_PUBLIC_KEY ||
      process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY ||
      ''
  )
  const privateKey = normalizeVapidKey(process.env.WEB_PUSH_PRIVATE_KEY || '')
  const subject =
    process.env.WEB_PUSH_SUBJECT ||
    process.env.NEXT_PUBLIC_WEB_PUSH_SUBJECT ||
    FALLBACK_SUBJECT

  const vapidToken = createVapidToken({
    audience,
    subject,
    publicKey,
    privateKey,
    expiresIn: options?.expiration,
  })

  const encryptionResult = encryptPayload(subscription, payloadBuffer)
  const body = encryptionResult.body || Buffer.alloc(0)

  const ttl = Math.max(0, options?.TTL ?? options?.ttl ?? DEFAULT_TTL_SECONDS)

  let cryptoKeyHeader = `p256ecdsa=${publicKey}`
  if (encryptionResult.serverPublicKey) {
    cryptoKeyHeader = `${cryptoKeyHeader};dh=${encryptionResult.serverPublicKey}`
  }

  const headers = {
    TTL: String(ttl),
    Authorization: `WebPush ${vapidToken}`,
    'Crypto-Key': cryptoKeyHeader,
  }

  if (encryptionResult.salt) {
    headers.Encryption = `salt=${encryptionResult.salt}`
  }

  if (body.length > 0) {
    headers['Content-Encoding'] = 'aes128gcm'
    headers['Content-Type'] = 'application/octet-stream'
    headers['Content-Length'] = body.length
  } else {
    headers['Content-Length'] = 0
  }

  if (options?.urgency) headers.Urgency = options.urgency
  if (options?.topic) headers.Topic = options.topic

  const requestOptions = {
    method: 'POST',
    protocol: endpointUrl.protocol,
    hostname: endpointUrl.hostname,
    port: endpointUrl.port || (endpointUrl.protocol === 'https:' ? 443 : 80),
    path: `${endpointUrl.pathname}${endpointUrl.search}`,
    headers,
  }

  const transport = endpointUrl.protocol === 'https:' ? https : http

  const response = await new Promise((resolve, reject) => {
    const req = transport.request(requestOptions, (res) => {
      const chunks = []
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', () => {
        const responseBody = Buffer.concat(chunks).toString('utf8')
        const result = {
          statusCode: res.statusCode,
          headers: res.headers,
          body: responseBody,
          endpoint,
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(result)
          return
        }

        const error = new Error('Received unexpected response code')
        error.statusCode = res.statusCode
        error.headers = res.headers
        error.body = responseBody
        error.endpoint = endpoint
        reject(error)
      })
    })

    req.on('error', reject)

    if (body.length > 0) {
      req.write(body)
    }

    req.end()
  })

  debugLog('Push delivered', {
    endpoint,
    statusCode: response.statusCode,
  })

  return response
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

  const serializedPayload = serializePayload(payload)
  const payloadBuffer = Buffer.from(serializedPayload, 'utf8')

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

  const sendSingle = async (targetItem) => {
    try {
      return await sendPushRequest({
        target: targetItem,
        payloadBuffer,
        options,
        logPrefix,
        debugLog,
        onSubscriptionRejected,
      })
    } catch (error) {
      handleRejected({ error, subscription: extractSubscription(targetItem), target: targetItem })
      throw error
    }
  }

  if (targets.length === 1) {
    return sendSingle(targets[0])
  }

  const results = await Promise.allSettled(targets.map(sendSingle))

  results
    .filter((result) => result.status === 'rejected')
    .forEach((result) => console.error(`${logPrefix} Push delivery failed`, result.reason))

  const hasSuccessfulDeliveries = results.some((result) => result.status === 'fulfilled')

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
export { getVapidConfigurationStatus, hasVapidKeyPairConfigured }
