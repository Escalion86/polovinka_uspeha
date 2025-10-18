/* eslint-disable no-undef */
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import {
  NetworkFirst,
  StaleWhileRevalidate,
  CacheFirst,
} from 'workbox-strategies'
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
console.info('[ServiceWorker] Boot', {
  version: workerVersion,
  timestamp: Date.now(),
})

self.addEventListener('install', (event) => {
  console.info('[ServiceWorker] Install event', {
    timestamp: Date.now(),
    version: workerVersion,
  })
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
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    networkTimeoutSeconds: 10,
  })
)

registerRoute(
  ({ request }) =>
    request.destination === 'style' || request.destination === 'script',
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
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
)
