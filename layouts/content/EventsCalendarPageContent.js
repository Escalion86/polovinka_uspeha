'use client'

import EventsList from '@layouts/lists/EventsList'
import AddButton from '@components/IconToggleButtons/AddButton'
import directionsAtom from '@state/atoms/directionsAtom'
import eventsAtom from '@state/atoms/eventsAtom'
import locationAtom from '@state/atoms/locationAtom'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import asyncEventsUsersByUserIdAtom from '@state/async/asyncEventsUsersByUserIdAtom'
import modalsFuncAtom from '@state/modalsFuncAtom'
import visibleEventsForUser from '@helpers/visibleEventsForUser'
import isEventCanceled from '@helpers/isEventCanceled'
import isEventExpired from '@helpers/isEventExpired'
import useCityManagementAccess from '@hooks/useCityManagementAccess'
import useRouter from '@utils/useRouter'
import cn from 'classnames'
import { useSearchParams } from 'next/navigation'
import { useAtomValue } from 'jotai'
import { unwrap } from 'jotai/utils'
import { useEffect, useMemo, useRef, useState } from 'react'

const WEEKDAY_LABELS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']
const MONTHS_FULL = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
]

const atStartOfDay = (value) => {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

const toDateKey = (value) => {
  const date = atStartOfDay(value)
  if (!date) return null
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDateRu = (value) => {
  const date = atStartOfDay(value)
  if (!date) return ''
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  })
}

const formatDateRuNoWrap = (value) => formatDateRu(value).replace(' ', '\u00A0')

const buildMonthDays = (cursorDate) => {
  const year = cursorDate.getFullYear()
  const month = cursorDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDaySundayFirst = new Date(year, month, 1).getDay()
  const firstDayMondayFirst = (firstDaySundayFirst + 6) % 7

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const prefix = Array.from({ length: firstDayMondayFirst }, () => null)
  const cells = [...prefix, ...days]
  const tail = (7 - (cells.length % 7)) % 7

  return [...cells, ...Array.from({ length: tail }, () => null)]
}

const getNextWeekendRange = () => {
  const today = atStartOfDay(new Date())
  if (!today) return { start: null, end: null }
  const day = today.getDay()
  const daysToSaturday = day === 6 ? 0 : (6 - day + 7) % 7
  const saturday = new Date(today)
  saturday.setDate(today.getDate() + daysToSaturday)
  const sunday = new Date(saturday)
  sunday.setDate(saturday.getDate() + 1)
  return { start: saturday, end: sunday }
}

