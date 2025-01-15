import additionalBlockSelector from '@state/selectors/additionalBlockSelector'
import { useAtomValue } from 'jotai'

const AdditionalBlockTitleById = ({ additionalBlockId }) => {
  const additionalBlock = useAtomValue(
    additionalBlockSelector(additionalBlockId)
  )
  return additionalBlock.title
}

export default AdditionalBlockTitleById
