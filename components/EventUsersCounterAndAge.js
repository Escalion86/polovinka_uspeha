import { faVenus } from '@fortawesome/free-solid-svg-icons/faVenus'
import { faMars } from '@fortawesome/free-solid-svg-icons/faMars'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import eventMansReserveSelector from '@state/selectors/eventMansReserveSelector'
// import eventMansSelector from '@state/selectors/eventMansSelector'
// import eventWomansReserveSelector from '@state/selectors/eventWomansReserveSelector'
// import eventWomansSelector from '@state/selectors/eventWomansSelector'
import cn from 'classnames'
import Image from 'next/image'
import { Suspense } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useAtomValue } from 'jotai'
import SvgSigma from '@svg/SvgSigma'
import UserStatusIcon from './UserStatusIcon'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'
import Ages from './Ages'
import subEventsSumOfEventSelector from '@state/selectors/subEventsSumOfEventSelector'
import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'
import eventSelector from '@state/selectors/eventSelector'

const CounterComponent = ({
  event,
  subEvent,
  gender,
  showAges,
  showNoviceAndMemberSum,
  showReserve,
  eventUsersToUse,
}) => {
  const subEventSum = subEvent
    ? subEvent
    : useAtomValue(subEventsSumOfEventSelector(event._id))

  const eventUsers =
    eventUsersToUse ?? useAtomValue(eventsUsersFullByEventIdSelector(event._id))

  const eventUsersParticipants = eventUsers.filter(
    ({ status }) => status === 'participant'
  )
  const eventUsersReserve = eventUsers.filter(
    ({ status }) => status === 'reserve'
  )

  const eventGenders =
    gender === 'mans'
      ? eventUsersParticipants.filter(
          ({ user, subEventId }) =>
            user.gender === 'male' && (!subEvent || subEventId === subEvent.id)
        )
      : eventUsersParticipants.filter(
          ({ user, subEventId }) =>
            user.gender === 'famale' &&
            (!subEvent || subEventId === subEvent.id)
        )

  const eventGendersNoviceCount = eventGenders.filter(
    ({ userStatus }) => !userStatus || userStatus === 'novice'
  ).length
  const eventGendersMemberCount = eventGenders.filter(
    ({ userStatus }) => userStatus === 'member'
  ).length

  const eventGendersReserve =
    gender === 'mans'
      ? eventUsersReserve.filter(
          ({ user, subEventId }) =>
            user.gender === 'male' && (!subEvent || subEventId === subEvent.id)
        )
      : eventUsersReserve.filter(
          ({ user, subEventId }) =>
            user.gender === 'famale' &&
            (!subEvent || subEventId === subEvent.id)
        )

  const eventGendersNoviceReserveCount = eventGendersReserve.filter(
    ({ userStatus }) => !userStatus || userStatus === 'novice'
  ).length
  const eventGendersMemberReserveCount = eventGendersReserve.filter(
    ({ userStatus }) => userStatus === 'member'
  ).length

  const max = gender === 'mans' ? subEventSum.maxMans : subEventSum.maxWomans
  const maxNovice =
    gender === 'mans' ? subEventSum.maxMansNovice : subEventSum.maxWomansNovice
  const maxMember =
    gender === 'mans' ? subEventSum.maxMansMember : subEventSum.maxWomansMember

  const actualMax =
    typeof maxNovice === 'number' && typeof maxMember === 'number'
      ? typeof max === 'number'
        ? Math.min(maxNovice + maxMember, max)
        : maxNovice + maxMember
      : typeof max === 'number'
        ? max
        : undefined

  return maxNovice || maxMember ? (
    <div className="flex flex-col items-center">
      {showAges && (
        <Ages
          minAge={
            gender === 'mans'
              ? subEventSum.minMansAge
              : subEventSum.minWomansAge
          }
          maxAge={
            gender === 'mans'
              ? subEventSum.maxMansAge
              : subEventSum.maxWomansAge
          }
        />
      )}
      <div className="flex items-center gap-x-0.5">
        <div className="flex flex-col">
          {showNoviceAndMemberSum ? (
            <div className="flex gap-x-0.5 items-center">
              <div className="flex tablet:gap-x-0.5">
                <span>{eventGendersNoviceCount + eventGendersMemberCount}</span>
                {typeof actualMax === 'number' && (
                  <>
                    <span>/</span>
                    <span
                      className={cn(
                        eventGendersNoviceCount + eventGendersMemberCount >=
                          actualMax
                          ? 'text-danger font-semibold'
                          : ''
                      )}
                    >
                      {actualMax}
                    </span>
                  </>
                )}
                {showReserve &&
                  eventGendersNoviceReserveCount +
                    eventGendersMemberReserveCount >
                    0 && (
                    <span className="text-xs">{`+${
                      eventGendersNoviceReserveCount +
                      eventGendersMemberReserveCount
                    }`}</span>
                  )}
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-x-0.5 items-center">
                <UserStatusIcon size="xs" status="novice" />
                <div className="flex tablet:gap-x-0.5">
                  <span>{eventGendersNoviceCount}</span>
                  {typeof maxNovice === 'number' && (
                    <>
                      <span>/</span>
                      <span
                        className={
                          maxNovice && eventGendersNoviceCount >= maxNovice
                            ? 'text-danger font-semibold'
                            : ''
                        }
                      >
                        {maxNovice}
                      </span>
                    </>
                  )}
                  {showReserve && eventGendersNoviceReserveCount > 0 && (
                    <span className="text-xs">{`+${eventGendersNoviceReserveCount}`}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-x-0.5 items-center">
                <UserStatusIcon size="xs" status="member" />
                <div className="flex tablet:gap-x-0.5">
                  <span>{eventGendersMemberCount}</span>
                  {typeof maxMember === 'number' && (
                    <>
                      <span>/</span>
                      <span
                        className={
                          maxMember && eventGendersMemberCount >= maxMember
                            ? 'text-danger font-semibold'
                            : ''
                        }
                      >
                        {maxMember}
                      </span>
                    </>
                  )}
                  {showReserve && eventGendersMemberReserveCount > 0 && (
                    <span className="text-xs">{`+${eventGendersMemberReserveCount}`}</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        {!showNoviceAndMemberSum && typeof actualMax === 'number' ? (
          <div className="flex gap-x-0.5 items-center">
            {/* <span className="text-4xl">{'}'}</span> */}
            <div className="hidden min-w-[9px] h-[36px] tablet:block w-[9px]">
              <Image
                alt="bracet_left"
                src="/img/other/bracet_left.png"
                width={9}
                height={36}
              />
            </div>
            <div className="min-w-[7px] h-[28px] tablet:hidden w-[8px]">
              <Image
                alt="bracet_left"
                src="/img/other/bracet_left.png"
                width={7}
                height={28}
              />
            </div>
            <div className="flex flex-col items-center leading-[0.5rem] tablet:leading-3">
              <span className="text-xs">max</span>
              <span
                className={
                  eventGendersNoviceCount + eventGendersMemberCount >= actualMax
                    ? 'text-danger font-semibold'
                    : ''
                }
              >
                {actualMax}
              </span>
              <span className="text-xs -mt-0.5">чел.</span>
            </div>
          </div>
        ) : (
          <span className="hidden laptop:block">чел.</span>
        )}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center">
      {showAges && (
        <Ages
          minAge={
            gender === 'mans'
              ? subEventSum.minMansAge
              : subEventSum.minWomansAge
          }
          maxAge={
            gender === 'mans'
              ? subEventSum.maxMansAge
              : subEventSum.maxWomansAge
          }
        />
      )}
      <div className="flex gap-x-0.5">
        <span>{eventGendersNoviceCount + eventGendersMemberCount}</span>
        {typeof actualMax === 'number' && (
          <>
            <span>/</span>
            <span
              className={
                typeof actualMax === 'number' &&
                eventGendersNoviceCount + eventGendersMemberCount >= actualMax
                  ? 'text-danger font-semibold'
                  : ''
              }
            >
              {actualMax}
            </span>
          </>
        )}
        {showReserve &&
          eventGendersNoviceReserveCount + eventGendersMemberReserveCount >
            0 && (
            <span className="text-xs">{`+${
              eventGendersNoviceReserveCount + eventGendersMemberReserveCount
            }`}</span>
          )}
        <span className="hidden laptop:block">чел.</span>
      </div>
    </div>
  )
}

const Counter = (props) => (
  <Suspense
    fallback={
      <Skeleton className="w-[40px] laptop:w-[65px] h-[16px] laptop:h-[20px]" />
    }
  >
    <CounterComponent {...props} />
  </Suspense>
)

const SumCounterComponent = ({
  event,
  subEvent,
  showReserve,
  eventUsersToUse,
}) => {
  const subEventSum = subEvent
    ? subEvent
    : useAtomValue(subEventsSumOfEventSelector(event._id))

  const eventUsers =
    eventUsersToUse ?? useAtomValue(eventsUsersFullByEventIdSelector(event._id))

  const subEventUsers = subEvent
    ? eventUsers.filter(({ user, subEventId }) => subEventId === subEvent.id)
    : eventUsers

  const mans = subEventUsers.filter(({ user }) => user.gender === 'male')
  const womans = subEventUsers.filter(({ user }) => user.gender === 'famale')

  const eventMansCount = mans.filter(
    ({ status }) => status === 'participant'
  ).length
  const eventWomansCount = womans.filter(
    ({ status }) => status === 'participant'
  ).length
  const eventMansReserveCount = mans.filter(
    ({ status }) => status === 'reserve'
  ).length
  const eventWomansReserveCount = womans.filter(
    ({ status }) => status === 'reserve'
  ).length

  const eventParticipantsCount = eventMansCount + eventWomansCount
  const eventReserveCount = eventMansReserveCount + eventWomansReserveCount

  return (
    <>
      <div className="flex laptop:gap-x-0.5">
        <span>{eventParticipantsCount}</span>
        {typeof subEventSum.maxParticipants === 'number' && (
          <>
            <span>/</span>
            <span
              className={
                subEventSum.maxParticipants &&
                eventParticipantsCount >= subEventSum.maxParticipants
                  ? 'text-danger font-semibold'
                  : ''
              }
            >
              {subEventSum.maxParticipants}
            </span>
          </>
        )}
        {showReserve && eventReserveCount > 0 && (
          <span className="text-xs">{`+${eventReserveCount}`}</span>
        )}
      </div>
      <span className="hidden laptop:block">чел.</span>
    </>
  )
}

const SumCounter = (props) => (
  <Suspense
    fallback={
      <Skeleton className="w-[40px] laptop:w-[65px] h-[16px] laptop:h-[20px]" />
    }
  >
    <SumCounterComponent {...props} />
  </Suspense>
)

const EventUsersCounterAndAgeByEventId = ({
  eventId,
  className,
  showAges,
  dontShowLabel,
}) => {
  const event = useAtomValue(eventSelector(eventId))
  if (!eventId || !event) return null
  return (
    <EventUsersCounterAndAge
      event={event}
      className={className}
      showAges={showAges}
      dontShowLabel={dontShowLabel}
    />
  )
}

const EventUsersCounterAndAge = ({
  event,
  subEvent,
  className,
  showAges,
  dontShowLabel,
  showNoviceAndMemberSum,
  eventUsersToUse,
}) => {
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const isLoggedUserMember = useAtomValue(isLoggedUserMemberSelector)
  const showReserve =
    loggedUserActiveRole?.events?.seeReserveOnCard || isLoggedUserMember

  if (!event) return null

  const eventUsersCounterAndAgeFull =
    loggedUserActiveRole?.events?.eventUsersCounterAndAgeFull

  return (
    <div
      className={cn(
        'flex text-sm laptop:text-base leading-4 laptop:leading-5 justify-between laptop:justify-start border-gray-300',
        className
      )}
    >
      {!dontShowLabel && (
        <div className="items-center hidden pl-2 font-bold laptop:flex gap-x-1">
          Участники:
        </div>
      )}
      <div className="flex items-center px-1 laptop:px-2 laptop:border-r gap-x-1">
        <FontAwesomeIcon
          icon={faMars}
          className="w-5 h-5 text-blue-600 laptop:w-6 laptop:h-6"
        />
        <Counter
          gender="mans"
          event={event}
          subEvent={subEvent}
          showAges={showAges}
          showNoviceAndMemberSum={
            showNoviceAndMemberSum || !eventUsersCounterAndAgeFull
          }
          showReserve={showReserve}
          eventUsersToUse={eventUsersToUse}
        />
      </div>
      <div className="flex items-center px-1 laptop:px-2 laptop:border-r gap-x-1">
        <FontAwesomeIcon
          icon={faVenus}
          className="w-5 h-5 text-red-600 laptop:w-6 laptop:h-6"
        />
        <Counter
          gender="womans"
          event={event}
          subEvent={subEvent}
          showAges={showAges}
          showNoviceAndMemberSum={
            showNoviceAndMemberSum || !eventUsersCounterAndAgeFull
          }
          showReserve={showReserve}
          eventUsersToUse={eventUsersToUse}
        />
      </div>
      <div className="flex items-center px-2 py-1 gap-x-1 laptop:gap-x-1">
        <div className="w-5 h-5 min-w-5">
          <SvgSigma className="fill-general" />
        </div>
        <SumCounter
          event={event}
          subEvent={subEvent}
          showReserve={showReserve}
          eventUsersToUse={eventUsersToUse}
        />
      </div>
    </div>
  )
}

export default EventUsersCounterAndAge
