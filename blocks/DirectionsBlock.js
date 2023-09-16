import BlockContainer from '@components/BlockContainer'
import { H2 } from '@components/tags'
import filteredDirectionsSelector from '@state/selectors/filteredDirectionsSelector'
import { useRecoilValue } from 'recoil'
import DirectionBlock from './DirectionBlock'
import sanitize from '@helpers/sanitize'
import Masonry from '@components/Masonry'
import TextInRing from '@components/TextInRing'

const DirectionItem = ({ title, shortDescription, image }) => {
  return (
    <div className="flex-col overflow-hidden bg-white rounded-lg shadow-xl gap-y-1">
      {image ? (
        <>
          <img
            className="object-contain w-full laptop:object-cover min-w-32 laptop:w-72"
            src={image}
            alt="direction"
            // width={48}
            // height={48}
          />
          <div className="px-3 py-2 text-base font-bold leading-3 text-center border-b border-gray-400 text-general laptop:text-lg laptop:leading-4">
            {title}
          </div>
        </>
      ) : (
        <TextInRing text={title} fullHeight={false} />
      )}

      {/* <div
        className="w-full max-w-full overflow-hidden textarea"
        dangerouslySetInnerHTML={{ __html: sanitize(description) }}
      /> */}
      <div className="px-3 py-3 text-sm whitespace-pre-wrap laptop:text-base">
        {shortDescription}
      </div>
    </div>
  )
}

const DirectionsBlock = ({ startInverse = false }) => {
  const filteredDirections = useRecoilValue(filteredDirectionsSelector)

  if (!filteredDirections || filteredDirections.length === 0) return null
  return (
    <>
      <BlockContainer
        id="directions"
        title="Направления центра"
        // className="pb-0 "
        // childrenWrapperClassName="grid grid-cols-1 gap-x-2 gap-y-2 tablet:grid-cols-2 laptop:grid-cols-3"
        altBg
      >
        {/* <H2 className="sticky pt-20 top-6">{'Направления центра'}</H2> */}
        <Masonry gap={16}>
          {filteredDirections.map((direction, index) => (
            // <DirectionBlock
            //   key={direction._id}
            //   image={direction.image}
            //   title={direction.title}
            //   description={direction.description}
            //   inverse={index % 2 === (startInverse ? 1 : 0)}
            // />
            <DirectionItem
              key={direction._id}
              image={direction.image}
              title={direction.title}
              description={direction.description}
              shortDescription={direction.shortDescription}
              inverse={index % 2 === (startInverse ? 1 : 0)}
            />
          ))}
        </Masonry>
      </BlockContainer>
    </>
  )
}

export default DirectionsBlock
