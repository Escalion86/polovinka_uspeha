import { DAYS_OF_WEEK, MONTHS, MONTHS_FULL } from '@helpers/constants'
import formatMinutes from '@helpers/formatMinutes'
import cn from 'classnames'
import React from 'react'

const DateToDateTimeStr = (date, showDayOfWeek = true, fullMonth) => {
  var d = new Date(date),
    minutes = '' + d.getMinutes(),
    hours = '' + d.getHours(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    week = d.getDay(),
    year = d.getFullYear()

  if (minutes.length < 2) minutes = '0' + minutes
  if (hours.length < 2) hours = '0' + hours

  const strDateStart =
    day +
    ' ' +
    (fullMonth ? MONTHS_FULL[month - 1] : MONTHS[month - 1]) +
    ' ' +
    year.toString() +
    (showDayOfWeek ? ' ' + DAYS_OF_WEEK[week] : '')

  const strTimeStart = hours + ':' + minutes
  return [strDateStart, strTimeStart]
}

const DateTimeEvent = ({
  event,
  wrapperClassName,
  dateClassName,
  timeClassName,
  durationClassName,
  showDayOfWeek,
  fullMonth,
  showDuration,
}) => {
  const dateTime = event?.date
  if (!dateTime) return undefined

  const finishedDateTime =
    new Date(dateTime).getTime() + (event?.duration ?? 0) * 60000

  const [strDateStart, strTimeStart] = DateToDateTimeStr(
    dateTime,
    showDayOfWeek,
    fullMonth
  )
  const [strDateFinish, strTimeFinish] = DateToDateTimeStr(
    finishedDateTime,
    showDayOfWeek,
    fullMonth
  )

  return (
    <div
      className={cn('flex gap-x-1 flex-wrap items-center', wrapperClassName)}
    >
      <div className="flex flex-wrap items-center gap-x-1">
        <div className="flex items-center gap-x-1 flex-nowrap">
          <span className={cn('whitespace-nowrap', dateClassName)}>
            {strDateStart}
          </span>
          {!event?.duration ||
            (strDateFinish !== strDateStart && (
              <span className={timeClassName}>{strTimeStart}</span>
            ))}
          {event?.duration && strDateFinish !== strDateStart && <span>-</span>}
        </div>
        {event?.duration && strDateFinish === strDateStart && (
          <div className="flex items-center gap-x-1 flex-nowrap">
            <span className={timeClassName}>{strTimeStart}</span>
            <span>-</span>
            <span className={timeClassName}>{strTimeFinish}</span>
          </div>
        )}
      </div>
      {event?.duration && strDateFinish !== strDateStart && (
        <div className="flex flex-wrap items-center gap-x-1">
          <div className="flex items-center gap-x-1 flex-nowrap">
            <span className={cn('whitespace-nowrap', dateClassName)}>
              {strDateFinish}
            </span>
            <span className={timeClassName}>{strTimeFinish}</span>
          </div>
        </div>
      )}
      {showDuration && (
        <span className={durationClassName}>
          {'(' + formatMinutes(event.duration ?? 60) + ')'}
        </span>
      )}
    </div>
  )
}

export default DateTimeEvent
