import directionSelector from '@state/selectors/directionSelector'
import { useRecoilValue } from 'recoil'

const DirectionTitleById = ({ directionId }) => {
  const direction = useRecoilValue(directionSelector(directionId))
  return direction.title
}

export default DirectionTitleById
