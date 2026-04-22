'use client'

import useEventCardState from '@components/useEventCardState'
import PropTypes from 'prop-types'
import cn from 'classnames'

const defaultClassName =
  'inline-flex items-center rounded-full bg-[#4fb0e8]/15 px-3 py-1 text-sm font-semibold text-[#1f6e9c]'

const EventFreePlacesBadge = ({
  eventId,
  event,
  className = defaultClassName,
}) => {
  const targetEventId = event?._id || eventId
  const eventCardState = useEventCardState(targetEventId)

  if (!eventCardState) return null

  const {
    hasGenderLimits,
    maxParticipants,
    maxMans,
    maxWomans,
    freePlaces,
    freeMalePlaces,
    freeFemalePlaces,
    participantsCount,
    participantsMaleCount,
    participantsFemaleCount,
  } = eventCardState

  const hasWomansLimit = typeof maxWomans === 'number'
  const hasMansLimit = typeof maxMans === 'number'
  const womansPlacesText =
    hasWomansLimit && maxWomans === 0
      ? 'нет'
      : hasWomansLimit
        ? `${freeFemalePlaces} из ${maxWomans}`
        : `неогр. (записей ${participantsFemaleCount})`
  const mansPlacesText =
    hasMansLimit && maxMans === 0
      ? 'нет'
      : hasMansLimit
        ? `${freeMalePlaces} из ${maxMans}`
        : `неогр. (записей ${participantsMaleCount})`

  const text = hasGenderLimits ? (
    <>
      <span className="hidden whitespace-nowrap tablet:inline">{'Свободно мест:'}</span>
      <span className="whitespace-nowrap tablet:hidden">{'Свободно:'}</span>
      <span className="whitespace-nowrap">
        <span className="text-base font-bold text-[#6b1f2a]">{'Ж'}</span>
        {` ${womansPlacesText}`}
        {' · '}
        <span className="text-base font-bold text-[#6b1f2a]">{'М'}</span>
        {` ${mansPlacesText}`}
      </span>
    </>
  ) : typeof maxParticipants === 'number' ? (
    <>
      <span className="hidden whitespace-nowrap tablet:inline">{'Свободно мест:'}</span>
      <span className="whitespace-nowrap tablet:hidden">{'Свободно:'}</span>
      <span className="whitespace-nowrap">{`${freePlaces} из ${maxParticipants}`}</span>
    </>
  ) : (
    <span className="whitespace-nowrap">{`Мест неограничено · Записано ${participantsCount}`}</span>
  )

  return (
    <div
      className={cn(
        'flex gap-x-1 justify-center h-7 min-h-7 max-h-7',
        className
      )}
    >
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