const EventsCalendarPageContent = () => {
  const events = useAtomValue(eventsAtom)
  const directions = useAtomValue(directionsAtom)
  const location = useAtomValue(locationAtom)
  const router = useRouter()
  const searchParams = useSearchParams()
  const loggedUser = useAtomValue(loggedUserActiveAtom)
  const loggedUserStatus = useAtomValue(loggedUserActiveStatusAtom)
  const loggedUserRole = useAtomValue(loggedUserActiveRoleSelector)
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const eventsUsersAtom = useMemo(
    () =>
      unwrap(asyncEventsUsersByUserIdAtom(loggedUser?._id), (prev) => prev ?? []),
    [loggedUser?._id]
  )
  const eventsUsers = useAtomValue(eventsUsersAtom)
  const eventsUsersVisibilityRef = useRef([])
  const eventsUsersForVisibility = useMemo(() => {
    const source = Array.isArray(eventsUsers) ? eventsUsers : []
    const next = source.map(({ _id, userId, eventId, status, subEventId }) => ({
      _id,
      userId,
      eventId,
      status,
      subEventId,
    }))

    const prev = eventsUsersVisibilityRef.current
    const isSame =
      prev.length === next.length &&
      prev.every(
        (item, index) =>
          item?._id === next[index]?._id &&
          item?.userId === next[index]?.userId &&
          item?.eventId === next[index]?.eventId &&
          item?.status === next[index]?.status &&
          item?.subEventId === next[index]?.subEventId
      )

    if (isSame) return prev
    eventsUsersVisibilityRef.current = next
    return next
  }, [eventsUsers])
  const { loading: cityAccessLoading, allowEventManagement } =
    useCityManagementAccess()
  const canUseAdminStatusFilter = Boolean(
    loggedUserRole?.dev ||
    loggedUserRole?.president ||
    loggedUserRole?._id === 'supervisor'
  )

  const allDirections = useMemo(
    () =>
      (Array.isArray(directions) ? directions : [])
        .filter((direction) => direction?.showOnSite !== false)
        .sort((a, b) => (a?.index ?? 999) - (b?.index ?? 999)),
    [directions]
  )

  const upcomingEvents = useMemo(() => {
    const visible = visibleEventsForUser(
      Array.isArray(events) ? events : [],
      eventsUsersForVisibility,
      loggedUser,
      false,
      loggedUserRole?.events?.seeHidden,
      loggedUserStatus
    )

    return visible
      .filter((event) => {
        if (!event?.dateStart) return false
        if (isEventExpired(event)) return false
        return true
      })
      .sort((a, b) => new Date(a.dateStart) - new Date(b.dateStart))
  }, [
    events,
    eventsUsersForVisibility,
    loggedUser,
    loggedUserRole,
    loggedUserStatus,
  ])

  const [selectedDirectionIds, setSelectedDirectionIds] = useState([])
  const [showCanceledEvents, setShowCanceledEvents] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [directionsOpen, setDirectionsOpen] = useState(false)
  const [rangeDraft, setRangeDraft] = useState({ start: null, end: null })
  const [rangeApplied, setRangeApplied] = useState({ start: null, end: null })

  const today = useMemo(() => atStartOfDay(new Date()), [])

  const maxEventDate = useMemo(() => {
    if (!upcomingEvents.length) return today
    const maxDate = upcomingEvents.reduce((acc, event) => {
      const date = atStartOfDay(event?.dateStart)
      if (!date) return acc
      if (!acc || date > acc) return date
      return acc
    }, null)
    return maxDate || today
  }, [today, upcomingEvents])

  const [cursorDate, setCursorDate] = useState(() => {
    const base = today || new Date()
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })

  const datePanelRef = useRef(null)
  const directionPanelRef = useRef(null)
  const dateButtonRef = useRef(null)
  const directionButtonRef = useRef(null)
  const handledQueryEventRef = useRef(null)

  const eventFromQueryId = useMemo(() => {
    const raw = searchParams?.get('event')
    return raw || null
  }, [searchParams])

  useEffect(() => {
    if (!eventFromQueryId || !location) return
    if (handledQueryEventRef.current === eventFromQueryId) return
    if (typeof modalsFunc?.event?.view !== 'function') return

    handledQueryEventRef.current = eventFromQueryId
    modalsFunc.event.view(eventFromQueryId)

    const nextQuery = { ...router.query }
    delete nextQuery.event

    router.replace(
      {
        pathname: `/${location}/cabinet/eventsCalendar`,
        query: nextQuery,
      },
      '',
      { shallow: true }
    )
  }, [eventFromQueryId, location, modalsFunc, router])

  useEffect(() => {
    const onClickOutside = (event) => {
      const target = event.target
      if (calendarOpen) {
        const clickedDatePanel =
          datePanelRef.current && datePanelRef.current.contains(target)
        const clickedDateButton =
          dateButtonRef.current && dateButtonRef.current.contains(target)
        if (!clickedDatePanel && !clickedDateButton) setCalendarOpen(false)
      }
      if (directionsOpen) {
        const clickedDirectionPanel =
          directionPanelRef.current &&
          directionPanelRef.current.contains(target)
        const clickedDirectionButton =
          directionButtonRef.current &&
          directionButtonRef.current.contains(target)
        if (!clickedDirectionPanel && !clickedDirectionButton) {
          setDirectionsOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [calendarOpen, directionsOpen])

  const hasDirectionsFilter = selectedDirectionIds.length > 0
  const canAddEvent = loggedUserRole?.events?.add && allowEventManagement

  const eventsAfterDirectionFilter = useMemo(() => {
    if (!hasDirectionsFilter) return upcomingEvents
    const ids = new Set(selectedDirectionIds.map(String))
    return upcomingEvents.filter((event) => ids.has(String(event.directionId)))
  }, [hasDirectionsFilter, selectedDirectionIds, upcomingEvents])

  const eventsAfterStatusFilter = useMemo(() => {
    if (!canUseAdminStatusFilter) {
      return eventsAfterDirectionFilter.filter(
        (event) => !isEventCanceled(event)
      )
    }
    return eventsAfterDirectionFilter.filter((event) =>
      isEventCanceled(event) ? showCanceledEvents : true
    )
  }, [canUseAdminStatusFilter, eventsAfterDirectionFilter, showCanceledEvents])

  const activeDaysSet = useMemo(() => {
    const result = new Set()
    eventsAfterStatusFilter.forEach((event) => {
      const key = toDateKey(event?.dateStart)
      if (key) result.add(key)
    })
    return result
  }, [eventsAfterStatusFilter])

  const filteredEvents = useMemo(() => {
    if (!rangeApplied.start) return eventsAfterStatusFilter
    const start = atStartOfDay(rangeApplied.start)
    const end = atStartOfDay(rangeApplied.end || rangeApplied.start)
    if (!start || !end) return eventsAfterStatusFilter
    const startMs = start.getTime()
    const endMs = end.getTime()

    return eventsAfterStatusFilter.filter((event) => {
      const eventDate = atStartOfDay(event?.dateStart)
      if (!eventDate) return false
      const ms = eventDate.getTime()
      return ms >= startMs && ms <= endMs
    })
  }, [eventsAfterStatusFilter, rangeApplied])

  const currentMonthStart = useMemo(
    () =>
      today
        ? new Date(today.getFullYear(), today.getMonth(), 1)
        : new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    [today]
  )

  const latestMonthWithEvents = useMemo(() => {
    const date = maxEventDate || today || new Date()
    return new Date(date.getFullYear(), date.getMonth(), 1)
  }, [maxEventDate, today])

  const canGoPrevMonth = cursorDate > currentMonthStart
  const canGoNextMonth = cursorDate < latestMonthWithEvents

  const calendarDays = useMemo(() => buildMonthDays(cursorDate), [cursorDate])
  const monthLabel = `${MONTHS_FULL[cursorDate.getMonth()]} ${cursorDate.getFullYear()}`

  const inRangeDraft = (date) => {
    const day = atStartOfDay(date)
    if (!day) return false
    if (!rangeDraft.start) return false
    const start = atStartOfDay(rangeDraft.start)
    const end = atStartOfDay(rangeDraft.end || rangeDraft.start)
    if (!start || !end) return false
    const ms = day.getTime()
    return ms >= start.getTime() && ms <= end.getTime()
  }

  const isRangeEdge = (date) => {
    const dayKey = toDateKey(date)
    if (!dayKey) return false
    const startKey = toDateKey(rangeDraft.start)
    const endKey = toDateKey(rangeDraft.end || rangeDraft.start)
    return dayKey === startKey || dayKey === endKey
  }

  const toggleDirection = (directionId) => {
    const value = String(directionId)
    setSelectedDirectionIds((prev) => {
      if (prev.includes(value)) return prev.filter((id) => id !== value)
      return [...prev, value]
    })
  }

  const selectDay = (date) => {
    const day = atStartOfDay(date)
    if (!day) return

    if (!rangeDraft.start || (rangeDraft.start && rangeDraft.end)) {
      setRangeDraft({ start: day, end: null })
      return
    }

    const start = atStartOfDay(rangeDraft.start)
    if (!start) {
      setRangeDraft({ start: day, end: null })
      return
    }

    if (day.getTime() < start.getTime()) {
      setRangeDraft({ start: day, end: start })
      return
    }

    setRangeDraft({ start, end: day })
  }

  const applyDateFilter = () => {
    setRangeApplied(rangeDraft)
    setCalendarOpen(false)
  }

  const resetDateFilter = () => {
    const next = { start: null, end: null }
    setRangeDraft(next)
    setRangeApplied(next)
  }

  const dateButtonLabel = useMemo(() => {
    if (!rangeApplied.start) return 'Дата'
    if (
      !rangeApplied.end ||
      toDateKey(rangeApplied.start) === toDateKey(rangeApplied.end)
    ) {
      return formatDateRuNoWrap(rangeApplied.start)
    }
    return `${formatDateRuNoWrap(rangeApplied.start)} - ${formatDateRuNoWrap(rangeApplied.end)}`
  }, [rangeApplied])

  const directionButtonLabel = useMemo(() => {
    if (!selectedDirectionIds.length) return 'Все пространства'
    if (selectedDirectionIds.length === 1) {
      const direction = allDirections.find(
        (item) => String(item?._id) === String(selectedDirectionIds[0])
      )
      return direction?.title || '1 пространство'
    }
    return `Пространства: ${selectedDirectionIds.length}`
  }, [allDirections, selectedDirectionIds])

  const setToday = () => {
    if (!today) return
    setRangeDraft({ start: today, end: today })
  }

  const setTomorrow = () => {
    if (!today) return
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    setRangeDraft({ start: tomorrow, end: tomorrow })
  }

  const setWeekend = () => {
    const { start, end } = getNextWeekendRange()
    if (!start || !end) return
    setRangeDraft({ start, end })
  }

  const eventsListContent = useMemo(() => {
    if (filteredEvents.length > 0) {
      return (
        <EventsList events={filteredEvents} persistScrollKey="events-test" />
      )
    }

    return (
      <div className="mx-3 mt-4 rounded-2xl border border-[#eadde3] bg-white p-5 text-center text-[#6b1f2a]">
        Нет предстоящих мероприятий по выбранным фильтрам
      </div>
    )
  }, [filteredEvents])

  return (
    <div className="flex flex-col w-full h-full min-h-0 overflow-hidden">
      <div className="relative z-[5] border-b border-[rgba(107,31,42,0.08)] bg-white/95 px-3 py-3 backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          <button
            ref={dateButtonRef}
            type="button"
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-semibold transition',
              rangeApplied.start
                ? 'border-[rgba(107,31,42,0.35)] bg-[#6b1f2a] text-white'
                : 'border-[#ece7ea] bg-[#f5f5f6] text-[#24171d] hover:bg-[#ece9ec]'
            )}
            onClick={() => {
              setDirectionsOpen(false)
              setCalendarOpen((state) => !state)
            }}
          >
            {dateButtonLabel}
          </button>
          <button
            ref={directionButtonRef}
            type="button"
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-semibold transition',
              hasDirectionsFilter
                ? 'border-[rgba(107,31,42,0.35)] bg-[#6b1f2a] text-white'
                : 'border-[#ece7ea] bg-[#f5f5f6] text-[#24171d] hover:bg-[#ece9ec]'
            )}
            onClick={() => {
              setCalendarOpen(false)
              setDirectionsOpen((state) => !state)
            }}
          >
            {directionButtonLabel}
          </button>
          {canUseAdminStatusFilter ? (
            <div className="flex items-center">
              <button
                type="button"
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                  showCanceledEvents
                    ? 'border-[rgba(107,31,42,0.35)] bg-[#6b1f2a] text-white'
                    : 'border-[#ece7ea] bg-[#f5f5f6] text-[#24171d] hover:bg-[#ece9ec]'
                )}
                onClick={() => setShowCanceledEvents((state) => !state)}
              >
                {showCanceledEvents ? '✓ ' : ''}
                Отмененные
              </button>
            </div>
          ) : null}
          <div className="ml-auto rounded-full bg-[#f7ecf0] px-3 py-1.5 text-xs font-semibold text-[#6b1f2a]">
            Найдено: {filteredEvents.length}
          </div>
          {!cityAccessLoading && canAddEvent ? (
            <AddButton onClick={() => modalsFunc.event.add()} />
          ) : null}
        </div>

        <div className="absolute left-0 z-20 w-full pointer-events-none top-full">
          <div
            ref={directionPanelRef}
            className={cn(
              'pointer-events-auto absolute left-3 top-2 w-[calc(100%-1.5rem)] max-w-[420px] rounded-2xl border border-[#efe3e8] bg-white p-3 shadow-[0_18px_36px_rgba(0,0,0,0.12)] origin-top transition-all duration-150 ease-out',
              directionsOpen
                ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                : 'pointer-events-none -translate-y-2 scale-[0.98] opacity-0'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-bold text-[#4b0f1c]">
                Пространства
              </div>
              <button
                type="button"
                className="text-xs font-semibold text-[#6b1f2a] hover:underline"
                onClick={() => setSelectedDirectionIds([])}
              >
                Сбросить
              </button>
            </div>
            <div className="max-h-[280px] overflow-y-auto pr-1">
              {allDirections.map((direction) => {
                const checked = selectedDirectionIds.includes(
                  String(direction?._id)
                )
                return (
                  <label
                    key={direction?._id}
                    className={cn(
                      'mb-1 flex cursor-pointer items-center gap-2 rounded-xl px-2 py-2 text-sm',
                      checked ? 'bg-[#f6edf1]' : 'hover:bg-[#f5f5f6]'
                    )}
                  >
                    <input
                      className="cursor-pointer"
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleDirection(direction?._id)}
                    />
                    <span>{direction?.title || 'Без названия'}</span>
                  </label>
                )
              })}
            </div>
          </div>

          <div
            ref={datePanelRef}
            className={cn(
              'pointer-events-auto absolute left-3 top-2 w-[calc(100%-1.5rem)] max-w-[760px] max-h-[calc(100vh-9rem)] overflow-y-auto rounded-3xl border border-[#efe3e8] bg-white p-4 shadow-[0_18px_36px_rgba(0,0,0,0.12)] origin-top transition-all duration-150 ease-out',
              calendarOpen
                ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                : 'pointer-events-none -translate-y-2 scale-[0.98] opacity-0'
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-base leading-4 phoneH:ladding-5 phoneH:text-lg font-bold text-[#4b0f1c]">
                {rangeDraft.start
                  ? rangeDraft.end
                    ? `${formatDateRuNoWrap(rangeDraft.start)} - ${formatDateRuNoWrap(rangeDraft.end)}`
                    : formatDateRuNoWrap(rangeDraft.start)
                  : 'Выберите дату или диапазон'}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={cn(
                    'h-9 w-9 rounded-xl border text-lg',
                    canGoPrevMonth
                      ? 'border-[#e8d7df] text-[#6b1f2a] hover:bg-[#f7eef2]'
                      : 'cursor-not-allowed border-[#f0edf0] text-[#c7c2c5]'
                  )}
                  onClick={() =>
                    canGoPrevMonth &&
                    setCursorDate(
                      (state) =>
                        new Date(state.getFullYear(), state.getMonth() - 1, 1)
                    )
                  }
                >
                  ←
                </button>
                <div className="min-w-[100px] phoneH:min-w-[130px] text-center text-[13px] phoneH:text-sm font-bold uppercase tracking-[0.08em] text-[#4b0f1c]">
                  {monthLabel}
                </div>
                <button
                  type="button"
                  className={cn(
                    'h-9 w-9 rounded-xl border text-lg',
                    canGoNextMonth
                      ? 'border-[#e8d7df] text-[#6b1f2a] hover:bg-[#f7eef2]'
                      : 'cursor-not-allowed border-[#f0edf0] text-[#c7c2c5]'
                  )}
                  onClick={() =>
                    canGoNextMonth &&
                    setCursorDate(
                      (state) =>
                        new Date(state.getFullYear(), state.getMonth() + 1, 1)
                    )
                  }
                >
                  →
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-2">
              {WEEKDAY_LABELS.map((label) => (
                <div
                  key={label}
                  className="rounded-[10px] bg-[#f8edf1] px-0 py-1 phoneH:py-2 text-center text-[12px] font-semibold text-[#6b1f2a]"
                >
                  {label}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="h-9 phoneH:h-10 rounded-[10px] border border-transparent bg-transparent px-0 py-2"
                    />
                  )
                }

                const date = new Date(
                  cursorDate.getFullYear(),
                  cursorDate.getMonth(),
                  day
                )
                const key = toDateKey(date)
                const isPast = today ? date < today : false
                const isAfterLast = maxEventDate ? date > maxEventDate : false
                const disabled = isPast || isAfterLast
                const hasEvents = key ? activeDaysSet.has(key) : false
                const selected = inRangeDraft(date)
                const edge = isRangeEdge(date)

                return (
                  <button
                    key={`${cursorDate.getMonth()}-${day}`}
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && selectDay(date)}
                    className={cn(
                      'relative flex h-9 phoneH:h-10 w-full items-center justify-center rounded-[10px] border px-0 py-2 text-[13px] phoneH:text-[14px]',
                      disabled
                        ? 'cursor-not-allowed border-transparent bg-[#f1f2f4] text-[#cfc8cd]'
                        : 'border-transparent bg-[#f1f2f4] text-[#555]',
                      !disabled &&
                        !selected &&
                        !hasEvents &&
                        'hover:bg-[#eceff3]',
                      selected &&
                        'border-transparent bg-[rgba(107,31,42,0.80)] text-white',
                      edge &&
                        'border-transparent bg-[rgba(107,31,42,1)] font-bold text-white',
                      !selected &&
                        hasEvents &&
                        !disabled &&
                        'cursor-pointer border-[rgba(79,176,232,0.5)] bg-[rgba(79,176,232,0.2)] font-semibold text-[#245c7b]'
                    )}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-2 mt-4 flex-nowrap">
              <button
                type="button"
                className="rounded-xl bg-[#f2f2f3] px-3 phoneH:px-4 py-2 text-xs phoneH:text-sm font-semibold text-[#2a2327] hover:bg-[#ebeaed] whitespace-nowrap"
                onClick={setToday}
              >
                Сегодня
              </button>
              <button
                type="button"
                className="rounded-xl bg-[#f2f2f3] px-3 phoneH:px-4 py-2 text-xs phoneH:text-sm font-semibold text-[#2a2327] hover:bg-[#ebeaed] whitespace-nowrap"
                onClick={setTomorrow}
              >
                Завтра
              </button>
              <button
                type="button"
                className="rounded-xl bg-[#f2f2f3] px-3 phoneH:px-4 py-2 text-xs phoneH:text-sm font-semibold text-[#2a2327] hover:bg-[#ebeaed] whitespace-nowrap"
                onClick={setWeekend}
              >
                В выходные
              </button>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                type="button"
                className="rounded-full bg-[#ececec] px-6 py-2.5 font-semibold text-[#322a2f] hover:bg-[#e2e2e2]"
                onClick={resetDateFilter}
              >
                Сбросить
              </button>
              <button
                type="button"
                className="rounded-full bg-[rgba(107,31,42,1)] px-7 py-2.5 font-semibold text-white hover:bg-[rgba(79,176,232)] duration-300"
                onClick={applyDateFilter}
              >
                Готово
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">{eventsListContent}</div>
    </div>
  )
}

export default EventsCalendarPageContent
