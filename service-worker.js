import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import {
  NetworkFirst,
  NetworkOnly,
  StaleWhileRevalidate,
  CacheFirst,
} from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

const workerVersion = '2026-03-22T20:10:00Z'

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

precacheAndRoute(self.__WB_MANIFEST || [])

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkOnly()
)

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
  if (!event?.data) return

  let payload = {}
  try {
    payload = event.data.json()
  } catch (error) {
    payload = { body: event.data.text() }
  }

  const title = payload?.title || 'Половинка успеха'
  const body = payload?.body || ''
  const url = payload?.data?.url || '/'
  const notificationId =
    payload?.data?.notificationId ||
    `${Date.now()}-${Math.random().toString(16).slice(2)}`
  const notificationTag = payload?.tag
    ? `${payload.tag}-${notificationId}`
    : `pu-push-${notificationId}`

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag: notificationTag,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: {
        url,
      },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const targetUrl = event.notification?.data?.url || '/'

  event.waitUntil(
    (async () => {
      const openedClients = await clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      })

      for (const openedClient of openedClients) {
        if (openedClient.url === targetUrl && 'focus' in openedClient) {
          return openedClient.focus()
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(targetUrl)
      }
    })()
  )
})
