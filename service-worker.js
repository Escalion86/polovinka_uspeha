/* eslint-disable no-undef */
import { clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import {
  NetworkFirst,
  StaleWhileRevalidate,
  CacheFirst,
} from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

const workerVersion = '2025-10-17T20:32:00Z'

console.info('[ServiceWorker] Boot', {
  version: workerVersion,
  timestamp: Date.now(),
})

self.addEventListener('install', (event) => {
  console.info('[ServiceWorker] Install event', {
    timestamp: Date.now(),
    version: workerVersion,
  })
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  console.info('[ServiceWorker] Activate event', {
    timestamp: Date.now(),
    version: workerVersion,
  })
  event.waitUntil(
    (async () => {
      try {
        await clients.claim()
      } catch (error) {
        console.error(
          '[ServiceWorker] Failed to claim clients during activate',
          error
        )
      }
    })()
  )
})

const broadcastPushPayload = async (payload) => {
  if (!payload) return

  try {
    const clientList = await clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    })

    for (const client of clientList) {
      try {
        client.postMessage({ type: 'push-notification', payload })
      } catch (error) {
        console.error('Failed to post push payload to client', error)
      }
    }
  } catch (error) {
    console.error('Failed to broadcast push payload', error)
  }
}

precacheAndRoute(self.__WB_MANIFEST || [])

registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    networkTimeoutSeconds: 10,
  })
)

registerRoute(
  ({ request }) =>
    request.destination === 'style' || request.destination === 'script',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
)

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
)

self.addEventListener('push', (event) => {
  console.info('[ServiceWorker] Push event received', {
    hasData: Boolean(event?.data),
    timestamp: Date.now(),
  })

  const processPushEvent = async () => {
    const rawData = event?.data
    let payload
    let fallbackText

    if (rawData) {
      try {
        payload = rawData.json()
      } catch (error) {
        console.warn(
          '[ServiceWorker] Failed to parse push payload as JSON',
          error
        )
        try {
          fallbackText = rawData.text()
        } catch (textError) {
          console.warn(
            '[ServiceWorker] Failed to read push payload as text',
            textError
          )
        }
      }
    }

    if (!payload) {
      const bodyText = fallbackText || 'У вас новое уведомление'
      payload = {
        title: 'Половинка успеха',
        body: bodyText,
        data: {
          type: 'generic-notification',
          fallback: true,
          body: bodyText,
        },
      }
    } else if (typeof payload === 'object' && payload !== null) {
      const payloadData =
        payload.data && typeof payload.data === 'object' ? payload.data : {}
      payload = {
        ...payload,
        data: {
          ...payloadData,
          fallback: false,
        },
      }
      if (!payload.body && fallbackText) {
        payload.body = fallbackText
      }
    }

    console.info('[ServiceWorker] Получено push-сообщение', {
      hasData: Boolean(rawData),
      payload,
    })

    const { title, ...options } = payload
    const notificationTitle = title || 'Половинка успеха'
    const notificationOptions = {
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      data: {},
      ...options,
    }

    notificationOptions.data = {
      ...(typeof notificationOptions.data === 'object' &&
      notificationOptions.data
        ? notificationOptions.data
        : {}),
      receivedAt: Date.now(),
    }

    await Promise.all([
      self.registration.showNotification(
        notificationTitle,
        notificationOptions
      ),
      broadcastPushPayload(payload),
    ])
  }

  event.waitUntil(
    processPushEvent().catch((error) => {
      console.error('[ServiceWorker] Push handler failed', error)
      throw error
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  const notification = event.notification
  const url = notification?.data?.url
  notification.close()

  if (url) {
    event.waitUntil(
      (async () => {
        const allClients = await clients.matchAll({
          type: 'window',
          includeUncontrolled: true,
        })
        for (const client of allClients) {
          if (client.url === url && 'focus' in client) {
            return client.focus()
          }
        }
        if (clients.openWindow) {
          await clients.openWindow(url)
        }
      })()
    )
  }
})
