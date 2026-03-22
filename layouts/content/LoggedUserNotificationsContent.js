'use client'

import Button from '@components/Button'
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

const LoggedUserNotificationsContent = (props) => {
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
      (source = {}) => ({
        telegram: {
          ...DEFAULT_USER.notifications.telegram,
          ...(source?.telegram ?? {}),
        },
        push: {
          ...DEFAULT_USER.notifications.push,
          ...(source?.push ?? {}),
        },
        settings: {
          ...(DEFAULT_USER.notifications?.settings ?? {}),
          ...(source?.settings ?? {}),
        },
      }),
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
        id,
        username,
        active: true,
      },
    }))
  }

  const { success, error } = useSnackbar()
  const vapidPublicKey = process.env.NEXT_PUBLIC_WEB_PUSH_VAPID_PUBLIC_KEY
  const pushConfigured = typeof vapidPublicKey === 'string' && !!vapidPublicKey
  const pushDevPresidentOnly =
    process.env.NEXT_PUBLIC_PUSH_NOTIFICATIONS_DEV_PRESIDENT_ONLY === 'true'
  const canUsePushSettings =
    !pushDevPresidentOnly ||
    loggedUserActiveRole?._id === 'dev' ||
    loggedUserActiveRole?._id === 'president'

  const subscribePush = useCallback(async () => {
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
    if (permission !== 'granted') {
      error('Браузер не разрешил push-уведомления')
      return null
    }

    const registration = await navigator.serviceWorker.ready
    const existingSubscription = await registration.pushManager.getSubscription()
    if (existingSubscription) {
      return normalizePushSubscription(existingSubscription.toJSON())
    }

    const createdSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    })

    return normalizePushSubscription(createdSubscription.toJSON())
  }, [error, pushConfigured, vapidPublicKey])

  const unsubscribePush = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

    const registration = await navigator.serviceWorker.ready
    const existingSubscription = await registration.pushManager.getSubscription()
    if (existingSubscription) {
      await existingSubscription.unsubscribe()
    }
  }, [])

  const togglePushNotifications = useCallback(async () => {
    if (isPushBusy) return

    setIsPushBusy(true)
    try {
      const isActiveNow = Boolean(notifications?.push?.active)
      if (!isActiveNow) {
        const subscription = await subscribePush()
        if (!subscription) return

        setNotifications((state) => {
          const existingSubscriptions = Array.isArray(
            state?.push?.subscriptions
          )
            ? state.push.subscriptions
            : []
          const subscriptionsMap = new Map(
            existingSubscriptions
              .map((item) => normalizePushSubscription(item))
              .filter(Boolean)
              .map((item) => [item.endpoint, item])
          )
          subscriptionsMap.set(subscription.endpoint, subscription)

          return {
            ...state,
            push: {
              active: true,
              subscriptions: Array.from(subscriptionsMap.values()),
            },
          }
        })
      } else {
        await unsubscribePush()
        setNotifications((state) => ({
          ...state,
          push: {
            ...(state?.push ?? {}),
            active: false,
          },
        }))
      }
    } catch (toggleError) {
      console.log('togglePushNotifications error', toggleError)
      error('Не удалось изменить настройку push-уведомлений')
    } finally {
      setIsPushBusy(false)
    }
  }, [error, isPushBusy, notifications?.push?.active, subscribePush, unsubscribePush])

  const toggleNotificationsSettings = (key) =>
    setNotifications((state) => ({
      ...state,
      settings: {
        ...(state?.settings ?? {}),
        [key]:
          key === 'newEvents'
            ? !(
                state?.settings?.newEvents ??
                state?.settings?.newEventsByTags
              )
            : state?.settings
              ? !state?.settings[key]
              : true,
      },
    }))

  // const modalsFunc = useAtomValue(modalsFuncAtom)

  const [isWaitingToResponse, setIsWaitingToResponse] = useState(false)

  const isNotificationActivated = Boolean(
    (notifications?.telegram?.id && notifications?.telegram?.active) ||
      (canUsePushSettings &&
        notifications?.push?.active &&
        Array.isArray(notifications?.push?.subscriptions) &&
        notifications.push.subscriptions.length > 0)
  )

  useEffect(() => {
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

  const onClickConfirm = async () => {
    setIsWaitingToResponse(true)
    const preparedNotifications = {
      ...notifications,
      settings: {
        ...(notifications?.settings ?? {}),
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

    await putData(
      `/api/${location}/users/${loggedUserActive._id}`,
      {
        notifications: preparedNotifications,
        consentToMailing,
      },
      (data) => {
        setLoggedUserActive(data)
        setUserInUsersState(data)
        success('Данные уведомлений обновлены успешно')
        router.push(`/${location}/cabinet/eventsUpcoming`)
        setIsWaitingToResponse(false)
      },
      () => {
        error('Ошибка обновления данных уведомлений')
        setIsWaitingToResponse(false)
      },
      false,
      loggedUserActive._id
    )
  }

  useEffect(() => {
    if (isWaitingToResponse) {
      setIsWaitingToResponse(false)
    }
  }, [props])

  const formChanged =
    loggedUserActive?.consentToMailing !== consentToMailing ||
    !compareObjects(
      prepareNotifications(loggedUserActive?.notifications),
      notifications
    )

  const buttonDisabled = !formChanged

  return (
    <div className="flex flex-col flex-1 h-full max-w-full max-h-full min-h-full">
      <div className="flex items-center w-full p-1 gap-x-1">
        <div className="flex flex-row-reverse flex-1">
          {!buttonDisabled && (
            <span className="leading-4 text-right tablet:text-lg">
              Чтобы изменения вступили в силу нажмите:
            </span>
          )}
        </div>
        <Button
          name="Применить"
          disabled={buttonDisabled}
          onClick={onClickConfirm}
          loading={isWaitingToResponse}
        />
      </div>
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
        {consentToMailing && !notifications?.telegram?.id && (
          <div className="flex flex-col">
            <Note>
              Для подключения оповещений через Телеграм - нажмите на кнопку ниже
              и авторизируйтесь
            </Note>
            <TelegramLoginButton
              dataOnauth={handleTelegramResponse}
              botName={telegramBotName}
              lang="ru"
            />
          </div>
        )}
        {consentToMailing && (
          <div className="flex flex-wrap items-center gap-x-2">
            {isPushAvailable && canUsePushSettings && (
              <YesNoPicker
                label="Push-уведомления в браузере"
                value={!!notifications?.push?.active}
                readOnly={isPushBusy || !pushConfigured}
                onChange={togglePushNotifications}
              />
            )}
            {notifications?.telegram?.id && (
              <YesNoPicker
                label="Оповещения в Telegram"
                value={!!notifications?.telegram?.active}
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
            )}
          </div>
        )}
        {consentToMailing && isPushAvailable && canUsePushSettings && !pushConfigured && (
          <Note>
            Push-уведомления пока недоступны: не задан публичный VAPID ключ
          </Note>
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
