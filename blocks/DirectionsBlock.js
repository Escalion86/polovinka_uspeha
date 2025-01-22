import BlockContainer from '@components/BlockContainer'
import Button from '@components/Button'
import Masonry from '@components/Masonry'
import TextInRing from '@components/TextInRing'
import { getNounEvents } from '@helpers/getNoun'
import modalsFuncAtom from '@state/atoms/modalsFuncAtom'
import eventsAtom from '@state/atoms/eventsAtom'
import filteredDirectionsSelector from '@state/selectors/filteredDirectionsSelector'
import { useAtomValue } from 'jotai'

const DirectionItem = ({
  directionId,
  title,
  shortDescription,
  eventsCount,
}) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)

  return (
    <div className="flex-col w-full max-w-[430px] overflow-hidden bg-white rounded-lg shadow-xl gap-y-1">
      <TextInRing text={title} fullHeight={false} />
      {/* )} */}
      <div className="px-3 mt-3 mb-1 text-sm whitespace-pre-wrap laptop:text-base">
        {shortDescription}
      </div>
      <div className="flex items-center justify-between w-full text-sm">
        <div className="flex flex-wrap ml-3 italic leading-[14px] gap-x-1">
          <span>Проведено</span>
          <span className="whitespace-nowrap">
            {getNounEvents(eventsCount)}
          </span>
        </div>
        <Button
          name="Подробнее"
          rounded={false}
          className="rounded-tl-lg"
          onClick={() => modalsFunc.direction.view(directionId)}
        />
      </div>
    </div>
  )
}

const DirectionsBlock = () => {
  const filteredDirections = useAtomValue(filteredDirectionsSelector)
  const events = useAtomValue(eventsAtom)
  const finishedEvents = events.filter((event) => event.status === 'closed')

  if (!filteredDirections || filteredDirections.length === 0) return null
  return (
    <>
      <BlockContainer id="directions" title="Направления центра">
        <Masonry gap={16}>
          {filteredDirections.map((direction, index) => (
            <DirectionItem
              key={direction._id}
              directionId={direction._id}
              title={direction.title}
              shortDescription={direction.shortDescription}
              eventsCount={
                finishedEvents.filter(
                  (event) => event.directionId === direction._id
                ).length
              }
            />
          ))}
        </Masonry>
      </BlockContainer>
    </>
  )
}

export default DirectionsBlock
