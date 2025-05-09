import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EVENT_STATUSES_WITH_TIME } from '@helpers/constants'
import eventStatusFunc from '@helpers/eventStatus'
import cn from 'classnames'
import { useAtomValue } from 'jotai'
import TextLinesLimiter from './TextLinesLimiter'
import eventSelector from '@state/selectors/eventSelector'

export const EventNameById = ({ eventId, showStatus, className }) => {
  if (!eventId) return null
  const event = useAtomValue(eventSelector(eventId))
  return (
    <EventName event={event} showStatus={showStatus} className={className} />
  )
}

const EventName = ({ event, showStatus, className }) => {
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
      <TextLinesLimiter lines={1}>{event?.title}</TextLinesLimiter>
    </div>
  )
}

export default EventName
