import BlockContainer from '@components/BlockContainer'
import DirectionBlock from './DirectionBlock'

const DirectionsBlock = ({ directions }) => {
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
          inverse={index % 2 === 1}
        />
      ))}
    </>
  )
}

export default DirectionsBlock
