// import EventCard from '@layouts/cards/EventCard'
import dynamic from 'next/dynamic'
const EventCard = dynamic(() => import('@layouts/cards/EventCard'))
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
import { useRecoilValue } from 'recoil'
import ListWrapper from './ListWrapper'

const EventsList = ({ events, onTagClick }) => {
  const widthNum = useRecoilValue(windowDimensionsNumSelector)

  return (
    <ListWrapper
      itemCount={events.length}
      itemSize={widthNum > 3 ? 165 : widthNum === 3 ? 176 : 224}
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
