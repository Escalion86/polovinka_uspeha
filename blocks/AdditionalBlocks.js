import transliterate from '@helpers/transliterate'
import DirectionBlock from './DirectionBlock'

const AdditionalBlocks = ({ additionalBlocks, startInverse }) => {
  if (!additionalBlocks) return null
  return [...additionalBlocks]
    .sort((a, b) => (a.index < b.index ? -1 : 1))
    .map((additionalBlock, index) => (
      <DirectionBlock
        key={additionalBlock._id}
        image={additionalBlock.image}
        title={additionalBlock.title}
        description={additionalBlock.description}
        inverse={startInverse ? index % 2 === 0 : index % 2 === 1}
        id={transliterate(additionalBlock.menuName)}
      />
    ))
}

export default AdditionalBlocks
