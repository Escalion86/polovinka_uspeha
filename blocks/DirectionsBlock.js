import BlockContainer from '@components/BlockContainer'
import DirectionBlock from './DirectionBlock'

const DirectionsBlock = ({ directions, startInverse = false }) => {
  if (!directions || directions.length === 0) return null
  return (
    <>
      <BlockContainer id="directions" />
      {directions.map((direction, index) => (
        <DirectionBlock
          key={'direction' + index}
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
