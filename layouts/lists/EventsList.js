import React from 'react'

import EventCard from '@layouts/cards/EventCard'
import ListWrapper from './ListWrapper'
import { useRecoilValue } from 'recoil'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'

const EventsList = ({ events, onTagClick }) => {
  const widthNum = useRecoilValue(windowDimensionsNumSelector)

  return (
    <ListWrapper
      itemCount={events.length}
      itemSize={widthNum > 3 ? 166 : widthNum === 3 ? 174 : 221}
      className="bg-opacity-15 bg-general"
    >
      {({ index, style }) => (
        <EventCard
          style={style}
          key={events[index]._id}
          eventId={events[index]._id}
          onTagClick={onTagClick}
        />
      )}
    </ListWrapper>
  )
}

export default EventsList
