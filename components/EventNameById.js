import eventSelector from '@state/selectors/eventSelector'
import cn from 'classnames'
import { useRecoilValue } from 'recoil'

const EventNameById = ({ eventId, className }) => {
  const event = useRecoilValue(eventSelector(eventId))
  return <div className={cn('leading-4', className)}>{event.title}</div>
}

export default EventNameById
