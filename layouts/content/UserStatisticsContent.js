import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import Button from '@components/Button'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import eventsAtom from '@state/atoms/eventsAtom'
import directionsAtom from '@state/atoms/directionsAtom'

import isEventClosedFunc from '@helpers/isEventClosed'
import eventsUsersByUserIdSelector from '@state/selectors/eventsUsersByUserIdSelector'
import PieChart from '@components/Charts/PieChart'
import { useMemo, useState } from 'react'
import formatDate from '@helpers/formatDate'
import getDataStringBetweenDates from '@helpers/getDataStringBetweenDates'
import Image from 'next/image'
import cn from 'classnames'
import { H3 } from '@components/tags'
import Tooltip from '@components/Tooltip'
import { Popover, ArrowContainer } from 'react-tiny-popover'

const place = (count, places) => {
  if (
    places === null ||
    typeof places !== 'object' ||
    !count ||
    typeof count !== 'number'
  )
    return
  for (let i = 0; i < places.length; i++) {
    const num = places[i]
    if (num < count) return i + 1
  }
  return
}

const Cup = ({ place }) => {
  if (place === 1)
    return <Image src="/img/achievements/1.svg" width="100" height="100" />
  if (place === 2)
    return <Image src="/img/achievements/2.svg" width="100" height="100" />
  if (place === 3)
    return <Image src="/img/achievements/3.svg" width="100" height="100" />
  if (place === 4)
    return <Image src="/img/achievements/3.svg" width="100" height="100" />
  return (
    <Image
      className="opacity-20 grayscale"
      src="/img/achievements/4.svg"
      width="100"
      height="100"
    />
  )
}

const Achivment = ({ name, place, tooltipText }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  return (
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
        className="flex flex-col h-[120px] w-[120px] p-[10px] rounded-lg border-gray-200 border hover:border-general duration-300 cursor-pointer"
      >
        <Cup place={place} />
        <div
          className={cn(
            'text-center',
            place ? 'text-general' : 'text-gray-400'
          )}
        >
          {name}
        </div>
      </div>
    </Popover>
  )
}

const UserStatisticsContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const loggedUser = useRecoilValue(loggedUserAtom)
  const events = useRecoilValue(eventsAtom)
  const directions = useRecoilValue(directionsAtom)
  const eventsUser = useRecoilValue(eventsUsersByUserIdSelector(loggedUser._id))
  const userEventsIds = eventsUser.map((eventUser) => eventUser.eventId)

  const filteredEvents = useMemo(
    () =>
      events.filter(
        (event) => isEventClosedFunc(event) && userEventsIds.includes(event._id)
      ),
    [events]
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

  const achievements = [
    {
      name: 'Активист',
      cause: 'Количество посещенных мероприятий',
      counts: [100, 50, 25, 10],
      num: filteredEvents.length,
    },
  ]

  return (
    <div className="flex flex-col items-center p-2 overflow-y-auto gap-y-3">
      <div className="flex items-center leading-4 gap-x-1">
        <div className="font-bold">Зарегистрирован:</div>
        <div className="flex flex-wrap leading-4 gap-x-1">
          <span className="font-normal">
            {formatDate(loggedUser.createdAt)} -
          </span>
          <span className="font-normal">
            {getDataStringBetweenDates(loggedUser.createdAt)}
          </span>
        </div>
      </div>
      <H3>Мои достижения</H3>
      {achievements.map(({ name, counts, cause, num }) => (
        <Achivment
          name={name}
          place={place(num, counts)}
          tooltipText={`${cause}: ${num}\n${
            num > counts[0]
              ? 'У Вас Высшая награда!'
              : `Следующее достижение: ${counts.find((c) => c > num)}`
          }`}
        />
      ))}
      <PieChart
        data={eventsByDirectionsData}
        title="Посетил мероприятия по направлениям"
      />
    </div>
  )
}

export default UserStatisticsContent
