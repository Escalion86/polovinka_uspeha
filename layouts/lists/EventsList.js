import React from 'react'

import EventCard from '@layouts/cards/EventCard'
import ListWrapper from './ListWrapper'
import { useRecoilValue } from 'recoil'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
import isLoggedUserModerSelector from '@state/selectors/isLoggedUserModerSelector'
import EventCardOld from '@layouts/cards/EventCardOld'

const EventsList = ({ events, onTagClick }) => {
  const widthNum = useRecoilValue(windowDimensionsNumSelector)
  const isLoggedUserModer = useRecoilValue(isLoggedUserModerSelector)
  const Card = isLoggedUserModer ? EventCard : EventCardOld

  return (
    <ListWrapper
      itemCount={events.length}
      itemSize={
        isLoggedUserModer
          ? widthNum > 3
            ? 166
            : widthNum === 3
            ? 174
            : 221
          : widthNum > 3
          ? 182
          : widthNum === 3
          ? 165
          : 196
      }
      className="bg-opacity-15 bg-general"
    >
      {({ index, style }) => (
        <Card
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
