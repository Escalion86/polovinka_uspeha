'use client'

import { getData } from '@helpers/CRUD'
import EventCard from '@layouts/cards/EventCard2'
import eventsAtom from '@state/atoms/eventsAtom'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { useEffect, useMemo, useState } from 'react'
import { useSetAtom } from 'jotai'

const MONTHS_FULL = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]

const MONTHS_FULL_2 = [
  'январе',
  'феврале',
  'марте',
  'апреле',
  'мае',
  'июне',
  'июле',
  'августе',
  'сентябре',
  'октябре',
  'ноябре',
  'декабре',
]

const MONTHS_FULL_UPPER = [
  'ЯНВАРЬ',
  'ФЕВРАЛЬ',
  'МАРТ',
  'АПРЕЛЬ',
  'МАЙ',
  'ИЮНЬ',
  'ИЮЛЬ',
  'АВГУСТ',
  'СЕНТЯБРЬ',
  'ОКТЯБРЬ',
  'НОЯБРЬ',
  'ДЕКАБРЬ',
]

const toDayKey = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const buildMonthDays = (cursorDate) => {
  const year = cursorDate.getFullYear()
  const month = cursorDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => i + 1)
}

const resolveInitialCursorDate = (events = []) => {
  const now = new Date()
  const normalizedDates = (Array.isArray(events) ? events : [])
    .map((event) => new Date(event?.dateStart))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => a - b)

  const nearestUpcomingDate = normalizedDates.find((date) => date >= now)
  const baseDate = nearestUpcomingDate || now
  return new Date(baseDate.getFullYear(), baseDate.getMonth(), 1)
}

const getMonthBounds = (cursorDate) => {
  const start = new Date(cursorDate.getFullYear(), cursorDate.getMonth(), 1)
  const end = new Date(cursorDate.getFullYear(), cursorDate.getMonth() + 1, 1)
  return { start, end }
}

