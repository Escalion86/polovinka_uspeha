'use client'

import PieChart from '@components/Charts/PieChart'
import CheckBox from '@components/CheckBox'
import { H3 } from '@components/tags'
import formatDate from '@helpers/formatDate'
import formatDateTime from '@helpers/formatDateTime'
import getDataStringBetweenDates from '@helpers/getDataStringBetweenDates'
import isEventClosedFunc from '@helpers/isEventClosed'
import {
  EVENT_ACHIEVEMENTS_CONFIG,
  calculateEventAchievementPlace,
} from '@helpers/eventAchievementsConfig'
import { putData } from '@helpers/CRUD'
import useSnackbar from '@helpers/useSnackbar'
import asyncEventsUsersByUserIdAtom from '@state/async/asyncEventsUsersByUserIdAtom'
import achievementsAtom from '@state/atoms/achievementsAtom'
import achievementsUsersAtom from '@state/atoms/achievementsUsersAtom'
import directionsAtom from '@state/atoms/directionsAtom'
import eventsAtom from '@state/atoms/eventsAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import locationAtom from '@state/atoms/locationAtom'
import cn from 'classnames'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowContainer, Popover } from 'react-tiny-popover'
import { useAtomValue, useSetAtom } from 'jotai'
import Tilt from 'react-parallax-tilt'

const Cup = ({ place, className, image }) => {
  if (image)
    return (
      <div
        className={cn(
          'relative w-[65px] h-[65px] laptop:w-[77px] laptop:h-[77px] overflow-hidden rounded-lg border border-gray-200 bg-white',
          className
        )}
      >
        <Image
          src={image}
          alt="achievement"
          fill
          className="object-cover"
          sizes="77px"
        />
      </div>
    )

  if (typeof place === 'number')
    return (
      <Image
        className={cn(
          'w-[65px] h-[65px] laptop:w-[77px] laptop:h-[77px]',
          className
        )}
        src={`/img/achievements/${place <= 4 ? place : 4}.svg`}
        width="0"
        height="0"
        sizes="77px"
        alt="cup"
      />
    )
  return (
    <Image
      className={cn(
        'w-[65px] h-[65px] laptop:w-[77px] laptop:h-[77px] opacity-20 grayscale',
        className
      )}
      src="/img/achievements/4.svg"
      width="0"
      height="0"
      sizes="77px"
      alt="cup"
    />
  )
}

