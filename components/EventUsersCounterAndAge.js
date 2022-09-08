import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import eventMansSelector from '@state/selectors/eventMansSelector'
import eventSelector from '@state/selectors/eventSelector'
import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'
import eventWomansSelector from '@state/selectors/eventWomansSelector'
import cn from 'classnames'
import { useRecoilValue } from 'recoil'

const EventUsersCounterAndAge = ({ eventId, className }) => {
  const event = useRecoilValue(eventSelector(eventId))
  // const eventUsers = useRecoilValue(eventsUsersFullByEventIdSelector(eventId))

  // const eventAssistantsIds = useRecoilValue(eventAssistantsSelector(eventId)).map((user) => user._id)
  const eventMansCount = useRecoilValue(eventMansSelector(eventId)).length
  const eventWomansCount = useRecoilValue(eventWomansSelector(eventId)).length
  // const eventReservedParticipantsIds = useRecoilValue(eventUsersInReserveSelector(eventId)).map((user) => user._id)
  // const eventBannedParticipantsIds = useRecoilValue(eventUsersInBanSelector(eventId)).map((user) => user._id)

  // const eventMansCount = eventUsers.filter(
  //   (item) =>
  //     item.user &&
  //     item.user.gender == 'male' &&
  //     (!item.status || item.status === '' || item.status === 'participant')
  // ).length
  // const eventWomansCount = eventUsers.filter(
  //   (item) =>
  //     item.user &&
  //     item.user.gender == 'famale' &&
  //     (!item.status || item.status === '' || item.status === 'participant')
  // ).length

  if (!eventId || !event) return null

  const eventParticipantsCount = eventWomansCount + eventMansCount

  return (
    <div
      className={cn(
        'flex text-sm tablet:text-base leading-4 tablet:leading-5 justify-between tablet:justify-start border-gray-300',
        className
      )}
    >
      <div className="items-center hidden px-2 font-bold tablet:flex gap-x-1">
        Участники:
      </div>
      <div className="flex items-center px-2 tablet:border-r gap-x-0.5">
        <FontAwesomeIcon icon={faMars} className="w-6 h-6 text-blue-600" />
        <div className="flex flex-col items-center">
          <div className="flex gap-x-0.5 border-b">
            <span>{event.minMansAge ?? 18}</span>
            <span>-</span>
            <span>{event.maxMansAge ?? 60}</span>
            <span>лет</span>
          </div>
          <div className="flex gap-x-0.5">
            <span>{eventMansCount}</span>
            {typeof event.maxMans === 'number' && (
              <>
                <span>/</span>
                <span>{event.maxMans}</span>
              </>
            )}
            <span>чел.</span>
          </div>
        </div>
      </div>
      <div className="flex items-center px-2 tablet:border-r gap-x-0.5">
        <FontAwesomeIcon icon={faVenus} className="w-6 h-6 text-red-600" />
        <div className="flex flex-col items-center">
          <div className="flex gap-x-0.5 border-b">
            <span>{event.minWomansAge ?? 18}</span>
            <span>-</span>
            <span>{event.maxWomansAge ?? 60}</span>
            <span>лет</span>
          </div>
          <div className="flex gap-x-0.5">
            <span>{eventWomansCount}</span>
            {typeof event.maxWomans === 'number' && (
              <>
                <span>/</span>
                <span>{event.maxWomans}</span>
              </>
            )}
            <span>чел.</span>
          </div>
        </div>
      </div>
      <div className="flex items-center px-2 py-1 gap-x-1">
        <span className="italic font-bold">Всего:</span>
        <span>{eventParticipantsCount}</span>
        {typeof event.maxParticipants === 'number' && (
          <>
            <span>/</span>
            <span>{event.maxParticipants}</span>
          </>
        )}
      </div>
    </div>
  )
}

export default EventUsersCounterAndAge