const EventsCalendarView = ({
  events = [],
  location,
  onMonthEventsCountChange,
  applyFiltersAndSort,
}) => {
  const setEventsState = useSetAtom(eventsAtom)
  const [cursorDate, setCursorDate] = useState(() =>
    resolveInitialCursorDate(events)
  )
  const [monthEvents, setMonthEvents] = useState([])
  const [loadingMonth, setLoadingMonth] = useState(false)
  const [hasPrevMonth, setHasPrevMonth] = useState(false)
  const [hasNextMonth, setHasNextMonth] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)

  useEffect(() => {
    let ignore = false

    const loadByMonth = async () => {
      if (!location) return
      setLoadingMonth(true)
      const { start, end } = getMonthBounds(cursorDate)

      const [monthEventsRaw, prevCount, nextCount] = await Promise.all([
        getData(`/api/${location}/events`, {
          dateStart: {
            $gte: start.toISOString(),
            $lt: end.toISOString(),
          },
        }),
        getData(`/api/${location}/events`, {
          dateStart: { $lt: start.toISOString() },
          countReturn: true,
        }),
        getData(`/api/${location}/events`, {
          dateStart: { $gte: end.toISOString() },
          countReturn: true,
        }),
      ])

      if (ignore) return

      const normalizedMonthEvents = Array.isArray(monthEventsRaw)
        ? monthEventsRaw
        : []
      const filteredMonthEvents = applyFiltersAndSort
        ? applyFiltersAndSort(normalizedMonthEvents)
        : normalizedMonthEvents
      const sortedMonthEvents = [...filteredMonthEvents].sort(
        (a, b) => new Date(a.dateStart) - new Date(b.dateStart)
      )

      setMonthEvents(sortedMonthEvents)
      setEventsState((prevEvents) => {
        const current = Array.isArray(prevEvents) ? prevEvents : []
        const map = new Map(current.map((event) => [String(event?._id), event]))
        sortedMonthEvents.forEach((event) => {
          if (event?._id) map.set(String(event._id), event)
        })
        return Array.from(map.values())
      })
      setHasPrevMonth(Number(prevCount) > 0)
      setHasNextMonth(Number(nextCount) > 0)
      onMonthEventsCountChange?.(sortedMonthEvents.length)
      setLoadingMonth(false)
    }

    loadByMonth()

    return () => {
      ignore = true
    }
  }, [cursorDate, location, applyFiltersAndSort, onMonthEventsCountChange])

  const activeDays = useMemo(() => {
    const days = new Set()
    monthEvents.forEach((event) => {
      const date = new Date(event?.dateStart)
      if (Number.isNaN(date.getTime())) return
      if (date.getFullYear() !== cursorDate.getFullYear()) return
      if (date.getMonth() !== cursorDate.getMonth()) return
      days.add(String(date.getDate()))
    })
    return Array.from(days).sort((a, b) => Number(a) - Number(b))
  }, [monthEvents, cursorDate])

  useEffect(() => {
    if (activeDays.length === 0) {
      setSelectedDay(null)
      return
    }
    if (!selectedDay || !activeDays.includes(String(selectedDay))) {
      setSelectedDay(activeDays[0])
    }
  }, [activeDays, selectedDay])

  const calendarDays = useMemo(() => buildMonthDays(cursorDate), [cursorDate])
  const month = cursorDate.getMonth()
  const year = cursorDate.getFullYear()
  const monthLabel = `${MONTHS_FULL_UPPER[month]} ${year}`
  const monthName = MONTHS_FULL[month]
  const monthNamePadeg = MONTHS_FULL_2[month]

  const selectedKey = selectedDay
    ? toDayKey(new Date(year, month, Number(selectedDay)))
    : null

  const selectedEvents = useMemo(() => {
    if (!selectedKey) return []
    return monthEvents.filter(
      (event) => toDayKey(event?.dateStart) === selectedKey
    )
  }, [monthEvents, selectedKey])

  return (
    <div className="flex flex-col items-stretch gap-6 mx-1">
      <div className="flex justify-center w-full">
        <div className="w-full max-w-140 rounded-2xl bg-white p-4 shadow-[0_16px_30px_rgba(0,0,0,0.08)]">
          <div className="mb-4 flex items-center justify-between font-semibold text-[#6b1f2a]">
            {hasPrevMonth ? (
              <button
                type="button"
                onClick={() =>
                  setCursorDate(
                    (state) =>
                      new Date(state.getFullYear(), state.getMonth() - 1, 1)
                  )
                }
                className="flex h-11 w-11 pb-1 items-center justify-center rounded-xl border border-[#f0e2e8] text-2xl text-[#6b1f2a] transition hover:bg-[#6b1f2a] hover:text-white"
                aria-label="Предыдущий месяц"
              >
                ←
              </button>
            ) : (
              <span className="h-11 w-11" />
            )}
            <span>{monthLabel}</span>
            {hasNextMonth ? (
              <button
                type="button"
                onClick={() =>
                  setCursorDate(
                    (state) =>
                      new Date(state.getFullYear(), state.getMonth() + 1, 1)
                  )
                }
                className="flex h-11 w-11 pb-1 items-center justify-center rounded-xl border border-[#f0e2e8] text-2xl text-[#6b1f2a] transition hover:bg-[#6b1f2a] hover:text-white"
                aria-label="Следующий месяц"
              >
                →
              </button>
            ) : (
              <span className="h-11 w-11" />
            )}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day) => {
              const dayKey = String(day)
              const isActive = activeDays.includes(dayKey)
              const isSelected = selectedDay === dayKey
              return (
                <button
                  key={day}
                  type="button"
                  className={cn(
                    'rounded-[10px] border px-0 py-2 text-[14px]',
                    isSelected
                      ? 'border-transparent bg-[#6b1f2a] text-white'
                      : isActive
                        ? 'cursor-pointer border-[rgba(79,176,232,0.5)] bg-[rgba(79,176,232,0.2)] text-[#245c7b]'
                        : 'border-transparent bg-[#f1f2f4] text-[#555]'
                  )}
                  onClick={() => isActive && setSelectedDay(dayKey)}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center overflow-x-hidden rounded-2xl bg-white shadow-[0_16px_30px_rgba(0,0,0,0.08)]">
        {(selectedEvents.length === 0 || loadingMonth) && (
          <h3 className="px-6 py-6 text-lg font-bold text-[#6b1f2a]">
            {/* {selectedDay
            ? `События на ${selectedDay} ${monthName}`
            : 'Выберите активную дату'} */}
            {loadingMonth
              ? `Загрузка мероприятий...`
              : `В ${monthNamePadeg} ${year} нет мероприятий`}
          </h3>
        )}
        {selectedEvents.length === 0 ? null : (
          // <p className="mt-2 px-6 pb-6 text-[#666]">
          //   На выбранную дату нет мероприятий. Выберите активную дату.
          // </p>
          <div className="grid gap-1 pb-4 mt-3">
            {selectedEvents.map((event) => (
              <EventCard key={event._id} eventId={event._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

EventsCalendarView.propTypes = {
  events: PropTypes.array,
  location: PropTypes.string,
  onMonthEventsCountChange: PropTypes.func,
  applyFiltersAndSort: PropTypes.func,
}

export default EventsCalendarView
