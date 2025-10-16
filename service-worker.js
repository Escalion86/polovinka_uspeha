/* eslint-disable no-undef */
import { clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

self.skipWaiting()
clientsClaim()

precacheAndRoute(self.__WB_MANIFEST || [])

registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    networkTimeoutSeconds: 10,
  })
)

registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
)

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  })
)

self.addEventListener('push', (event) => {
  if (!event?.data) return
  let payload
  try {
    payload = event.data.json()
  } catch (error) {
    payload = { title: 'Половинка успеха', body: event.data.text() }
  }

  if (!payload) return

  const { title, ...options } = payload
  const notificationTitle = title || 'Половинка успеха'
  const notificationOptions = {
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    data: {},
    ...options,
  }

  event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions))
})

self.addEventListener('notificationclick', (event) => {
  const notification = event.notification
  const url = notification?.data?.url
  notification.close()

  if (url) {
    event.waitUntil(
      (async () => {
        const allClients = await clients.matchAll({ type: 'window', includeUncontrolled: true })
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
