'use client'

import CheckBox from '@components/CheckBox'
import ComboBox from '@components/ComboBox'
// import Input from '@components/Input'
import InputWrapper from '@components/InputWrapper'
import YesNoPicker from '@components/ValuePicker/YesNoPicker'
import { putData } from '@helpers/CRUD'
import compareObjects from '@helpers/compareObjects'
import { DEFAULT_USER } from '@helpers/constants'
import useSnackbar from '@helpers/useSnackbar'
// import modalsFuncAtom from '@state/modalsFuncAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import userEditSelector from '@state/selectors/userEditSelector'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import TelegramLoginButton from 'react-telegram-login'
import Note from '@components/Note'
import locationAtom from '@state/atoms/locationAtom'
import telegramBotNameAtom from '@state/atoms/telegramBotNameAtom'
import useRouter from '@utils/useRouter'

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const normalizePushSubscription = (subscription) => {
  if (!subscription || typeof subscription !== 'object') return null

  const endpoint = String(subscription?.endpoint || '').trim()
  const p256dh = String(subscription?.keys?.p256dh || '').trim()
  const auth = String(subscription?.keys?.auth || '').trim()
  if (!endpoint || !p256dh || !auth) return null

  return {
    endpoint,
    expirationTime:
      typeof subscription?.expirationTime === 'number'
        ? subscription.expirationTime
        : null,
    keys: {
      p256dh,
      auth,
    },
  }
}

const normalizePushSubscriptionsList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => normalizePushSubscription(item)).filter(Boolean)
  }

  if (value && typeof value === 'object') {
    return Object.values(value)
      .map((item) => normalizePushSubscription(item))
      .filter(Boolean)
  }

  return []
}

const normalizePushHistoryList = (value) => {
  const source = Array.isArray(value)
    ? value
    : value && typeof value === 'object'
      ? Object.values(value)
      : []
  return source
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      notificationId: String(item?.notificationId || ''),
      title: String(item?.title || 'Половинка успеха'),
      body: String(item?.body || ''),
      url: String(item?.url || ''),
      tag: String(item?.tag || ''),
      location: String(item?.location || ''),
      type: String(item?.type || ''),
      types: Array.isArray(item?.types)
        ? item.types.map(String).filter(Boolean)
        : [],
      channels:
        item?.channels && typeof item.channels === 'object'
          ? item.channels
          : {},
      createdAt: item?.createdAt ? new Date(item.createdAt) : null,
    }))
    .filter((item) => item.createdAt && !Number.isNaN(item.createdAt.getTime()))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

const uint8ArrayToBase64 = (buffer) => {
  if (!buffer) return ''
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i += 1) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

const waitForServiceWorkerRegistration = async ({
  timeoutMs = 8000,
  scriptUrls = ['/push-sw.js'],
} = {}) => {
  if (!('serviceWorker' in navigator)) return null

  const existingRegistration =
    await navigator.serviceWorker.getRegistration('/')
  if (existingRegistration?.active) return existingRegistration

  for (const scriptUrl of scriptUrls) {
    try {
      const registered = await navigator.serviceWorker.register(scriptUrl)
      if (registered?.active || registered?.installing || registered?.waiting) {
        return { registration: registered, scriptUrl }
      }
    } catch (error) {
      console.log(
        '[PushDebug][Client] waitForServiceWorkerRegistration register error',
        {
          scriptUrl,
          error,
        }
      )
    }
  }

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => resolve(null), timeoutMs)
  })

  const readyRegistration = await Promise.race([
    navigator.serviceWorker.ready,
    timeoutPromise,
  ])

  if (readyRegistration?.active) {
    return { registration: readyRegistration, scriptUrl: null }
  }

  const finalRegistration = await navigator.serviceWorker.getRegistration('/')
  if (finalRegistration)
    return { registration: finalRegistration, scriptUrl: null }

  return null
}

