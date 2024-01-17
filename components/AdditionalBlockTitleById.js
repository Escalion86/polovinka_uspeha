import additionalBlockSelector from '@state/selectors/additionalBlockSelector'
import { useRecoilValue } from 'recoil'

const AdditionalBlockTitleById = ({ additionalBlockId }) => {
  const additionalBlock = useRecoilValue(
    additionalBlockSelector(additionalBlockId)
  )
  return additionalBlock.title
}

export default AdditionalBlockTitleById
