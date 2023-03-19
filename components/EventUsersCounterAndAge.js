import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import eventMansReserveSelector from '@state/selectors/eventMansReserveSelector'
import eventMansSelector from '@state/selectors/eventMansSelector'
import eventSelector from '@state/selectors/eventSelector'
import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'
import eventWomansReserveSelector from '@state/selectors/eventWomansReserveSelector'
import eventWomansSelector from '@state/selectors/eventWomansSelector'
import cn from 'classnames'
import { useRecoilValue } from 'recoil'
import UserStatusIcon from './UserStatusIcon'
import Image from 'next/image'
import SvgSigma from 'svg/SvgSigma'

const Counter = ({
  showAges,
  minAge,
  maxAge,
  max,
  noviceCount,
  memberCount,
  maxNovice,
  maxMember,
  noviceReserveCount,
  memberReserveCount,
}) =>
  maxNovice || maxMember ? (
    <>
      <div className="flex flex-col items-center">
        {showAges && (
          <div className="flex justify-center gap-x-0.5 border-b self-stretch">
            <span>{minAge ?? 18}</span>
            <span>-</span>
            <span>{maxAge ?? 60}</span>
            <span>лет</span>
          </div>
        )}
        <div className="flex items-center gap-x-0.5">
          <div className="flex flex-col">
            <div className="flex gap-x-0.5 items-center">
              <UserStatusIcon size="xs" status="novice" />
              <div className="flex tablet:gap-x-0.5">
                <span
                  className={
                    maxNovice && noviceCount >= maxNovice
                      ? 'text-danger font-semibold'
                      : ''
                  }
                >
                  {noviceCount}
                </span>
                {typeof maxNovice === 'number' && (
                  <>
                    <span>/</span>
                    <span>{maxNovice}</span>
                  </>
                )}
                {noviceReserveCount > 0 && (
                  <span className="text-xs">{`+${noviceReserveCount}`}</span>
                )}
                {/* <span>чел.</span> */}
              </div>
            </div>
            <div className="flex gap-x-0.5 items-center">
              <UserStatusIcon size="xs" status="member" />
              <div className="flex tablet:gap-x-0.5">
                <span
                  className={
                    maxMember && memberCount >= maxMember
                      ? 'text-danger font-semibold'
                      : ''
                  }
                >
                  {memberCount}
                </span>
                {typeof maxMember === 'number' && (
                  <>
                    <span>/</span>
                    <span>{maxMember}</span>
                  </>
                )}
                {memberReserveCount > 0 && (
                  <span className="text-xs">{`+${memberReserveCount}`}</span>
                )}
                {/* <span>чел.</span> */}
              </div>
            </div>
          </div>
          {typeof max === 'number' ? (
            <div className="flex gap-x-0.5 items-center">
              {/* <span className="text-4xl">{'}'}</span> */}
              <div className="hidden min-w-[9px] h-[36px] tablet:block w-[9px]">
                <Image src="/img/other/bracet_left.png" width={9} height={36} />
              </div>
              <div className="min-w-[7px] h-[28px] tablet:hidden w-[8px]">
                <Image src="/img/other/bracet_left.png" width={7} height={28} />
              </div>
              <div className="flex flex-col items-center leading-[0.5rem] tablet:leading-3">
                <span className="text-xs">max</span>
                <span
                  className={
                    max && noviceCount + memberCount >= max
                      ? 'text-danger font-semibold'
                      : ''
                  }
                >
                  {max}
                </span>
                <span className="text-xs -mt-0.5">чел.</span>
              </div>

              {/* {noviceReserveCount + memberReserveCount > 0 && (
          <span className="text-xs">{`+${
            noviceReserveCount + memberReserveCount
          }`}</span>
        )} */}
            </div>
          ) : (
            <span>чел.</span>
          )}
        </div>
      </div>
    </>
  ) : (
    <div className="flex flex-col items-center">
      {showAges && (
        <div className="flex justify-center gap-x-0.5 border-b self-stretch">
          <span>{minAge ?? 18}</span>
          <span>-</span>
          <span>{maxAge ?? 60}</span>
          <span>лет</span>
        </div>
      )}
      <div className="flex gap-x-0.5">
        <span
          className={
            max && noviceCount + memberCount >= max
              ? 'text-danger font-semibold'
              : ''
          }
        >
          {noviceCount + memberCount}
        </span>
        {typeof max === 'number' && (
          <>
            <span>/</span>
            <span>{max}</span>
          </>
        )}
        {noviceReserveCount + memberReserveCount > 0 && (
          <span className="text-xs">{`+${
            noviceReserveCount + memberReserveCount
          }`}</span>
        )}
        <span>чел.</span>
      </div>
    </div>
  )

