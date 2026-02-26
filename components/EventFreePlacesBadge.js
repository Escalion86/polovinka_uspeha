'use client'

import subEventsSummator from '@helpers/subEventsSummator'
import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'
import eventSelector from '@state/selectors/eventSelector'
import { useAtomValue } from 'jotai'
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import cn from 'classnames'

const defaultClassName =
  'inline-flex items-center rounded-full bg-[#4fb0e8]/15 px-3 py-1 text-sm font-semibold text-[#1f6e9c]'

const EventFreePlacesBadge = ({
  eventId,
  event,
  className = defaultClassName,
}) => {
  const eventFromState = useAtomValue(eventSelector(eventId))
  const eventToUse = event || eventFromState
  const targetEventId = eventToUse?._id || eventId
  const eventUsers = useAtomValue(
    eventsUsersFullByEventIdSelector(targetEventId)
  )

  const participants = useMemo(
    () => (eventUsers || []).filter((item) => item?.status === 'participant'),
    [eventUsers]
  )

  const participantsMansCount = useMemo(
    () => participants.filter((item) => item?.user?.gender === 'male').length,
    [participants]
  )
  const participantsWomansCount = useMemo(
    () => participants.filter((item) => item?.user?.gender === 'famale').length,
    [participants]
  )

  const limits = useMemo(() => {
    if (!eventToUse)
      return { maxParticipants: null, maxMans: null, maxWomans: null }

    const hasSubEvents =
      Array.isArray(eventToUse?.subEvents) && eventToUse.subEvents.length > 0
    if (hasSubEvents) {
      const summary = subEventsSummator(eventToUse.subEvents)
      return {
        maxParticipants:
          typeof summary?.maxParticipants === 'number'
            ? summary.maxParticipants
            : null,
        maxMans: typeof summary?.maxMans === 'number' ? summary.maxMans : null,
        maxWomans:
          typeof summary?.maxWomans === 'number' ? summary.maxWomans : null,
      }
    }

    return {
      maxParticipants:
        typeof eventToUse?.maxParticipants === 'number'
          ? eventToUse.maxParticipants
          : null,
      maxMans:
        typeof eventToUse?.maxMans === 'number' ? eventToUse.maxMans : null,
      maxWomans:
        typeof eventToUse?.maxWomans === 'number' ? eventToUse.maxWomans : null,
    }
  }, [eventToUse])

  if (!eventToUse) return null

  const hasGenderLimits =
    typeof limits.maxMans === 'number' || typeof limits.maxWomans === 'number'

  const getFree = (max, count) =>
    typeof max === 'number' ? Math.max(0, (max ?? 0) - (count ?? 0)) : null

  const hasWomansLimit = typeof limits.maxWomans === 'number'
  const hasMansLimit = typeof limits.maxMans === 'number'
  const freeWomansPlaces = getFree(limits.maxWomans, participantsWomansCount)
  const freeMansPlaces = getFree(limits.maxMans, participantsMansCount)

  const text = hasGenderLimits ? (
    hasWomansLimit &&
    hasMansLimit &&
    freeWomansPlaces === 0 &&
    freeMansPlaces === 0 ? (
      <span>{'Свободных мест нет'}</span>
    ) : (
      <>
        <span>{`Свободных мест`}</span>
        <span>
          {[
            hasWomansLimit
              ? freeWomansPlaces === 0
                ? 'для женщин нет'
                : `для женщин ${freeWomansPlaces} из ${limits.maxWomans}`
              : null,
            hasMansLimit
              ? freeMansPlaces === 0
                ? 'для мужчин нет'
                : `для мужчин ${freeMansPlaces} из ${limits.maxMans}`
              : null,
          ]
            .filter(Boolean)
            .join(' | ')}
        </span>
      </>
    )
  ) : typeof limits.maxParticipants === 'number' ? (
    Math.max(0, (limits.maxParticipants ?? 0) - participants.length) === 0 ? (
      <span>{'Свободных мест нет'}</span>
    ) : (
      <>
        <span>{`Свободных мест `}</span>
        <span>{`${Math.max(
          0,
          (limits.maxParticipants ?? 0) - participants.length
        )} из ${limits.maxParticipants}`}</span>
      </>
    )
  ) : (
    <span>{'Количество мест не ограничено'}</span>
  )

  return (
    <div className={cn('flex gap-x-1 flex-wrap justify-center', className)}>
      {text}
    </div>
  )
}

EventFreePlacesBadge.propTypes = {
  eventId: PropTypes.string,
  event: PropTypes.object,
  className: PropTypes.string,
}

export default EventFreePlacesBadge
