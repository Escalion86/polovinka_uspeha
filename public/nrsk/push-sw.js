self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        await clients.claim()
      } catch (error) {
        console.error('[PushSW] activate claim error', error)
      }
    })()
  )
})

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
      data: { url },
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
