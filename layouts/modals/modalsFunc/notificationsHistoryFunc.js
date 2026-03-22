import Button from '@components/Button'
import {
  EventItemFromId,
  ServiceItemFromId,
  UserItemFromId,
} from '@components/ItemCards'
import Note from '@components/Note'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import locationAtom from '@state/atoms/locationAtom'
import modalsFuncAtom from '@state/modalsFuncAtom'
import cn from 'classnames'
import { useAtomValue } from 'jotai'
import { useEffect, useMemo, useRef, useState } from 'react'

const NOTIFICATION_TYPE_TITLES = {
  newEvents: 'Новые мероприятия',
  newUserRegistred: 'Регистрация нового пользователя',
  eventRegistration: 'Запись/отписка на мероприятие',
  serviceRegistration: 'Заявка на услугу',
  birthdays: 'Дни рождения',
  remindDates: 'Особые даты',
}

const normalizeId = (value) => {
  if (value === null || typeof value === 'undefined') return null
  if (typeof value === 'string') {
    const normalized = value.trim()
    return normalized || null
  }
  if (typeof value === 'number') return String(value)

  if (value && typeof value === 'object') {
    if (typeof value.$oid === 'string' && value.$oid.trim()) {
      return value.$oid.trim()
    }
    const stringified =
      typeof value.toString === 'function' ? String(value.toString()) : ''
    if (stringified && stringified !== '[object Object]') {
      return stringified
    }
  }
  return null
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
      types: Array.isArray(item?.types)
        ? item.types.map(String).filter(Boolean)
        : [],
      channels:
        item?.channels && typeof item.channels === 'object'
          ? item.channels
          : {},
      entities:
        item?.entities && typeof item.entities === 'object'
          ? item.entities
          : {},
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

const getItemTypes = (item) => {
  const types =
    Array.isArray(item?.types) && item.types.length > 0
      ? item.types
      : item?.type
        ? [item.type]
        : []
  return types.map(String).filter(Boolean)
}

const readEntityId = (item, key) => {
  const direct = item?.entities?.[key]
  const directNormalized = normalizeId(direct)
  if (directNormalized) return directNormalized
  const fromMap =
    item?.entities && typeof item.entities?.get === 'function'
      ? item.entities.get(key)
      : null
  const fromMapNormalized = normalizeId(fromMap)
  if (fromMapNormalized) return fromMapNormalized
  return null
}

const resolveEventId = (item) => {
  const fromEntities = readEntityId(item, 'eventId')
  if (fromEntities) return fromEntities
  const url = String(item?.url || '')
  const match = url.match(/\/event\/([a-zA-Z0-9]+)/)
  return match?.[1] || null
}

const resolveUserId = (item) => {
  const fromEntities = readEntityId(item, 'userId')
  if (fromEntities) return fromEntities
  const url = String(item?.url || '')
  const match = url.match(/\/user\/([a-zA-Z0-9]+)/)
  return match?.[1] || null
}

const resolveUserIds = (item) => {
  const value = item?.entities?.userIds
  const list = Array.isArray(value)
    ? value
    : value && typeof value === 'object'
      ? Object.values(value)
      : []
  const normalized = list.map((id) => normalizeId(id)).filter(Boolean)
  const validObjectIds = Array.from(new Set(normalized)).filter((id) =>
    /^[a-fA-F0-9]{24}$/.test(String(id))
  )
  if (validObjectIds.length > 0) return validObjectIds
  const single = resolveUserId(item)
  return single ? [single] : []
}

const resolveServiceId = (item) => {
  const fromEntities = readEntityId(item, 'serviceId')
  if (fromEntities) return fromEntities
  const url = String(item?.url || '')
  const match = url.match(/\/service\/([a-zA-Z0-9]+)/)
  return match?.[1] || null
}

const notificationsHistoryFunc = () => {
  const NotificationsHistoryModal = () => {
    const location = useAtomValue(locationAtom)
    const loggedUserActive = useAtomValue(loggedUserActiveAtom)
    const modalsFunc = useAtomValue(modalsFuncAtom)
    const [historySource, setHistorySource] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [typesOpen, setTypesOpen] = useState(false)
    const [selectedTypes, setSelectedTypes] = useState([])
    const typeButtonRef = useRef(null)
    const typePanelRef = useRef(null)

    const history = useMemo(
      () => normalizeHistoryList(historySource),
      [historySource]
    )

    const availableTypes = useMemo(() => {
      const uniq = new Set()
      history.forEach((item) => {
        getItemTypes(item).forEach((type) => uniq.add(type))
      })
      return Array.from(uniq)
    }, [history])

    const hasTypesFilter = selectedTypes.length > 0

    const filteredHistory = useMemo(() => {
      if (!hasTypesFilter) return history
      const selected = new Set(selectedTypes.map(String))
      return history.filter((item) =>
        getItemTypes(item).some((type) => selected.has(type))
      )
    }, [hasTypesFilter, history, selectedTypes])

    const typeButtonLabel = useMemo(() => {
      if (!selectedTypes.length) return 'Все типы'
      if (selectedTypes.length === 1) {
        return NOTIFICATION_TYPE_TITLES[selectedTypes[0]] || selectedTypes[0]
      }
      return `Типы: ${selectedTypes.length}`
    }, [selectedTypes])

    const toggleType = (type) => {
      const value = String(type)
      setSelectedTypes((prev) => {
        if (prev.includes(value)) return prev.filter((id) => id !== value)
        return [...prev, value]
      })
    }

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
          const response = await fetch(
            `/api/${location}/notifications/history?limit=200`
          )
          const json = await response.json()
          if (!response.ok) {
            console.log('[NotificationsHistory][Client] fetch failed', {
              status: response.status,
              body: json,
            })
            const message =
              json?.data?.error?.message ||
              'Не удалось получить историю уведомлений'
            setLoadError(message)
            return
          }
          if (!json?.success) {
            const message =
              json?.data?.error?.message ||
              'Не удалось получить историю уведомлений'
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

    useEffect(() => {
      const onClickOutside = (event) => {
        const target = event.target
        const clickedPanel =
          typePanelRef.current && typePanelRef.current.contains(target)
        const clickedButton =
          typeButtonRef.current && typeButtonRef.current.contains(target)
        if (!clickedPanel && !clickedButton) setTypesOpen(false)
      }

      document.addEventListener('mousedown', onClickOutside)
      return () => document.removeEventListener('mousedown', onClickOutside)
    }, [])

    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="relative z-[5] mb-2 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <button
              ref={typeButtonRef}
              type="button"
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-semibold transition',
                hasTypesFilter
                  ? 'border-[rgba(107,31,42,0.35)] bg-[#6b1f2a] text-white'
                  : 'border-[#ece7ea] bg-[#f5f5f6] text-[#24171d] hover:bg-[#ece9ec]'
              )}
              onClick={() => setTypesOpen((state) => !state)}
            >
              {typeButtonLabel}
            </button>
            <div className="ml-auto rounded-full bg-[#f7ecf0] px-3 py-1.5 text-xs font-semibold text-[#6b1f2a]">
              Найдено: {filteredHistory.length}
            </div>
          </div>

          <div className="absolute left-0 z-20 w-full pointer-events-none top-full">
            <div
              ref={typePanelRef}
              className={cn(
                'pointer-events-auto absolute left-0 top-2 w-full max-w-[420px] rounded-2xl border border-[#efe3e8] bg-white p-3 shadow-[0_18px_36px_rgba(0,0,0,0.12)] origin-top transition-all duration-150 ease-out',
                typesOpen
                  ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                  : 'pointer-events-none -translate-y-2 scale-[0.98] opacity-0'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-bold text-[#4b0f1c]">
                  Типы уведомлений
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#6b1f2a] hover:underline"
                  onClick={() => setSelectedTypes([])}
                >
                  Сбросить
                </button>
              </div>
              <div className="max-h-[280px] overflow-y-auto pr-1">
                {availableTypes.map((type) => {
                  const checked = selectedTypes.includes(String(type))
                  return (
                    <label
                      key={type}
                      className={cn(
                        'mb-1 flex cursor-pointer items-center gap-2 rounded-xl px-2 py-2 text-sm',
                        checked ? 'bg-[#f6edf1]' : 'hover:bg-[#f5f5f6]'
                      )}
                    >
                      <input
                        className="cursor-pointer"
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleType(type)}
                      />
                      <span>{NOTIFICATION_TYPE_TITLES[type] || type}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="mb-2 text-sm text-gray-600">Загрузка истории...</div>
          ) : null}
          {loadError ? (
            <div className="mb-2 text-sm text-danger">{loadError}</div>
          ) : null}
          {filteredHistory.length === 0 ? (
            <div className="text-sm text-gray-600">
              Пока нет сохраненных уведомлений
            </div>
          ) : (
            filteredHistory.map((item, index) =>
              (() => {
                const eventId = resolveEventId(item)
                const userIds = resolveUserIds(item)
                const serviceId = resolveServiceId(item)
                const itemTypes = Array.isArray(item?.types) ? item.types : []
                const isEventRegistration =
                  item?.type === 'eventRegistration' ||
                  itemTypes.includes('eventRegistration')
                const isServiceRegistration =
                  item?.type === 'serviceRegistration' ||
                  itemTypes.includes('serviceRegistration')
                const hasBirthdaysType =
                  item?.type === 'birthdays' || itemTypes.includes('birthdays')

                return (
                  <div
                    key={`${item.notificationId || item.createdAt?.toISOString?.() || 'item'}-${item.tag}-${index}`}
                    className="p-3 mb-2 bg-white border border-gray-200 rounded-md"
                  >
                    <div className="mb-2 text-xs text-gray-600">
                      {item.createdAt?.toLocaleString?.('ru-RU') || ''}
                    </div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="mt-1 text-xs text-gray-600">
                      Тип: {notificationTypeLabel(item)}
                    </div>
                    {item.body ? (
                      <Note noItalic className="mt-2 mb-1 whitespace-pre-line">
                        {item.body}
                      </Note>
                    ) : null}

                    {isEventRegistration && (
                      <div className="mt-2 space-y-2">
                        {eventId ? (
                          <EventItemFromId
                            eventId={eventId}
                            bordered
                            onClick={() => modalsFunc.event.view(eventId)}
                          />
                        ) : null}
                        {userIds.map((userId) => (
                          <div
                            key={`${item.notificationId || 'event-reg'}-${userId}`}
                            className="overflow-hidden border border-gray-500 rounded-sm"
                          >
                            <UserItemFromId
                              userId={userId}
                              onClick={() => modalsFunc.user.view(userId)}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {isServiceRegistration && (
                      <div className="mt-2 space-y-2">
                        {serviceId ? (
                          <ServiceItemFromId
                            serviceId={serviceId}
                            bordered
                            onClick={() => modalsFunc.service.view(serviceId)}
                          />
                        ) : null}
                        {userIds.map((userId) => (
                          <div
                            key={`${item.notificationId || 'service-reg'}-${userId}`}
                            className="overflow-hidden border border-gray-500 rounded-sm"
                          >
                            <UserItemFromId
                              userId={userId}
                              onClick={() => modalsFunc.user.view(userId)}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {hasBirthdaysType && (
                      <div className="mt-2">
                        <Button
                          name="Посмотреть ближайшие Дни рождения"
                          thin
                          onClick={() => {
                            window.location.href = `/${item.location || location}/cabinet/birthdays`
                          }}
                        />
                      </div>
                    )}
                  </div>
                )
              })()
            )
          )}
        </div>
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
