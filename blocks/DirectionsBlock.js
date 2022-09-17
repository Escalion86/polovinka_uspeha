import BlockContainer from '@components/BlockContainer'
import { H2 } from '@components/tags'
import filteredDirectionsSelector from '@state/selectors/filteredDirectionsSelector'
import { useRecoilValue } from 'recoil'
import DirectionBlock from './DirectionBlock'

const DirectionsBlock = ({ startInverse = false }) => {
  const filteredDirections = useRecoilValue(filteredDirectionsSelector)

  if (!filteredDirections || filteredDirections.length === 0) return null
  return (
    <>
      <BlockContainer
        id="directions"
        title="Направления центра"
        className="pb-0"
      />
      {/* <H2 className="sticky pt-20 top-6">{'Направления центра'}</H2> */}
      {filteredDirections.map((direction, index) => (
        <DirectionBlock
          key={direction._id}
          image={direction.image}
          title={direction.title}
          description={direction.description}
          inverse={index % 2 === (startInverse ? 1 : 0)}
        />
      ))}
    </>
  )
}

export default DirectionsBlock
