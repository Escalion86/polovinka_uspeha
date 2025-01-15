import directionSelector from '@state/selectors/directionSelector'
import { useAtomValue } from 'jotai'

const DirectionTitleById = ({ directionId }) => {
  const direction = useAtomValue(directionSelector(directionId))
  return direction.title
}

export default DirectionTitleById
