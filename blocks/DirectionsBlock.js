import BlockContainer from '@components/BlockContainer'
import filteredDirectionsSelector from '@state/selectors/filteredDirectionsSelector'
import { useRecoilValue } from 'recoil'
import DirectionBlock from './DirectionBlock'

const DirectionsBlock = ({ startInverse = false }) => {
  const filteredDirections = useRecoilValue(filteredDirectionsSelector)

  if (!filteredDirections || filteredDirections.length === 0) return null
  return (
    <>
      <BlockContainer id="directions" />
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