const waitForActiveServiceWorker = async (registration, timeoutMs = 8000) => {
  if (!registration) return null
  if (registration.active) return registration

  const worker = registration.installing || registration.waiting
  if (!worker) return null

  const activatedRegistration = await new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(null), timeoutMs)

    const finish = () => {
      clearTimeout(timeout)
      resolve(registration.active ? registration : null)
    }

    if (worker.state === 'activated') {
      finish()
      return
    }

    worker.addEventListener('statechange', () => {
      if (worker.state === 'activated') {
        finish()
      }
    })
  })

  if (activatedRegistration?.active) return activatedRegistration

  const readyRegistration = await Promise.race([
    navigator.serviceWorker.ready,
    new Promise((resolve) => setTimeout(() => resolve(null), timeoutMs)),
  ])
  return readyRegistration?.active ? readyRegistration : null
}

const shortEndpoint = (endpoint) => {
  const value = String(endpoint || '')
  if (!value) return null
  return value.length > 36 ? `...${value.slice(-36)}` : value
}

const getFromObjectOrMap = (source, key) => {
  if (!source || typeof source !== 'object') return undefined
  if (Object.prototype.hasOwnProperty.call(source, key)) return source[key]
  if (typeof source.get === 'function') return source.get(key)
  return undefined
}

