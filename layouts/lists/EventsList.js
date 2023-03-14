import React from 'react'

import EventCard from '@layouts/cards/EventCard'
import ListWrapper from './ListWrapper'
import { useRecoilValue } from 'recoil'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'

const EventsList = ({ events }) => {
  const widthNum = useRecoilValue(windowDimensionsNumSelector)
  return (
    <ListWrapper
      itemCount={events.length}
      itemSize={widthNum > 3 ? 182 : widthNum === 3 ? 165 : 196}
      className="bg-opacity-15 bg-general"
    >
      {({ index, style }) => (
        <EventCard
          style={style}
          key={events[index]._id}
          eventId={events[index]._id}
        />
      )}
    </ListWrapper>
  )
}

export default EventsList
