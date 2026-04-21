// import EventCard from '@layouts/cards/EventCard'
import dynamic from 'next/dynamic'
const EventCard = dynamic(() => import('@layouts/cards/EventCard2'))
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'
import { useAtomValue } from 'jotai'
import { useCallback } from 'react'
import ListWrapper from './ListWrapper'

const EventsList = ({ events, persistScrollKey }) => {
  const widthNum = useAtomValue(windowDimensionsNumSelector)
  const renderRow = useCallback(
    ({ index, style, data }) => (
      <EventCard style={style} eventId={data[index]._id} />
    ),
    []
  )
  const getItemKey = useCallback(
    (index, data) => data[index]?._id ?? index,
    []
  )

  return (
    <ListWrapper
      itemCount={events.length}
      itemData={events}
      itemSize={
        widthNum > 3 ? 270 : widthNum === 3 ? 310 : widthNum === 2 ? 310 : 290
      }
      itemKey={getItemKey}
      wrapperClassName="bg-general/15"
      persistScrollKey={persistScrollKey}
    >
      {renderRow}
    </ListWrapper>
  )
}

export default EventsList
