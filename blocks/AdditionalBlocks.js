import BlockContainer from '@components/BlockContainer'
import transliterate from '@helpers/transliterate'
import DirectionBlock from './DirectionBlock'

const AdditionalBlocks = ({ additionalBlocks, inverse }) => {
  if (!additionalBlocks) return null
  return [...additionalBlocks]
    .sort((a, b) => (a.index < b.index ? -1 : 1))
    .map((additionalBlock, index) => (
      <DirectionBlock
        key={'additionalBlock' + index}
        image={additionalBlock.image}
        title={additionalBlock.title}
        description={additionalBlock.description}
        inverse={inverse ? index % 2 === 0 : index % 2 === 1}
        id={transliterate(additionalBlock.menuName)}
      />
    ))
}

export default AdditionalBlocks
