// import EventCard from '@layouts/cards/EventCard'
import dynamic from 'next/dynamic'
const EventCard = dynamic(() => import('@layouts/cards/EventCard2'))
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
import { useAtomValue } from 'jotai'
import ListWrapper from './ListWrapper'

const EventsList = ({ events, onTagClick }) => {
  const widthNum = useAtomValue(windowDimensionsNumSelector)

  return (
    <ListWrapper
      itemCount={events.length}
      itemSize={
        widthNum > 3 ? 270 : widthNum === 3 ? 270 : widthNum === 2 ? 310 : 310
      }
      itemKey={(index) => events[index]?._id ?? index}
      className="bg-general/15"
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
