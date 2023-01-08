import dateToDateTimeStr from '@helpers/dateToDateTimeStr'
import formatMinutes from '@helpers/formatMinutes'
import getEventDuration from '@helpers/getEventDuration'
import cn from 'classnames'
import React from 'react'

const DateTimeEvent = ({
  event,
  wrapperClassName,
  dateClassName,
  timeClassName,
  durationClassName,
  showDayOfWeek,
  fullMonth,
  showDuration,
  thin,
  twoLines,
}) => {
  const dateTimeStart = event?.dateStart
  if (!dateTimeStart) return undefined

  const dateTimeEnd = event?.dateEnd
  // new Date(dateTime).getTime() + (event?.duration ?? 0) * 60000

  const [strDateStart, strTimeStart] = dateToDateTimeStr(
    dateTimeStart,
    showDayOfWeek,
    fullMonth
  )
  const [strDateFinish, strTimeFinish] = dateToDateTimeStr(
    dateTimeEnd,
    showDayOfWeek,
    fullMonth
  )

  const duration = getEventDuration(event)

  return (
    <div
      className={cn(
        'flex leading-4',
        thin ? 'gap-x-0.5' : 'gap-x-1',
        twoLines ? 'flex-col items-center' : 'flex-wrap items-center',
        wrapperClassName
      )}
    >
      {/* <div
        className={cn(
          'flex flex-wrap items-center',
          thin ? 'gap-x-0.5' : 'gap-x-1'
        )}
      > */}
      <div
        className={cn(
          'flex items-center flex-nowrap',
          thin ? 'gap-x-0.5' : 'gap-x-1'
        )}
      >
        <span className={cn('whitespace-nowrap', dateClassName)}>
          {strDateStart}
        </span>
        {!duration ||
          (strDateFinish !== strDateStart && (
            <span className={timeClassName}>{strTimeStart}</span>
          ))}
        {duration && strDateFinish !== strDateStart && <span>-</span>}
      </div>
      {duration && strDateFinish === strDateStart && (
        <div
          className={cn(
            'flex items-center flex-nowrap',
            thin ? 'gap-x-0.5' : 'gap-x-1'
          )}
        >
          <span className={timeClassName}>{strTimeStart}</span>
          <span>-</span>
          <span className={timeClassName}>{strTimeFinish}</span>
        </div>
      )}
      {/* </div> */}
      {duration && strDateFinish !== strDateStart && (
        <div
          className={cn(
            'flex flex-wrap items-center',
            thin ? 'gap-x-0.5' : 'gap-x-1'
          )}
        >
          <div
            className={cn(
              'flex items-center flex-nowrap',
              thin ? 'gap-x-0.5' : 'gap-x-1'
            )}
          >
            <span className={cn('whitespace-nowrap', dateClassName)}>
              {strDateFinish}
            </span>
            <span className={timeClassName}>{strTimeFinish}</span>
          </div>
        </div>
      )}
      {showDuration && (
        <span className={durationClassName}>
          {'(' + formatMinutes(duration ?? 60) + ')'}
        </span>
      )}
    </div>
  )
}

export default DateTimeEvent
