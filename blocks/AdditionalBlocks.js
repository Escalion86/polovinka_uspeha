import BlockContainer from '@components/BlockContainer'
import transliterate from '@helpers/transliterate'
import DirectionBlock from './DirectionBlock'

const AdditionalBlocks = ({ additionalBlocks, inverse }) => {
  if (!additionalBlocks) return null
  return additionalBlocks.map((additionalBlock, index) => (
    <DirectionBlock
      image={additionalBlock.image}
      title={additionalBlock.title}
      description={additionalBlock.description}
      inverse={inverse ? index % 2 === 0 : index % 2 === 1}
      id={transliterate(additionalBlock.menuName)}
    />
  ))
}

export default AdditionalBlocks
