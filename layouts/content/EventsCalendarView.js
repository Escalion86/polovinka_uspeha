'use client'

import cn from 'classnames'
import PropTypes from 'prop-types'
import { useEffect, useMemo, useState } from 'react'

const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const toDayKey = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const buildMonthMatrix = (cursorDate) => {
  const year = cursorDate.getFullYear()
  const month = cursorDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startWeekDay = (firstDay.getDay() + 6) % 7
  const daysInMonth = lastDay.getDate()

  const matrix = []
  let current = 1 - startWeekDay
  while (current <= daysInMonth) {
    const row = []
    for (let i = 0; i < 7; i += 1) {
      const date = new Date(year, month, current)
      const inMonth = current >= 1 && current <= daysInMonth
      row.push({
        date,
        inMonth,
        day: date.getDate(),
        key: toDayKey(date),
      })
      current += 1
    }
    matrix.push(row)
  }

  return matrix
}

const formatMonthTitle = (date) =>
  date.toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric',
  })

const formatEventTime = (dateString) => {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const EventsCalendarView = ({ events = [], onOpenEvent }) => {
  const now = new Date()
  const [cursorDate, setCursorDate] = useState(
    () => new Date(now.getFullYear(), now.getMonth(), 1)
  )

  const eventsByDay = useMemo(
    () =>
      (Array.isArray(events) ? events : []).reduce((acc, event) => {
        const key = toDayKey(event?.dateStart)
        if (!key) return acc
        if (!acc[key]) acc[key] = []
        acc[key].push(event)
        return acc
      }, {}),
    [events]
  )

  const matrix = useMemo(() => buildMonthMatrix(cursorDate), [cursorDate])

  const defaultSelectedDay = useMemo(() => {
    const monthEvents = (Array.isArray(events) ? events : []).filter((event) => {
      const date = new Date(event?.dateStart)
      return (
        !Number.isNaN(date.getTime()) &&
        date.getFullYear() === cursorDate.getFullYear() &&
        date.getMonth() === cursorDate.getMonth()
      )
    })
    const first = monthEvents
      .sort((a, b) => new Date(a.dateStart) - new Date(b.dateStart))
      .at(0)
    return toDayKey(first?.dateStart) || toDayKey(cursorDate)
  }, [events, cursorDate])

  const [selectedDay, setSelectedDay] = useState(defaultSelectedDay)

  useEffect(() => {
    setSelectedDay(defaultSelectedDay)
  }, [defaultSelectedDay])

  const selectedEvents = eventsByDay[selectedDay] || []
  const todayKey = toDayKey(now)

  return (
    <div className="mx-1 mb-2 rounded-2xl border border-[#f0e2e8] bg-white p-3 shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            setCursorDate(
              (state) => new Date(state.getFullYear(), state.getMonth() - 1, 1)
            )
          }
          className="rounded-lg border border-[#f0e2e8] px-3 py-1 text-sm text-[#6b1f2a] transition hover:bg-[#6b1f2a] hover:text-white"
        >
          Назад
        </button>
        <div className="text-base font-bold capitalize text-[#4b0f1c]">
          {formatMonthTitle(cursorDate)}
        </div>
        <button
          type="button"
          onClick={() =>
            setCursorDate(
              (state) => new Date(state.getFullYear(), state.getMonth() + 1, 1)
            )
          }
          className="rounded-lg border border-[#f0e2e8] px-3 py-1 text-sm text-[#6b1f2a] transition hover:bg-[#6b1f2a] hover:text-white"
        >
          Вперед
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="pb-1 text-center text-xs font-semibold uppercase tracking-wide text-[#8b6d75]"
          >
            {day}
          </div>
        ))}
        {matrix.flat().map((cell) => {
          const dayEvents = eventsByDay[cell.key] || []
          const isSelected = selectedDay === cell.key
          const isToday = todayKey === cell.key

          return (
            <button
              type="button"
              key={`${cell.key}-${cell.day}`}
              onClick={() => setSelectedDay(cell.key)}
              className={cn(
                'relative min-h-12 rounded-lg border p-1 text-left transition',
                cell.inMonth
                  ? 'border-[#f3e8ec] bg-[#fffdfd] hover:border-[#d8b9c2]'
                  : 'border-transparent bg-[#faf7f8] text-[#c5b4ba]',
                isSelected && 'border-[#6b1f2a] bg-[#fff6f8]',
                isToday && !isSelected && 'border-[#8dcff2]'
              )}
            >
              <div className="text-sm font-semibold">{cell.day}</div>
              {dayEvents.length > 0 ? (
                <div className="absolute bottom-1 right-1 rounded-full bg-[#6b1f2a] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {dayEvents.length}
                </div>
              ) : null}
            </button>
          )
        })}
      </div>

      <div className="mt-3 rounded-xl border border-[#f3e8ec] bg-[#fffdfd] p-2">
        {selectedEvents.length === 0 ? (
          <div className="text-sm text-[#8b6d75]">На выбранный день мероприятий нет</div>
        ) : (
          <div className="flex flex-col gap-y-2">
            {selectedEvents
              .slice()
              .sort((a, b) => new Date(a.dateStart) - new Date(b.dateStart))
              .map((event) => (
                <button
                  key={event._id}
                  type="button"
                  onClick={() => onOpenEvent && onOpenEvent(event._id)}
                  className="flex items-center justify-between rounded-lg border border-[#f0e2e8] bg-white px-3 py-2 text-left text-[#4b0f1c] transition hover:bg-[#fff4f7]"
                >
                  <div className="flex-1 pr-3">
                    <div className="font-semibold">{event.title}</div>
                    <div className="text-xs text-[#8b6d75]">
                      {formatEventTime(event.dateStart)}
                    </div>
                  </div>
                  <div className="text-xs text-[#6b1f2a]">Открыть</div>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

EventsCalendarView.propTypes = {
  events: PropTypes.array,
  onOpenEvent: PropTypes.func,
}

export default EventsCalendarView