const EventUsersCounterAndAge = ({ eventId, className, showAges }) => {
  const event = useRecoilValue(eventSelector(eventId))
  // const eventUsers = useRecoilValue(eventsUsersFullByEventIdSelector(eventId))

  // const eventAssistantsIds = useRecoilValue(eventAssistantsSelector(eventId)).map((user) => user._id)
  const eventMans = useRecoilValue(eventMansSelector(eventId))
  const eventWomans = useRecoilValue(eventWomansSelector(eventId))
  const eventMansNoviceCount = eventMans.filter(
    (user) => !user.status || user.status === 'novice'
  ).length
  const eventWomansNoviceCount = eventWomans.filter(
    (user) => !user.status || user.status === 'novice'
  ).length
  const eventMansMemberCount = eventMans.filter(
    (user) => !user.status || user.status === 'member'
  ).length
  const eventWomansMemberCount = eventWomans.filter(
    (user) => !user.status || user.status === 'member'
  ).length
  const eventMansReserve = useRecoilValue(eventMansReserveSelector(eventId))
  const eventWomansReserve = useRecoilValue(eventWomansReserveSelector(eventId))
  const eventMansNoviceReserveCount = eventMansReserve.filter(
    (user) => !user.status || user.status === 'novice'
  ).length
  const eventMansMemberReserveCount = eventMansReserve.filter(
    (user) => !user.status || user.status === 'member'
  ).length
  const eventWomansNoviceReserveCount = eventWomansReserve.filter(
    (user) => !user.status || user.status === 'novice'
  ).length
  const eventWomansMemberReserveCount = eventWomansReserve.filter(
    (user) => !user.status || user.status === 'member'
  ).length

  // const eventReservedParticipantsIds = useRecoilValue(eventUsersInReserveSelector(eventId)).map((user) => user._id)
  // const eventBannedParticipantsIds = useRecoilValue(eventUsersInBanSelector(eventId)).map((user) => user._id)
  const eventMansCount = eventMans.length
  const eventWomansCount = eventWomans.length
  const eventMansReserveCount = eventMansReserve.length
  const eventWomansReserveCount = eventWomansReserve.length
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
      <div className="items-center hidden px-2 font-bold laptop:flex gap-x-1">
        Участники:
      </div>
      <div className="flex items-center px-1 tablet:px-2 tablet:border-r gap-x-1">
        <FontAwesomeIcon
          icon={faMars}
          className="w-5 h-5 text-blue-600 tablet:w-6 tablet:h-6"
        />
        <Counter
          showAges={showAges}
          minAge={event.minMansAge}
          maxAge={event.maxMansAge}
          max={event.maxMans}
          noviceCount={eventMansNoviceCount}
          memberCount={eventMansMemberCount}
          maxNovice={event.maxMansNovice}
          maxMember={event.maxMansMember}
          noviceReserveCount={eventMansNoviceReserveCount}
          memberReserveCount={eventMansMemberReserveCount}
        />
      </div>
      <div className="flex items-center px-1 tablet:px-2 tablet:border-r gap-x-1">
        <FontAwesomeIcon
          icon={faVenus}
          className="w-5 h-5 text-red-600 tablet:w-6 tablet:h-6"
        />
        <Counter
          showAges={showAges}
          minAge={event.minWomansAge}
          maxAge={event.maxWomansAge}
          max={event.maxWomans}
          noviceCount={eventWomansNoviceCount}
          memberCount={eventWomansMemberCount}
          maxNovice={event.maxWomansNovice}
          maxMember={event.maxWomansMember}
          noviceReserveCount={eventWomansNoviceReserveCount}
          memberReserveCount={eventWomansMemberReserveCount}
        />
        {/* <div className="flex flex-col items-center">
          {showAges && (
            <div className="flex gap-x-0.5 border-b">
              <span>{event.minWomansAge ?? 18}</span>
              <span>-</span>
              <span>{event.maxWomansAge ?? 60}</span>
              <span>лет</span>
            </div>
          )}
          <div className="flex gap-x-0.5">
            <span>{eventWomansCount}</span>
            {typeof event.maxWomans === 'number' && (
              <>
                <span>/</span>
                <span>{event.maxWomans}</span>
              </>
            )}
            {eventWomansReserveCount > 0 && (
              <span className="text-xs">{`+${eventWomansReserveCount}`}</span>
            )}
            <span>чел.</span>
          </div>
        </div> */}
      </div>
      <div className="flex items-center px-2 py-1 gap-x-0.5 tablet:gap-x-1">
        <div className="w-5 h-5 min-w-5">
          <SvgSigma className="fill-general" />
        </div>
        <div className="flex tablet:gap-x-0.5">
          {/* <span className="italic font-bold">Всего:</span> */}
          <span
            className={
              event.maxParticipants &&
              eventParticipantsCount >= event.maxParticipants
                ? 'text-danger font-semibold'
                : ''
            }
          >
            {eventParticipantsCount}
          </span>
          {typeof event.maxParticipants === 'number' && (
            <>
              <span>/</span>
              <span>{event.maxParticipants}</span>
            </>
          )}
        </div>
        <span>чел.</span>
      </div>
    </div>
  )
}

export default EventUsersCounterAndAge
