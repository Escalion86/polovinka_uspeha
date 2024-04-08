import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EVENT_STATUSES_WITH_TIME } from '@helpers/constants'
import eventStatusFunc from '@helpers/eventStatus'
// import eventFullAtomAsync from '@state/async/eventFullAtomAsync'
import cn from 'classnames'
import { useRecoilValue } from 'recoil'
import TextLinesLimiter from './TextLinesLimiter'
import eventSelector from '@state/selectors/eventSelector'

const EventNameById = ({ eventId, showStatus, className }) => {
  if (!eventId) return null
  const event = useRecoilValue(eventSelector(eventId))

  const eventStatus = eventStatusFunc(event)

  const eventStatusProps = EVENT_STATUSES_WITH_TIME.find(
    (payTypeItem) => payTypeItem.value === eventStatus
  )

  return (
    <div className={cn('leading-[14px] flex gap-x-1 items-center', className)}>
      {showStatus && (
        <div
          className={cn(
            'flex items-center justify-center w-4',
            eventStatusProps
              ? 'text-' + eventStatusProps.color
              : 'text-disabled'
          )}
        >
          <FontAwesomeIcon
            icon={eventStatusProps?.icon ?? faQuestion}
            className="w-4 h-4"
          />
        </div>
      )}
      <TextLinesLimiter lines={1}>{event.title}</TextLinesLimiter>
    </div>
  )
}

export default EventNameById
