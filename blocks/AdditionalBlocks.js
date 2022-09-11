import transliterate from '@helpers/transliterate'
import filteredAdditionalBlocksSelector from '@state/selectors/filteredAdditionalBlocksSelector'
import { useRecoilValue } from 'recoil'
import DirectionBlock from './DirectionBlock'

const AdditionalBlocks = ({ startInverse }) => {
  const filteredAdditionalBlocks = useRecoilValue(
    filteredAdditionalBlocksSelector
  )
  if (!filteredAdditionalBlocks) return null
  return [...filteredAdditionalBlocks]
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