const Achivement = ({
  name,
  place,
  tooltipText,
  image,
  isUnviewed = false,
  onClick,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const refFlip = useRef()

  useEffect(() => {
    if (refFlip.current) {
      //do something else with the ref
      setInterval(() => {
        refFlip.current.flip()
      }, 1000)
    }
  }, [])

  const handleClick = () => {
    setIsPopoverOpen(true)
    if (onClick) onClick()
  }

  return (
    <>
      {/* //   <div> */}
      <Tilt
        className={cn(
          'tilt',
          'relative rounded-lg border-gray-200 border hover:border-general duration-300 cursor-pointer',
          place === 0
            ? 'bg-blue-100'
            : place === 1
              ? 'bg-yellow-100'
              : place === 2
                ? 'bg-gray-100'
                : place === 3
                  ? 'bg-amber-100'
                  : place === 4
                    ? 'bg-green-100'
                    : 'bg-white',
          isUnviewed
            ? 'ring-2 ring-offset-2 ring-yellow-300 shadow-[0_0_25px_rgba(253,224,71,0.7)] animate-pulse'
            : null
        )}
        glareEnable
        tiltReverse
        perspective={500}
        glareMaxOpacity={0.75}
        glarePosition="all"
        scale={1.02}
        onMouseEnter={() => setIsPopoverOpen(true)}
        onMouseLeave={() => setIsPopoverOpen(false)}
        // trackOnWindow={true}
        // glareBorderRadius="60"
        // className="h-[100px] w-[100px] p-0 m-0"
      >
        <Popover
          // ref={ref}
          isOpen={isPopoverOpen}
          containerClassName="z-50"
          align="center"
          positions={['top']} // preferred positions by priority
          content={({ position, childRect, popoverRect }) => (
            <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
              position={position}
              childRect={childRect}
              popoverRect={popoverRect}
              arrowColor={'#e5e7eb'}
              arrowSize={10}
              arrowStyle={{ opacity: 0.7 }}
              className="popover-arrow-container"
              arrowClassName="popover-arrow"
            >
              <div className="p-2 text-sm text-center whitespace-pre-wrap bg-gray-100 border border-gray-200 rounded-lg tablet:text-base">
                {tooltipText}
              </div>
            </ArrowContainer>
          )}
        >
          <div
            onMouseEnter={() => setIsPopoverOpen(true)}
            onMouseLeave={() => setIsPopoverOpen(false)}
            onClick={handleClick}
            className={cn(
              'flex flex-col h-[100px] w-[100px] laptop:h-[120px] laptop:w-[120px] rounded-lg border-gray-200 border hover:border-general duration-300 cursor-pointer',
              // "inner-element"
              // 'track-on-window'
              // 'animate-shadow-pulse'
              'tilt',
              isUnviewed
                ? 'ring-2 ring-yellow-300 ring-offset-2 shadow-[0_0_25px_rgba(253,224,71,0.5)]'
                : null
            )}
          >
            <div
              className={cn(
                'flex items-center flex-col h-[100px] w-[100px] p-[8px] laptop:h-[120px] laptop:w-[120px] laptop:p-[10px]',
                'tilt-element'
              )}
            >
              <Cup
                place={place}
                image={image}
                className={cn(
                  isUnviewed
                    ? 'drop-shadow-[0_0_18px_rgba(253,224,71,0.8)]'
                    : null
                )}
              />
              <div
                className={cn(
                  'text-sm laptop:text-base text-center -mx-[8px]',
                  typeof place === 'number'
                    ? 'text-general font-bold'
                    : 'text-disabled'
                )}
              >
                {name}
              </div>
            </div>
          </div>
        </Popover>
      </Tilt>
      {/* <div className="p-1">
        <FlipTilt
          onMouseEnter={() => setIsPopoverOpen(true)}
          onMouseLeave={() => setIsPopoverOpen(false)}
          // ref={async (r) => {
          //   if (r) {
          //     console.log(`isFlipped = ${r.isFlipped()}`)
          //     await r.flip()
          //     console.log(`isFlipped = ${r.isFlipped()}`)
          //     refFlip.current = r
          //   }
          // }}
          // flipped={false}
          // onClick={flip}
          // onFlipBack={(l) => console.log('l :>> ', l?.target)}
          // onFlip={(m) => console.log('m :>> ', m?.target)}
          back={
            <div
              className={cn(
                'flex flex-col h-[100px] w-[100px] laptop:h-[120px] laptop:w-[120px]'
              )}
            >
              <div className="flex flex-col tilt-element h-[100px] w-[100px] p-[8px] laptop:h-[120px] laptop:w-[120px] laptop:p-[10px]">
                <Cup place={place} />
                <div
                  className={cn(
                    'text-sm laptop:text-base text-center -mx-[8px]',
                    typeof place === 'number'
                      ? 'text-general font-bold'
                      : 'text-disabled'
                  )}
                >
                  {name}
                </div>
              </div>
            </div>
          }
          front={<div>Тестdsdsdsd</div>}
        />
      </div> */}
      {/* </Popover> */}
    </>
  )
}

const UserStatisticsContent = () => {
  // const modalsFunc = useAtomValue(modalsFuncAtom)
  const loggedUserActive = useAtomValue(loggedUserActiveAtom)
  const events = useAtomValue(eventsAtom)
  const directions = useAtomValue(directionsAtom)
  const achievementsList = useAtomValue(achievementsAtom)
  const achievementsUsers = useAtomValue(achievementsUsersAtom)
  const setAchievementsUsers = useSetAtom(achievementsUsersAtom)
  const eventsUser = useAtomValue(
    asyncEventsUsersByUserIdAtom(loggedUserActive._id)
  )
  const location = useAtomValue(locationAtom)
  const snackbar = useSnackbar()
  const pendingViewIdsRef = useRef(new Set())
  const loggedUserId = loggedUserActive?._id
  const userEventsIds = eventsUser
    .filter(({ status }) => !['ban', 'reserve'].includes(status))
    .map((eventUser) => eventUser.eventId)

  const [showAllAchivement, setShowAllAchivement] = useState(false)

  const filteredEvents = useMemo(
    () =>
      events.filter(
        (event) => isEventClosedFunc(event) && userEventsIds.includes(event._id)
      ),
    [events, userEventsIds]
  )

  const assignedAchievements = useMemo(() => {
    if (!loggedUserActive?._id) return []

    return (
      achievementsUsers
        ?.filter(
          ({ userId }) => String(userId) === String(loggedUserActive._id)
        )
        .map((item) => {
          const achievement = achievementsList.find(
            ({ _id }) => String(_id) === String(item.achievementId)
          )
          const event = events.find(
            ({ _id }) => String(_id) === String(item.eventId)
          )

          return {
            ...item,
            achievement,
            event,
          }
        })
        .sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt)) || []
    )
  }, [achievementsUsers, achievementsList, events, loggedUserActive])

  const assignedAchievementCards = useMemo(
    () =>
      assignedAchievements.map((item) => {
        const name = item.achievement?.name ?? 'Достижение'
        const tooltipParts = []

        if (item.achievement?.description)
          tooltipParts.push(item.achievement.description)
        if (item.comment) tooltipParts.push(`Комментарий: ${item.comment}`)

        const eventTitle = item.event?.title || item.eventName
        if (eventTitle) tooltipParts.push(`Мероприятие: ${eventTitle}`)

        if (item.issuedAt)
          tooltipParts.push(
            `Выдано: ${formatDateTime(
              item.issuedAt,
              true,
              false,
              false,
              false,
              undefined,
              true,
              true
            )}`
          )

        return {
          key: `assigned-${item._id}`,
          name,
          place: 0,
          tooltipText: tooltipParts.join('\n'),
          image: item.achievement?.image,
          assignmentId: String(item._id),
          isViewed: Boolean(item.viewedAt),
        }
      }),
    [assignedAchievements]
  )

  const handleAchievementCardClick = useCallback(
    async (assignmentId) => {
      if (!assignmentId || !loggedUserId) return

      const normalizedId = String(assignmentId)
      if (pendingViewIdsRef.current.has(normalizedId)) return

      const targetAssignment = assignedAchievements.find(
        ({ _id }) => String(_id) === normalizedId
      )

      if (!targetAssignment || targetAssignment.viewedAt) return

      pendingViewIdsRef.current.add(normalizedId)

      const optimisticViewedAt = new Date().toISOString()

      setAchievementsUsers((state) =>
        state.map((item) =>
          String(item._id) === normalizedId
            ? { ...item, viewedAt: optimisticViewedAt }
            : item
        )
      )

      try {
        const updated = await putData(
          `/api/${location}/achievementsusers/${normalizedId}`,
          { viewedAt: optimisticViewedAt },
          null,
          null,
          false,
          loggedUserId
        )

        if (!updated) {
          setAchievementsUsers((state) =>
            state.map((item) =>
              String(item._id) === normalizedId
                ? { ...item, viewedAt: targetAssignment.viewedAt ?? null }
                : item
            )
          )
          snackbar.error('Не удалось отметить достижение просмотренным')
        } else if (
          updated?.viewedAt &&
          updated.viewedAt !== optimisticViewedAt
        ) {
          setAchievementsUsers((state) =>
            state.map((item) =>
              String(item._id) === normalizedId
                ? { ...item, viewedAt: updated.viewedAt }
                : item
            )
          )
        }
      } finally {
        pendingViewIdsRef.current.delete(normalizedId)
      }
    },
    [
      assignedAchievements,
      location,
      loggedUserId,
      setAchievementsUsers,
      snackbar,
    ]
  )

  const eventsByDirectionsData = directions.map((direction) => {
    const eventsInDirectionCount = filteredEvents.filter(
      (event) => event.directionId === direction._id
    ).length
    return {
      id: direction.title,
      label: direction.title,
      value: eventsInDirectionCount,
    }
  })

  const storedEventAchievementsMap = useMemo(() => {
    const records = Array.isArray(loggedUserActive?.eventAchievements)
      ? loggedUserActive.eventAchievements
      : []
    return records.reduce((map, record) => {
      if (record?.key) {
        const value =
          typeof record.value === 'number' && Number.isFinite(record.value)
            ? record.value
            : 0
        map.set(record.key, value)
      }
      return map
    }, new Map())
  }, [loggedUserActive?.eventAchievements])

  const metricAchievementsWithPlace = EVENT_ACHIEVEMENTS_CONFIG.map(
    ({ key, name, cause, thresholds }) => {
      const num = storedEventAchievementsMap.get(key) ?? 0
      return {
        key,
        name,
        cause,
        counts: thresholds,
        num,
        place: calculateEventAchievementPlace(num, thresholds),
      }
    }
  )

  const sortedAchievementsWithPlace = [
    ...metricAchievementsWithPlace.filter(
      ({ place }) => showAllAchivement || typeof place === 'number'
    ),
  ].sort((a, b) => ((a.place ?? 5) > (b.place ?? 5) ? 1 : -1))

  const metricAchievementCards = sortedAchievementsWithPlace.map(
    ({ name, cause, counts, num, place }) => ({
      key: `metric-${name}`,
      name,
      place,
      tooltipText: `${cause}: ${num ?? 0}\n${
        place === 0
          ? 'У Вас Высшая награда!'
          : typeof place !== 'number'
            ? `Для достижения необходимо: ${[...counts].reverse()[0]}`
            : `Следующее достижение: ${counts[place - 1]}`
      }`,
      assignmentId: null,
      isViewed: true,
    })
  )

  const hasAnyAchievements =
    assignedAchievementCards.length > 0 || metricAchievementCards.length > 0

  return (
    <div className="flex flex-col items-center p-2 overflow-y-auto gap-y-5">
      <div className="flex items-center leading-4 gap-x-1">
        <div className="font-bold">Зарегистрирован:</div>
        <div className="flex flex-wrap leading-4 gap-x-1">
          <span className="font-normal">
            {formatDate(loggedUserActive.createdAt)} -
          </span>
          <span className="font-normal">
            {getDataStringBetweenDates(loggedUserActive.createdAt)}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-y-1">
        <H3>Мои достижения</H3>
        <CheckBox
          label="Показать не полученные"
          checked={showAllAchivement}
          onChange={() => setShowAllAchivement((state) => !state)}
        />
        <div className="flex flex-wrap justify-center gap-2">
          {metricAchievementCards.length > 0 ? (
            metricAchievementCards.map(
              ({ key, name, place, tooltipText, image, assignmentId }) => (
                <Achivement
                  key={key}
                  name={name}
                  place={place}
                  tooltipText={tooltipText}
                  image={image}
                  isUnviewed={false}
                  onClick={
                    assignmentId
                      ? () => handleAchievementCardClick(assignmentId)
                      : undefined
                  }
                />
              )
            )
          ) : !hasAnyAchievements ? (
            <div>У вас пока нет достижений</div>
          ) : null}
        </div>
      </div>
      {assignedAchievementCards.length > 0 && (
        <div className="flex flex-col items-center w-full gap-y-1">
          <H3>Уникальные достижения</H3>
          <div className="flex flex-wrap justify-center gap-2">
            {assignedAchievementCards.map(
              ({ key, name, place, tooltipText, image, assignmentId, isViewed }) => (
                <Achivement
                  key={key}
                  name={name}
                  place={place}
                  tooltipText={tooltipText}
                  image={image}
                  isUnviewed={Boolean(assignmentId) && !isViewed}
                  onClick={
                    assignmentId
                      ? () => handleAchievementCardClick(assignmentId)
                      : undefined
                  }
                />
              )
            )}
          </div>
        </div>
      )}
      <PieChart
        data={eventsByDirectionsData}
        title={`Посетил мероприятия по направлениям`}
      />
    </div>
  )
}

export default UserStatisticsContent
