import React from 'react'

import { useWindowDimensionsTailwindNum } from '@helpers/useWindowDimensions'
import EventCard from '@layouts/cards/EventCard'
import ListWrapper from './ListWrapper'

const EventsList = ({ events }) => {
  const windowWidthNum = useWindowDimensionsTailwindNum()
  return (
    <ListWrapper
      itemCount={events.length}
      itemSize={windowWidthNum > 3 ? 182 : windowWidthNum === 3 ? 169 : 198}
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
