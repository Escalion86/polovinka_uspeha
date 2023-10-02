import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import eventMansReserveSelector from '@state/selectors/eventMansReserveSelector'
import eventMansSelector from '@state/selectors/eventMansSelector'
import eventSelector from '@state/selectors/eventSelector'
import eventWomansReserveSelector from '@state/selectors/eventWomansReserveSelector'
import eventWomansSelector from '@state/selectors/eventWomansSelector'
import isLoggedUserModerSelector from '@state/selectors/isLoggedUserModerSelector'
import cn from 'classnames'
import Image from 'next/image'
import { Suspense } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useRecoilValue } from 'recoil'
import SvgSigma from 'svg/SvgSigma'
import UserStatusIcon from './UserStatusIcon'

const Ages = ({ gender, event }) => (
  <div className="flex justify-center gap-x-0.5 border-b self-stretch">
    <span>
      {(gender === 'mans' ? event.minMansAge : event.minWomansAge) ?? 18}
    </span>
    <span>-</span>
    <span>
      {(gender === 'mans' ? event.maxMansAge : event.maxWomansAge) ?? 60}
    </span>
    <span>лет</span>
  </div>
)

const CounterComponent = ({
  event,
  gender,
  showAges,
  // minAge,
  // maxAge,
  // max,
  // noviceCount,
  // memberCount,
  // maxNovice,
  // maxMember,
  // noviceReserveCount,
  // memberReserveCount,
  showNoviceAndMemberSum,
  showReserve,
}) => {
  const eventGenders = useRecoilValue(
    gender === 'mans'
      ? eventMansSelector(event._id)
      : eventWomansSelector(event._id)
  )
  const eventGendersNoviceCount = eventGenders.filter(
    (user) => !user.status || user.status === 'novice'
  ).length
  const eventGendersMemberCount = eventGenders.filter(
    (user) => user.status === 'member'
  ).length

  const eventGendersReserve = useRecoilValue(
    gender === 'mans'
      ? eventMansReserveSelector(event._id)
      : eventWomansReserveSelector(event._id)
  )

  const eventGendersNoviceReserveCount = eventGendersReserve.filter(
    (user) => !user.status || user.status === 'novice'
  ).length
  const eventGendersMemberReserveCount = eventGendersReserve.filter(
    (user) => user.status === 'member'
  ).length

  const max = gender === 'mans' ? event.maxMans : event.maxWomans
  const maxNovice =
    gender === 'mans' ? event.maxMansNovice : event.maxWomansNovice
  const maxMember =
    gender === 'mans' ? event.maxMansMember : event.maxWomansMember

  const actualMax =
    typeof maxNovice === 'number' && typeof maxMember === 'number'
      ? typeof max === 'number'
        ? Math.min(maxNovice + maxMember, max)
        : maxNovice + maxMember
      : typeof max === 'number'
      ? max
      : undefined

  return maxNovice || maxMember ? (
    <>
      <div className="flex flex-col items-center">
        {showAges && <Ages gender={gender} event={event} />}
        <div className="flex items-center gap-x-0.5">
          <div className="flex flex-col">
            {showNoviceAndMemberSum ? (
              <div className="flex gap-x-0.5 items-center">
                {/* <UserStatusIcon size="xs" status="novice" /> */}
                <div className="flex tablet:gap-x-0.5">
                  <span
                  // className={
                  //   (typeof maxNovice === 'number' &&
                  //     noviceCount >= maxNovice) ||
                  //   (typeof maxMember === 'number' &&
                  //     memberCount >= maxMember)
                  //     ? 'text-danger font-semibold'
                  //     : ''
                  // }
                  >
                    {eventGendersNoviceCount + eventGendersMemberCount}
                  </span>
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
                  {/* <span>чел.</span> */}
                </div>
              </div>
            ) : (
              <>
                <div className="flex gap-x-0.5 items-center">
                  <UserStatusIcon size="xs" status="novice" />
                  <div className="flex tablet:gap-x-0.5">
                    <span
                      className={
                        maxNovice && eventGendersNoviceCount >= maxNovice
                          ? 'text-danger font-semibold'
                          : ''
                      }
                    >
                      {eventGendersNoviceCount}
                    </span>
                    {typeof maxNovice === 'number' && (
                      <>
                        <span>/</span>
                        <span>{maxNovice}</span>
                      </>
                    )}
                    {showReserve && eventGendersNoviceReserveCount > 0 && (
                      <span className="text-xs">{`+${eventGendersNoviceReserveCount}`}</span>
                    )}
                    {/* <span>чел.</span> */}
                  </div>
                </div>
                <div className="flex gap-x-0.5 items-center">
                  <UserStatusIcon size="xs" status="member" />
                  <div className="flex tablet:gap-x-0.5">
                    <span
                      className={
                        maxMember && eventGendersMemberCount >= maxMember
                          ? 'text-danger font-semibold'
                          : ''
                      }
                    >
                      {eventGendersMemberCount}
                    </span>
                    {typeof maxMember === 'number' && (
                      <>
                        <span>/</span>
                        <span>{maxMember}</span>
                      </>
                    )}
                    {eventGendersMemberReserveCount > 0 && (
                      <span className="text-xs">{`+${eventGendersMemberReserveCount}`}</span>
                    )}
                    {/* <span>чел.</span> */}
                  </div>
                </div>
              </>
            )}
          </div>
          {!showNoviceAndMemberSum && typeof actualMax === 'number' ? (
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
                    eventGendersNoviceCount + eventGendersMemberCount >=
                    actualMax
                      ? 'text-danger font-semibold'
                      : ''
                  }
                >
                  {actualMax}
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
            <span className="hidden laptop:block">чел.</span>
          )}
        </div>
      </div>
    </>
  ) : (
    <div className="flex flex-col items-center">
      {showAges && <Ages gender={gender} event={event} />}
      <div className="flex gap-x-0.5">
        <span
          className={
            typeof actualMax === 'number' &&
            eventGendersNoviceCount + eventGendersMemberCount >= actualMax
              ? 'text-danger font-semibold'
              : ''
          }
        >
          {eventGendersNoviceCount + eventGendersMemberCount}
        </span>
        {typeof actualMax === 'number' && (
          <>
            <span>/</span>
            <span>{actualMax}</span>
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

const SumCounterComponent = ({ event, showReserve }) => {
  const eventMansCount = useRecoilValue(eventMansSelector(event._id)).length
  const eventWomansCount = useRecoilValue(eventWomansSelector(event._id)).length
  const eventMansReserveCount = useRecoilValue(
    eventMansReserveSelector(event._id)
  ).length
  const eventWomansReserveCount = useRecoilValue(
    eventWomansReserveSelector(event._id)
  ).length

  const eventParticipantsCount = eventMansCount + eventWomansCount
  const eventReserveCount = eventMansReserveCount + eventWomansReserveCount

  return (
    <>
      <div className="flex laptop:gap-x-0.5">
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

const EventUsersCounterAndAge = ({ eventId, className, showAges }) => {
  const isLoggedUserModer = useRecoilValue(isLoggedUserModerSelector)
  const event = useRecoilValue(eventSelector(eventId))

  if (!eventId || !event) return null

  const showReserve = true // isLoggedUserModer

  return (
    <div
      className={cn(
        'flex text-sm laptop:text-base leading-4 laptop:leading-5 justify-between laptop:justify-start border-gray-300',
        className
      )}
    >
      <div className="items-center hidden pl-2 font-bold laptop:flex gap-x-1">
        Участники:
      </div>
      <div className="flex items-center px-1 laptop:px-2 laptop:border-r gap-x-1">
        <FontAwesomeIcon
          icon={faMars}
          className="w-5 h-5 text-blue-600 laptop:w-6 laptop:h-6"
        />
        <Counter
          gender="mans"
          event={event}
          showAges={showAges}
          showNoviceAndMemberSum={!isLoggedUserModer}
          showReserve={showReserve}
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
          showAges={showAges}
          showNoviceAndMemberSum={!isLoggedUserModer}
          showReserve={showReserve}
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
      <div className="flex items-center px-2 py-1 gap-x-1 laptop:gap-x-1">
        <div className="w-5 h-5 min-w-5">
          <SvgSigma className="fill-general" />
        </div>
        <SumCounter event={event} showReserve={showReserve} />
      </div>
    </div>
  )
}

export default EventUsersCounterAndAge
