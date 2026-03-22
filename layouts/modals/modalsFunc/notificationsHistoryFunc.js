import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import locationAtom from '@state/atoms/locationAtom'
import { useAtomValue } from 'jotai'
import { useEffect, useMemo, useState } from 'react'

const NOTIFICATION_TYPE_TITLES = {
  newEvents: 'Новые мероприятия',
  newUserRegistred: 'Регистрация нового пользователя',
  eventRegistration: 'Запись/отписка на мероприятие',
  serviceRegistration: 'Заявка на услугу',
  birthdays: 'Дни рождения',
  remindDates: 'Особые даты',
}

const normalizeHistoryList = (value) => {
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
      types: Array.isArray(item?.types) ? item.types.map(String).filter(Boolean) : [],
      channels:
        item?.channels && typeof item.channels === 'object' ? item.channels : {},
      createdAt: item?.createdAt ? new Date(item.createdAt) : null,
    }))
    .filter((item) => item.createdAt && !Number.isNaN(item.createdAt.getTime()))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

const notificationTypeLabel = (item) => {
  const types =
    Array.isArray(item?.types) && item.types.length > 0
      ? item.types
      : item?.type
        ? [item.type]
        : []
  if (types.length === 0) return 'Тип не определен'
  return types.map((type) => NOTIFICATION_TYPE_TITLES[type] || type).join(', ')
}

const notificationsHistoryFunc = () => {
  const NotificationsHistoryModal = () => {
    const location = useAtomValue(locationAtom)
    const loggedUserActive = useAtomValue(loggedUserActiveAtom)
    const [historySource, setHistorySource] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState('')

    const history = useMemo(
      () => normalizeHistoryList(historySource),
      [historySource]
    )

    useEffect(() => {
      let isMounted = true

      const loadHistory = async () => {
        const userId = String(loggedUserActive?._id || '')
        if (!userId || !location) {
          setIsLoading(false)
          setHistorySource([])
          return
        }
        setHistorySource([])
        setLoadError('')

        try {
          const response = await fetch(`/api/${location}/notifications/history?limit=200`)
          const json = await response.json()
          if (!response.ok) {
            console.log('[NotificationsHistory][Client] fetch failed', {
              status: response.status,
              body: json,
            })
            const message =
              json?.data?.error?.message || 'Не удалось получить историю уведомлений'
            setLoadError(message)
            return
          }
          if (!json?.success) {
            const message =
              json?.data?.error?.message || 'Не удалось получить историю уведомлений'
            setLoadError(message)
            return
          }
          const history = json?.success ? json?.data?.history : null

          if (!isMounted || !Array.isArray(history)) return
          setHistorySource(history)
        } catch (error) {
          if (!isMounted) return
          console.log('[NotificationsHistory][Client] fetch error', error)
          setLoadError('Не удалось обновить историю уведомлений')
        } finally {
          if (isMounted) setIsLoading(false)
        }
      }

      loadHistory()

      return () => {
        isMounted = false
      }
    }, [location, loggedUserActive?._id])

    return (
      <div className="w-full max-h-[70vh] overflow-auto pr-1">
        {isLoading ? <div className="text-sm text-gray-600 mb-2">Загрузка истории...</div> : null}
        {loadError ? <div className="text-sm text-danger mb-2">{loadError}</div> : null}
        {history.length === 0 ? (
          <div className="text-sm text-gray-600">Пока нет сохраненных уведомлений</div>
        ) : (
          history.map((item, index) => (
            <div
              key={`${item.notificationId || item.createdAt?.toISOString?.() || 'item'}-${item.tag}-${index}`}
              className="p-3 mb-2 bg-white border rounded-md border-gray-200"
            >
              <div className="font-semibold">{item.title}</div>
              <div className="text-xs text-gray-600 mt-1">
                Тип: {notificationTypeLabel(item)}
              </div>
              {item.body ? <div className="text-sm mt-1">{item.body}</div> : null}
              <div className="text-xs text-gray-600 mt-1">
                Push:{' '}
                {item?.channels?.push?.success
                  ? 'доставлено'
                  : item?.channels?.push?.attempted
                    ? `ошибка${item?.channels?.push?.error ? ` (${item.channels.push.error})` : ''}`
                    : 'не отправлялось'}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {item.createdAt?.toLocaleString?.('ru-RU') || ''}
              </div>
              {item.url ? (
                <a
                  href={item.url}
                  className="text-xs underline text-general mt-1 inline-block"
                >
                  Открыть
                </a>
              ) : null}
            </div>
          ))
        )}
      </div>
    )
  }

  return {
    title: 'История уведомлений',
    confirmButtonShow: false,
    declineButtonShow: false,
    onlyCloseButtonShow: true,
    closeButtonName: 'Закрыть',
    Children: NotificationsHistoryModal,
  }
}

export default notificationsHistoryFunc