const LoggedUserNotificationsContent = () => {
  const router = useRouter()
  const location = useAtomValue(locationAtom)
  console.log('location', location)
  const [loggedUserActive, setLoggedUserActive] = useAtom(loggedUserActiveAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const telegramBotName = useAtomValue(telegramBotNameAtom)

  const birthdays = loggedUserActiveRole?.notifications?.birthdays
  const remindDates = loggedUserActiveRole?.notifications?.remindDates
  const newUserRegistred = loggedUserActiveRole?.notifications?.newUserRegistred
  const eventRegistration =
    loggedUserActiveRole?.notifications?.eventRegistration
  const serviceRegistration =
    loggedUserActiveRole?.notifications?.serviceRegistration
  const newEventsNotificationAllowed =
    loggedUserActiveRole?.notifications?.newEvents ??
    loggedUserActiveRole?.notifications?.newEventsByTags
  const isLoggedUserDev = loggedUserActiveRole?.dev
  const setUserInUsersState = useSetAtom(userEditSelector)

  console.log('serviceRegistration', serviceRegistration)
  console.log('loggedUserActive', loggedUserActive)

  const prepareNotifications = useMemo(
    () =>
      (source = {}) => {
        const telegramSource = getFromObjectOrMap(source, 'telegram') ?? {}
        const pushSource = getFromObjectOrMap(source, 'push') ?? {}
        const settingsSource = getFromObjectOrMap(source, 'settings') ?? {}
        const historySource =
          getFromObjectOrMap(source, 'history') ??
          getFromObjectOrMap(pushSource, 'history')

        return {
        telegram: {
          ...DEFAULT_USER.notifications.telegram,
          ...(telegramSource ?? {}),
          ...(telegramSource?.username && !telegramSource?.userName
            ? { userName: telegramSource.username }
            : {}),
        },
        push: {
          ...DEFAULT_USER.notifications.push,
          ...(pushSource ?? {}),
          active: Boolean(pushSource?.active),
          subscriptions: normalizePushSubscriptionsList(
            pushSource?.subscriptions
          ),
          history: normalizePushHistoryList(
            historySource
          ),
        },
        history: normalizePushHistoryList(historySource),
        settings: {
          ...(DEFAULT_USER.notifications?.settings ?? {}),
          ...(settingsSource ?? {}),
        },
      }
      },
    []
  )

  const [notifications, setNotifications] = useState(() =>
    prepareNotifications(loggedUserActive?.notifications)
  )
  const [consentToMailing, setConsentToMailing] = useState(
    !!loggedUserActive?.consentToMailing
  )
  const [isPushAvailable, setIsPushAvailable] = useState(false)
  const [isPushBusy, setIsPushBusy] = useState(false)

  const handleTelegramResponse = ({
    id,
    // first_name,
    // last_name,
    // photo_url,
    username,
  }) => {
    setNotifications((state) => ({
      ...state,
      telegram: {
        ...state?.telegram,
        id,
        userName: username,
        active: true,
      },
    }))
  }

  const { success, error } = useSnackbar()
  const vapidPublicKey = process.env.NEXT_PUBLIC_WEB_PUSH_VAPID_PUBLIC_KEY
  const pushConfigured = typeof vapidPublicKey === 'string' && !!vapidPublicKey
  const pushDevPresidentOnly =
    process.env.NEXT_PUBLIC_PUSH_NOTIFICATIONS_DEV_PRESIDENT_ONLY === 'true'
  const isPushPrivilegedRole = ['dev', 'president', 'supervisor'].includes(
    String(loggedUserActiveRole?._id || '')
  )
  const canUsePushSettings = !pushDevPresidentOnly || isPushPrivilegedRole

  const serializePushSubscription = useCallback((subscription) => {
    if (!subscription) return null

    const json =
      typeof subscription?.toJSON === 'function'
        ? subscription.toJSON()
        : subscription

    const fallbackP256dh =
      typeof subscription?.getKey === 'function'
        ? uint8ArrayToBase64(subscription.getKey('p256dh'))
        : ''
    const fallbackAuth =
      typeof subscription?.getKey === 'function'
        ? uint8ArrayToBase64(subscription.getKey('auth'))
        : ''

    return normalizePushSubscription({
      ...json,
      keys: {
        p256dh: json?.keys?.p256dh || fallbackP256dh,
        auth: json?.keys?.auth || fallbackAuth,
      },
    })
  }, [])

  const subscribePush = useCallback(async () => {
    console.log('[PushDebug][Client] subscribePush:start', {
      pushConfigured,
      canUsePushSettings,
      role: loggedUserActiveRole?._id,
      isSecureContext:
        typeof window !== 'undefined' ? window.isSecureContext : null,
      hasServiceWorker:
        typeof navigator !== 'undefined' && 'serviceWorker' in navigator,
      hasPushManager: typeof window !== 'undefined' && 'PushManager' in window,
    })

    if (!pushConfigured) {
      error('Push-уведомления временно не настроены на сервере')
      return null
    }
    if (
      !('serviceWorker' in navigator) ||
      !('PushManager' in window) ||
      !window.isSecureContext
    ) {
      error('Push-уведомления недоступны в этом браузере')
      return null
    }

    const permission = await Notification.requestPermission()
    console.log('[PushDebug][Client] subscribePush:permission', { permission })
    if (permission !== 'granted') {
      error('Браузер не разрешил push-уведомления')
      return null
    }

    const swCandidates = [
      `/${location}/push-sw.js`,
      '/push-sw.js',
      `/${location}/sw.js`,
      '/sw.js',
      `/${location}/service-worker.js`,
      '/service-worker.js',
    ]
    const swResult = await waitForServiceWorkerRegistration({
      scriptUrls: swCandidates,
    })
    const registration = swResult?.registration || null
    const activeRegistration = await waitForActiveServiceWorker(registration)
    console.log('[PushDebug][Client] subscribePush:registration', {
      hasRegistration: !!registration,
      hasActive: !!registration?.active,
      hasActiveAfterWait: !!activeRegistration?.active,
      scope: registration?.scope || null,
      usedScriptUrl: swResult?.scriptUrl || null,
      swCandidates,
    })
    if (!activeRegistration) {
      error(
        `Service Worker не зарегистрирован. Проверить URL: ${swCandidates.join(', ')}`
      )
      return null
    }

    const existingSubscription =
      await activeRegistration.pushManager.getSubscription()
    if (existingSubscription) {
      const serialized = serializePushSubscription(existingSubscription)
      console.log('[PushDebug][Client] subscribePush:existingSubscription', {
        endpoint: shortEndpoint(serialized?.endpoint),
      })
      return serialized
    }

    const createdSubscription = await activeRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    })

    const serialized = serializePushSubscription(createdSubscription)
    console.log('[PushDebug][Client] subscribePush:createdSubscription', {
      endpoint: shortEndpoint(serialized?.endpoint),
    })
    return serialized
  }, [
    canUsePushSettings,
    error,
    loggedUserActiveRole?._id,
    location,
    pushConfigured,
    serializePushSubscription,
    vapidPublicKey,
  ])

  const unsubscribePush = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

    const swCandidates = [
      `/${location}/push-sw.js`,
      '/push-sw.js',
      `/${location}/sw.js`,
      '/sw.js',
      `/${location}/service-worker.js`,
      '/service-worker.js',
    ]
    const swResult = await waitForServiceWorkerRegistration({
      scriptUrls: swCandidates,
    })
    const registration = swResult?.registration || null
    if (!registration) return
    const existingSubscription =
      await registration.pushManager.getSubscription()
    if (existingSubscription) {
      await existingSubscription.unsubscribe()
    }
  }, [location])

  const toggleNotificationsSettings = (key) =>
    setNotifications((state) => ({
      ...state,
      settings: {
        ...(state?.settings ?? {}),
        [key]:
          key === 'newEvents'
            ? !(state?.settings?.newEvents ?? state?.settings?.newEventsByTags)
            : state?.settings
              ? !state?.settings[key]
              : true,
      },
    }))

  // const modalsFunc = useAtomValue(modalsFuncAtom)

  const isNotificationActivated = Boolean(
    (notifications?.telegram?.id && notifications?.telegram?.active) ||
    (canUsePushSettings &&
      notifications?.push?.active &&
      Array.isArray(notifications?.push?.subscriptions) &&
      notifications.push.subscriptions.length > 0)
  )

  useEffect(() => {
    const sourcePush = loggedUserActive?.notifications?.push
    console.log('[PushDebug][Client] prepareNotifications:source', {
      userId: loggedUserActive?._id,
      role: loggedUserActive?.role,
      sourcePushActive: Boolean(sourcePush?.active),
      sourcePushSubscriptionsCount: normalizePushSubscriptionsList(
        sourcePush?.subscriptions
      ).length,
      sourcePushHistoryCount: normalizePushHistoryList(
        loggedUserActive?.notifications?.history ?? sourcePush?.history
      ).length,
    })
    setNotifications(prepareNotifications(loggedUserActive?.notifications))
    setConsentToMailing(!!loggedUserActive?.consentToMailing)
  }, [
    loggedUserActive?.consentToMailing,
    loggedUserActive?.notifications,
    prepareNotifications,
  ])

  useEffect(() => {
    const available =
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      window.isSecureContext
    setIsPushAvailable(available)
  }, [])

  const normalizeNotificationsForSave = useCallback(
    (notificationsSource = notifications) => {
      const sourceTelegram =
        getFromObjectOrMap(loggedUserActive?.notifications, 'telegram') ?? {}
      const sourcePush =
        getFromObjectOrMap(loggedUserActive?.notifications, 'push') ?? {}
      const preparedNotifications = {
        ...prepareNotifications(loggedUserActive?.notifications),
        ...notificationsSource,
        telegram: {
          ...DEFAULT_USER.notifications.telegram,
          ...sourceTelegram,
          ...(notificationsSource?.telegram ?? {}),
          ...(notificationsSource?.telegram?.username &&
          !notificationsSource?.telegram?.userName
            ? { userName: notificationsSource.telegram.username }
            : {}),
        },
        push: {
          ...DEFAULT_USER.notifications.push,
          ...sourcePush,
          ...(notificationsSource?.push ?? {}),
          active: Boolean(notificationsSource?.push?.active),
          subscriptions: normalizePushSubscriptionsList(
            notificationsSource?.push?.subscriptions
          ),
        },
        settings: {
          ...(notificationsSource?.settings ?? {}),
        },
      }
      if (
        typeof preparedNotifications.settings.newEvents !== 'boolean' &&
        typeof preparedNotifications.settings.newEventsByTags === 'boolean'
      ) {
        preparedNotifications.settings.newEvents =
          preparedNotifications.settings.newEventsByTags
      }
      delete preparedNotifications.settings.newEventsByTags
      return preparedNotifications
    },
    [notifications]
  )

  const saveNotifications = useCallback(
    async ({
      notificationsToSave = notifications,
      consentToMailingToSave = consentToMailing,
      redirectToUpcoming = false,
      successMessage = 'Данные уведомлений обновлены успешно',
      showSuccess = true,
    } = {}) => {
      let savedUser = null
      const preparedNotifications =
        normalizeNotificationsForSave(notificationsToSave)
      console.log('[PushDebug][Client] saveNotifications:request', {
        userId: loggedUserActive?._id,
        role: loggedUserActiveRole?._id,
        consentToMailing: consentToMailingToSave,
        pushActive: Boolean(preparedNotifications?.push?.active),
        pushSubscriptionsCount: Array.isArray(
          preparedNotifications?.push?.subscriptions
        )
          ? preparedNotifications.push.subscriptions.length
          : 0,
      })

      await putData(
        `/api/${location}/users/${loggedUserActive._id}`,
        {
          notifications: preparedNotifications,
          consentToMailing: consentToMailingToSave,
        },
        (data) => {
          savedUser = data
          console.log('[PushDebug][Client] saveNotifications:response', {
            userId: data?._id,
            role: data?.role,
            pushActive: Boolean(data?.notifications?.push?.active),
            pushSubscriptionsCount: Array.isArray(
              data?.notifications?.push?.subscriptions
            )
              ? data.notifications.push.subscriptions.length
              : 0,
            pushEndpoint: shortEndpoint(
              data?.notifications?.push?.subscriptions?.[0]?.endpoint
            ),
          })
          setLoggedUserActive(data)
          setUserInUsersState(data)
          if (showSuccess) {
            success(successMessage)
          }
          if (redirectToUpcoming) {
            router.push(`/${location}/cabinet/eventsUpcoming`)
          }
        },
        () => {
          console.log('[PushDebug][Client] saveNotifications:error', {
            userId: loggedUserActive?._id,
          })
          error('Ошибка обновления данных уведомлений')
        },
        false,
        loggedUserActive._id
      )

      return savedUser
    },
    [
      consentToMailing,
      error,
      location,
      loggedUserActive?._id,
      loggedUserActiveRole?._id,
      normalizeNotificationsForSave,
      notifications,
      router,
      setLoggedUserActive,
      setUserInUsersState,
      success,
    ]
  )

  useEffect(() => {
    const syncPushFromBrowser = async () => {
      if (!canUsePushSettings || !isPushAvailable || !consentToMailing) return
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

      const swCandidates = [
        `/${location}/push-sw.js`,
        '/push-sw.js',
        `/${location}/sw.js`,
        '/sw.js',
        `/${location}/service-worker.js`,
        '/service-worker.js',
      ]
      const swResult = await waitForServiceWorkerRegistration({
        scriptUrls: swCandidates,
      })
      const registration = swResult?.registration || null
      if (!registration) return

      const browserSubscription =
        await registration.pushManager.getSubscription()
      const normalizedBrowserSubscription =
        serializePushSubscription(browserSubscription)

      if (!normalizedBrowserSubscription) return

      const localSubscriptions = normalizePushSubscriptionsList(
        notifications?.push?.subscriptions
      )
      const hasLocalEndpoint = localSubscriptions.some(
        (item) => item?.endpoint === normalizedBrowserSubscription.endpoint
      )
      const localActive = Boolean(notifications?.push?.active)

      if (localActive && hasLocalEndpoint) return

      const nextNotifications = {
        ...notifications,
        push: {
          ...(notifications?.push ?? {}),
          active: true,
          subscriptions: hasLocalEndpoint
            ? localSubscriptions
            : [...localSubscriptions, normalizedBrowserSubscription],
        },
      }

      console.log('[PushDebug][Client] syncPushFromBrowser:recovered', {
        userId: loggedUserActive?._id,
        role: loggedUserActive?.role,
        endpoint: shortEndpoint(normalizedBrowserSubscription.endpoint),
      })

      setNotifications(nextNotifications)
      await saveNotifications({
        notificationsToSave: nextNotifications,
        successMessage: 'Push уведомления синхронизированы',
        showSuccess: false,
      })
    }

    void syncPushFromBrowser()
  }, [
    canUsePushSettings,
    consentToMailing,
    isPushAvailable,
    location,
    loggedUserActive?._id,
    loggedUserActive?.role,
    notifications,
    saveNotifications,
    serializePushSubscription,
  ])

  const togglePushNotifications = useCallback(async () => {
    if (isPushBusy) return

    setIsPushBusy(true)
    try {
      const isActiveNow = Boolean(notifications?.push?.active)
      console.log('[PushDebug][Client] togglePushNotifications:click', {
        isActiveNow,
        role: loggedUserActiveRole?._id,
        canUsePushSettings,
        localSubscriptionsCount: Array.isArray(
          notifications?.push?.subscriptions
        )
          ? notifications.push.subscriptions.length
          : 0,
      })
      if (!isActiveNow) {
        const subscription = await subscribePush()
        if (!subscription) return

        const existingSubscriptions = Array.isArray(
          notifications?.push?.subscriptions
        )
          ? notifications.push.subscriptions
          : []
        const subscriptionsMap = new Map(
          existingSubscriptions
            .map((item) => normalizePushSubscription(item))
            .filter(Boolean)
            .map((item) => [item.endpoint, item])
        )
        subscriptionsMap.set(subscription.endpoint, subscription)

        const nextNotifications = {
          ...notifications,
          push: {
            ...(notifications?.push ?? {}),
            active: true,
            subscriptions: Array.from(subscriptionsMap.values()),
          },
        }

        setNotifications(nextNotifications)
        const savedUser = await saveNotifications({
          notificationsToSave: nextNotifications,
          successMessage: 'Push уведомления подключены',
        })
        const savedPush = savedUser?.notifications?.push
        const savedActive = Boolean(savedPush?.active)
        const savedSubscriptionsCount = Array.isArray(savedPush?.subscriptions)
          ? savedPush.subscriptions.length
          : 0
        if (!savedActive || savedSubscriptionsCount === 0) {
          console.log(
            '[PushDebug][Client] togglePushNotifications:serverRejectedOrLost',
            {
              savedActive,
              savedSubscriptionsCount,
              role: loggedUserActiveRole?._id,
              pushDevPresidentOnly,
            }
          )
          error(
            'Push не сохранился на сервере. Проверьте роль пользователя и env-флаги PUSH_NOTIFICATIONS_DEV_PRESIDENT_ONLY / NEXT_PUBLIC_PUSH_NOTIFICATIONS_DEV_PRESIDENT_ONLY'
          )
        }
      } else {
        await unsubscribePush()
        const nextNotifications = {
          ...notifications,
          push: {
            ...(notifications?.push ?? {}),
            active: false,
          },
        }
        setNotifications(nextNotifications)
        await saveNotifications({
          notificationsToSave: nextNotifications,
          successMessage: 'Push уведомления отключены',
        })
      }
    } catch (toggleError) {
      console.log('togglePushNotifications error', toggleError)
      error(
        `Не удалось изменить настройку push-уведомлений${toggleError?.message ? `: ${toggleError.message}` : ''}`
      )
    } finally {
      setIsPushBusy(false)
    }
  }, [
    canUsePushSettings,
    error,
    isPushBusy,
    loggedUserActiveRole?._id,
    notifications,
    pushDevPresidentOnly,
    saveNotifications,
    subscribePush,
    unsubscribePush,
  ])

  const formChanged =
    loggedUserActive?.consentToMailing !== consentToMailing ||
    !compareObjects(
      prepareNotifications(loggedUserActive?.notifications),
      notifications
    )

  useEffect(() => {
    if (!loggedUserActive?._id || !formChanged || isPushBusy) return undefined

    const timeoutId = setTimeout(() => {
      void saveNotifications({
        notificationsToSave: notifications,
        consentToMailingToSave: consentToMailing,
        showSuccess: false,
      })
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [
    consentToMailing,
    formChanged,
    isPushBusy,
    loggedUserActive?._id,
    notifications,
    saveNotifications,
  ])

  const isTelegramConnected = Boolean(notifications?.telegram?.id)
  const isTelegramActive = Boolean(notifications?.telegram?.active)

  return (
    <div className="flex flex-col flex-1 h-full max-w-full max-h-full min-h-full">
      <div className="p-2">
        <CheckBox
          label={
            <div className="text-left">
              Согласен на{' '}
              <a
                href="/docs/Soglasie_na_poluchenie_rassylki.docx"
                target="_blank"
                rel="noopener noreferrer"
                className="italic font-bold underline text-general hover:text-success"
              >
                получение рассылки о мероприятиях
              </a>
            </div>
          }
          checked={consentToMailing}
          onChange={() => setConsentToMailing((state) => !state)}
        />
        {consentToMailing && (
          <div className="mt-2 space-y-3">
            <div className="px-3 py-2 border rounded-lg">
              <div className="mb-1 font-semibold">Telegram-уведомления</div>
              <div className="flex flex-col">
                <Note>
                  Для подключения или переподключения Telegram-уведомлений
                  авторизуйтесь через кнопку ниже
                </Note>
                <TelegramLoginButton
                  dataOnauth={handleTelegramResponse}
                  botName={telegramBotName}
                  lang="ru"
                />
              </div>
              {isTelegramConnected ? (
                <div className="flex flex-wrap items-center gap-2">
                  <YesNoPicker
                    label="Оповещения в Telegram"
                    value={isTelegramActive}
                    onChange={() => {
                      setNotifications((state) => ({
                        ...state,
                        telegram: {
                          ...state?.telegram,
                          active: !state?.telegram?.active,
                        },
                      }))
                    }}
                  />
                </div>
              ) : null}
            </div>

            <div className="px-3 py-2 border rounded-lg">
              <div className="mb-1 font-semibold">Push-уведомления</div>
              {isPushAvailable && canUsePushSettings ? (
                <div className="flex flex-wrap items-center gap-2">
                  <YesNoPicker
                    label="Push уведомления"
                    value={!!notifications?.push?.active}
                    readOnly={isPushBusy || !pushConfigured}
                    onChange={togglePushNotifications}
                  />
                </div>
              ) : (
                <Note>
                  Push-уведомления недоступны в этом браузере или для текущей
                  роли
                </Note>
              )}
              {consentToMailing &&
                isPushAvailable &&
                canUsePushSettings &&
                !pushConfigured && (
                  <Note type="error">
                    Push-уведомления пока недоступны: не задан публичный VAPID
                    ключ
                  </Note>
                )}
            </div>
          </div>
        )}

        {consentToMailing && isNotificationActivated && (
          <>
            {(birthdays || remindDates) && (
              <InputWrapper label="Ежедневные уведомления" className="">
                <div className="w-full">
                  <ComboBox
                    label="Время уведомлений"
                    items={[
                      '00:00',
                      '00:30',
                      '01:00',
                      '01:30',
                      '02:00',
                      '02:30',
                      '03:00',
                      '03:30',
                      '04:00',
                      '04:30',
                      '05:00',
                      '05:30',
                      '06:00',
                      '06:30',
                      '07:00',
                      '07:30',
                      '08:00',
                      '08:30',
                      '09:00',
                      '09:30',
                      '10:00',
                      '10:30',
                      '11:00',
                      '11:30',
                      '12:00',
                      '12:30',
                      '13:00',
                      '13:30',
                      '14:00',
                      '14:30',
                      '15:00',
                      '15:30',
                      '16:00',
                      '16:30',
                      '17:00',
                      '17:30',
                      '18:00',
                      '18:30',
                      '19:00',
                      '19:30',
                      '20:00',
                      '20:30',
                      '21:00',
                      '21:30',
                      '22:00',
                      '22:30',
                      '23:00',
                      '23:30',
                    ].map((time) => ({ value: time, name: time }))}
                    value={notifications.settings?.time}
                    onChange={(time) =>
                      setNotifications((state) => ({
                        ...state,
                        settings: {
                          ...notifications?.settings,
                          time,
                        },
                      }))
                    }
                    className="w-40 mt-2"
                    required={notifications.settings?.birthdays}
                    noMargin
                    placeholder="Не выбрано"
                  />

                  {birthdays && (
                    <CheckBox
                      checked={notifications.settings?.birthdays}
                      onClick={() => toggleNotificationsSettings('birthdays')}
                      label="Напоминания о днях рождениях пользователей (модер/админ)"
                    />
                  )}
                  {remindDates && (
                    <CheckBox
                      checked={notifications.settings?.remindDates}
                      onClick={() => toggleNotificationsSettings('remindDates')}
                      label="Напоминания об особых днях Половинки Успеха (список дней редактируется в настройках сайта)"
                    />
                  )}
                </div>
              </InputWrapper>
            )}
            <InputWrapper label="Уведомления по событиям" className="">
              <div className="w-full">
                {newUserRegistred && (
                  <CheckBox
                    checked={notifications.settings?.newUserRegistred}
                    onClick={() => {
                      toggleNotificationsSettings('newUserRegistred')
                    }}
                    label="Регистрации нового пользователя (модер/админ)"
                  />
                )}
                {eventRegistration && (
                  <CheckBox
                    checked={notifications.settings?.eventRegistration}
                    onClick={() =>
                      toggleNotificationsSettings('eventRegistration')
                    }
                    label="Запись/отписка пользователей на мероприитиях (модер/админ)"
                  />
                )}
                {serviceRegistration && (
                  <CheckBox
                    checked={notifications.settings?.serviceRegistration}
                    onClick={() =>
                      toggleNotificationsSettings('serviceRegistration')
                    }
                    label="Подача заявок пользователей на услуги (модер/админ)"
                  />
                )}
                {newEventsNotificationAllowed && (
                  <CheckBox
                    checked={Boolean(
                      notifications.settings?.newEvents ??
                      notifications.settings?.newEventsByTags
                    )}
                    onClick={() => toggleNotificationsSettings('newEvents')}
                    label="Новые мероприятия"
                  />
                )}
                {isLoggedUserDev && (
                  <CheckBox
                    checked={notifications.settings?.eventUserMoves}
                    onClick={() =>
                      toggleNotificationsSettings('eventUserMoves')
                    }
                    label="Перемещение моей записи на мероприятие из резерва в основной состав и наоборот"
                  />
                )}
                {isLoggedUserDev && (
                  <CheckBox
                    checked={notifications.settings?.eventCancel}
                    onClick={() => toggleNotificationsSettings('eventCancel')}
                    label="Отмена мероприятия на которое я записан"
                  />
                )}
              </div>
            </InputWrapper>
          </>
        )}
      </div>
    </div>
  )
}

export default LoggedUserNotificationsContent
