import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
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

import { Popover, ArrowContainer } from 'react-tiny-popover'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import CheckBox from '@components/CheckBox'

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
    return <Image src="/img/achievements/1.svg" width="100%" height="100%" />
  if (place === 2)
    return <Image src="/img/achievements/2.svg" width="100%" height="100%" />
  if (place === 3)
    return <Image src="/img/achievements/3.svg" width="100%" height="100%" />
  if (place === 4)
    return <Image src="/img/achievements/4.svg" width="100%" height="100%" />
  return (
    <Image
      className="opacity-20 grayscale"
      src="/img/achievements/4.svg"
      width="100%"
      height="100%"
    />
  )
}

const Achivement = ({ name, place, tooltipText }) => {
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
        className={cn(
          'flex flex-col h-[100px] w-[100px] p-[8px] laptop:h-[120px] laptop:w-[120px] laptop:p-[10px] rounded-lg border-gray-200 border hover:border-general duration-300 cursor-pointer',
          place === 1
            ? 'bg-yellow-100'
            : place === 2
            ? 'bg-gray-100'
            : place === 3
            ? 'bg-amber-100'
            : place === 4
            ? 'bg-green-100'
            : 'bg-white'
        )}
      >
        <Cup place={place ?? 0} />
        <div
          className={cn(
            'text-sm laptop:text-base text-center -mx-[8px]',
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
  const siteSettings = useRecoilValue(siteSettingsAtom)
  const eventsTags = siteSettings.eventsTags ?? []
  const userEventsIds = eventsUser.map((eventUser) => eventUser.eventId)
  console.log('eventsUser :>> ', eventsUser)

  const [showAllAchivement, setShowAllAchivement] = useState(false)

  const filteredEvents = useMemo(
    () =>
      events.filter(
        (event) => isEventClosedFunc(event) && userEventsIds.includes(event._id)
      ),
    [events]
  )

  const eventsTagsWithCount = eventsTags.map(({ text, color }) => {
    const filteredEventsWithTag = filteredEvents.filter(
      (event) => event.tags && event.tags.includes(text)
    )
    return { text, color, count: filteredEventsWithTag.length }
  })

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

  const rare = [
    [16, 8, 4, 2],
    [30, 15, 8, 4],
    [40, 20, 10, 5],
    [50, 25, 12, 6],
    [60, 30, 15, 8],
    [80, 40, 20, 10],
  ]

  const achievements = [
    {
      name: 'Активист',
      cause: 'Количество посещенных мероприятий',
      counts: rare[5],
      num: filteredEvents.length,
    },
    {
      name: 'Лудоман',
      cause: 'Количество посещенных мероприятий с тэгом "Азарт"',
      counts: rare[2],
      num: eventsTagsWithCount.find(({ text }) => text === 'азарт')?.count,
    },
    {
      name: 'Путешественник',
      cause: 'Количество посещенных мероприятий с тэгом "Путешествие"',
      counts: rare[0],
      num: eventsTagsWithCount.find(({ text }) => text === 'путешествие')
        ?.count,
    },
    {
      name: 'Турист',
      cause: 'Количество посещенных мероприятий с тэгом "Поход"',
      counts: rare[0],
      num: eventsTagsWithCount.find(({ text }) => text === 'поход')?.count,
    },
    {
      name: 'ЗОЖник',
      cause: 'Количество посещенных мероприятий с тэгом "Здоровье"',
      counts: rare[2],
      num: eventsTagsWithCount.find(({ text }) => text === 'здоровье')?.count,
    },
    {
      name: 'Настольщик',
      cause: 'Количество посещенных мероприятий с тэгом "Настолки"',
      counts: rare[2],
      num: eventsTagsWithCount.find(({ text }) => text === 'настолки')?.count,
    },
    {
      name: 'Эволюционер',
      cause: 'Количество посещенных мероприятий с тэгом "Развитие"',
      counts: rare[1],
      num: eventsTagsWithCount.find(({ text }) => text === 'развитие')?.count,
    },
    {
      name: 'Урбанист',
      cause: 'Количество посещенных мероприятий с тэгом "Город"',
      counts: rare[4],
      num: eventsTagsWithCount.find(({ text }) => text === 'город')?.count,
    },
    {
      name: 'Рандевушник',
      cause: 'Количество посещенных мероприятий с тэгом "Свидание"',
      counts: rare[0],
      num: eventsTagsWithCount.find(({ text }) => text === 'свидание')?.count,
    },
    {
      name: 'Загадочник',
      cause: 'Количество посещенных мероприятий с тэгом "Квест"',
      counts: rare[0],
      num: eventsTagsWithCount.find(({ text }) => text === 'квест')?.count,
    },
    {
      name: 'Спортсмен',
      cause: 'Количество посещенных мероприятий с тэгом "Спорт"',
      counts: rare[1],
      num: eventsTagsWithCount.find(({ text }) => text === 'спорт')?.count,
    },
    {
      name: 'Тусовщик',
      cause: 'Количество посещенных мероприятий с тэгом "Вечеринка"',
      counts: rare[0],
      num: eventsTagsWithCount.find(({ text }) => text === 'вечеринка')?.count,
    },
    {
      name: 'Парильщик',
      cause: 'Количество посещенных мероприятий с тэгом "Баня"',
      counts: rare[1],
      num: eventsTagsWithCount.find(({ text }) => text === 'баня')?.count,
    },
    {
      name: 'Гулёна',
      cause: 'Количество посещенных мероприятий с тэгом "Прогулка"',
      counts: rare[1],
      num: eventsTagsWithCount.find(({ text }) => text === 'прогулка')?.count,
    },
    {
      name: 'Леший',
      cause: 'Количество посещенных мероприятий с тэгом "Природа"',
      counts: rare[1],
      num: eventsTagsWithCount.find(({ text }) => text === 'природа')?.count,
    },
    {
      name: 'Экстрасенс',
      cause: 'Количество посещенных мероприятий с тэгом "Эзотерика"',
      counts: rare[0],
      num: eventsTagsWithCount.find(({ text }) => text === 'эзотерика')?.count,
    },
    {
      name: 'Кинокритик',
      cause: 'Количество посещенных мероприятий с тэгом "Кино"',
      counts: rare[0],
      num: eventsTagsWithCount.find(({ text }) => text === 'кино')?.count,
    },
    {
      name: 'АРТист',
      cause: 'Количество посещенных мероприятий с тэгом "Искусство"',
      counts: rare[0],
      num: eventsTagsWithCount.find(({ text }) => text === 'искусство')?.count,
    },
    // {
    //   name: 'Авенюст',
    //   cause: 'Количество посещенных мероприятий с тэгом "Улица"',
    //   counts: rare[0],
    //   num: eventsTagsWithCount.find(({ text }) => text === 'улица')?.count,
    // },
  ]

  const achievementsWithPlace = achievements.map((achive) => ({
    ...achive,
    place: place(achive.num, achive.counts),
  }))

  const sortedAchievementsWithPlace = [
    ...achievementsWithPlace.filter(({ place }) => showAllAchivement || place),
  ].sort((a, b) => ((a.place ?? 5) > (b.place ?? 5) ? 1 : -1))

  return (
    <div className="flex flex-col items-center p-2 overflow-y-auto gap-y-5">
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
      <div className="flex flex-col items-center gap-y-1">
        <H3>Мои достижения</H3>
        <CheckBox
          label="Показать не полученные"
          checked={showAllAchivement}
          onChange={() => setShowAllAchivement((state) => !state)}
        />
        <div className="flex flex-wrap justify-center gap-2">
          {sortedAchievementsWithPlace.length > 0 ? (
            sortedAchievementsWithPlace.map(
              ({ name, cause, counts, num, place }) => (
                <Achivement
                  key={'achive' + name}
                  name={name}
                  place={place}
                  tooltipText={`${cause}: ${num ?? 0}\n${
                    place === 1
                      ? 'У Вас Высшая награда!'
                      : !place
                      ? `Для достижения необходимо: ${[...counts].reverse()[0]}`
                      : `Следующее достижение: ${counts[place - 2]}`
                  }`}
                />
              )
            )
          ) : (
            <div>У вас пока нет достижений</div>
          )}
        </div>
      </div>
      <PieChart
        data={eventsByDirectionsData}
        title="Посетил мероприятия по направлениям"
      />
    </div>
  )
}

export default UserStatisticsContent
