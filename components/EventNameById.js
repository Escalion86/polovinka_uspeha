import eventSelector from '@state/selectors/eventSelector'
import cn from 'classnames'
import { useRecoilValue } from 'recoil'
import eventStatusFunc from '@helpers/eventStatus'
import { EVENT_STATUSES_WITH_TIME } from '@helpers/constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import TextLinesLimiter from './TextLinesLimiter'

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
              : 'text-gray-400'
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
