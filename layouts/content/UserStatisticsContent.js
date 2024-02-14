import PieChart from '@components/Charts/PieChart'
import CheckBox from '@components/CheckBox'
import { H3 } from '@components/tags'
import formatDate from '@helpers/formatDate'
import getDataStringBetweenDates from '@helpers/getDataStringBetweenDates'
import isEventClosedFunc from '@helpers/isEventClosed'
import asyncEventsUsersByUserIdAtom from '@state/asyncSelectors/asyncEventsUsersByUserIdAtom'
import directionsAtom from '@state/atoms/directionsAtom'
import eventsAtom from '@state/atoms/eventsAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import cn from 'classnames'
import Image from 'next/legacy/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowContainer, Popover } from 'react-tiny-popover'
import { useRecoilValue } from 'recoil'
import Tilt from 'react-parallax-tilt'
// import { FlipTilt } from 'react-flip-tilt'

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
    if (num <= count) return i
  }
  return
}

const Cup = ({ place, className }) => {
  if (typeof place === 'number')
    return (
      <Image
        className={className}
        src={`/img/achievements/${place <= 4 ? place : 4}.svg`}
        width="100%"
        height="100%"
      />
    )
  return (
    <Image
      className={cn('opacity-20 grayscale', className)}
      src="/img/achievements/4.svg"
      width="100%"
      height="100%"
    />
  )
}

const Achivement = ({ name, place, tooltipText }) => {
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

  return (
    <>
      {/* //   <div> */}
      <Tilt
        className={cn(
          'tilt',
          'rounded-lg border-gray-200 border hover:border-general duration-300 cursor-pointer',
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
                    : 'bg-white'
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
            className={cn(
              'flex flex-col h-[100px] w-[100px] laptop:h-[120px] laptop:w-[120px] rounded-lg border-gray-200 border hover:border-general duration-300 cursor-pointer',
              // "inner-element"
              // 'track-on-window'
              // 'animate-shadow-pulse'
              'tilt'
            )}
          >
            <div
              className={cn(
                'flex flex-col h-[100px] w-[100px] p-[8px] laptop:h-[120px] laptop:w-[120px] laptop:p-[10px]',
                'tilt-element'
              )}
            >
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
  // const modalsFunc = useRecoilValue(modalsFuncAtom)
  const loggedUser = useRecoilValue(loggedUserAtom)
  const events = useRecoilValue(eventsAtom)
  const directions = useRecoilValue(directionsAtom)
  const eventsUser = useRecoilValue(
    asyncEventsUsersByUserIdAtom(loggedUser._id)
  )
  const siteSettings = useRecoilValue(siteSettingsAtom)
  const eventsTags = siteSettings.eventsTags ?? []
  const userEventsIds = eventsUser.map((eventUser) => eventUser.eventId)

  const [showAllAchivement, setShowAllAchivement] = useState(false)

  const filteredEvents = useMemo(
    () =>
      events.filter(
        (event) => isEventClosedFunc(event) && userEventsIds.includes(event._id)
      ),
    [events]
  )

  const eventsTagsWithCount = eventsTags.map(
    ({
      text,
      // , color
    }) => {
      const filteredEventsWithTag = filteredEvents.filter(
        (event) => event.tags && event.tags.includes(text)
      )
      return {
        text,
        //  color,
        count: filteredEventsWithTag.length,
      }
    }
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

  const rare = [
    [20, 12, 7, 4, 2],
    [40, 25, 14, 8, 4],
    [50, 30, 18, 10, 5],
    [60, 35, 20, 12, 6],
    [80, 50, 28, 16, 8],
    [100, 60, 35, 20, 10],
  ]

  const tagEventsCount = (tag) =>
    eventsTagsWithCount.find(({ text }) => text === tag)?.count

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
      num: tagEventsCount('азарт'),
    },
    {
      name: 'Путешественник',
      cause: 'Количество посещенных мероприятий с тэгом "Путешествие"',
      counts: rare[0],
      num: tagEventsCount('путешествие'),
    },
    {
      name: 'Турист',
      cause: 'Количество посещенных мероприятий с тэгом "Поход"',
      counts: rare[0],
      num: tagEventsCount('поход'),
    },
    {
      name: 'ЗОЖник',
      cause: 'Количество посещенных мероприятий с тэгом "Здоровье"',
      counts: rare[2],
      num: tagEventsCount('здоровье'),
    },
    {
      name: 'Настольщик',
      cause: 'Количество посещенных мероприятий с тэгом "Настолки"',
      counts: rare[2],
      num: tagEventsCount('настолки'),
    },
    {
      name: 'Эволюционер',
      cause: 'Количество посещенных мероприятий с тэгом "Развитие"',
      counts: rare[0],
      num: tagEventsCount('развитие'),
    },
    {
      name: 'Урбанист',
      cause: 'Количество посещенных мероприятий с тэгом "Город"',
      counts: rare[3],
      num: tagEventsCount('город'),
    },
    {
      name: 'Рандевушник',
      cause: 'Количество посещенных мероприятий с тэгом "Свидание"',
      counts: rare[0],
      num: tagEventsCount('свидание'),
    },
    {
      name: 'Загадочник',
      cause: 'Количество посещенных мероприятий с тэгом "Квест"',
      counts: rare[0],
      num: tagEventsCount('квест'),
    },
    {
      name: 'Спортсмен',
      cause: 'Количество посещенных мероприятий с тэгом "Спорт"',
      counts: rare[1],
      num: tagEventsCount('спорт'),
    },
    {
      name: 'Тусовщик',
      cause: 'Количество посещенных мероприятий с тэгом "Вечеринка"',
      counts: rare[0],
      num: tagEventsCount('вечеринка'),
    },
    {
      name: 'Парильщик',
      cause: 'Количество посещенных мероприятий с тэгом "Баня"',
      counts: rare[1],
      num: tagEventsCount('баня'),
    },
    {
      name: 'Гулёна',
      cause: 'Количество посещенных мероприятий с тэгом "Прогулка"',
      counts: rare[1],
      num: tagEventsCount('прогулка'),
    },
    {
      name: 'Леший',
      cause: 'Количество посещенных мероприятий с тэгом "Природа"',
      counts: rare[3],
      num: tagEventsCount('природа'),
    },
    {
      name: 'Экстрасенс',
      cause: 'Количество посещенных мероприятий с тэгом "Эзотерика"',
      counts: rare[0],
      num: tagEventsCount('эзотерика'),
    },
    {
      name: 'Кинокритик',
      cause: 'Количество посещенных мероприятий с тэгом "Кино"',
      counts: rare[0],
      num: tagEventsCount('кино'),
    },
    {
      name: 'АРТист',
      cause: 'Количество посещенных мероприятий с тэгом "Искусство"',
      counts: rare[0],
      num: tagEventsCount('искусство'),
    },
    {
      name: 'Пирушник',
      cause: 'Количество посещенных мероприятий с тэгом "Застолье"',
      counts: rare[1],
      num: tagEventsCount('застолье'),
    },
    {
      name: 'Мать Тереза',
      cause: 'Количество посещенных мероприятий с тэгом "Благотворительность"',
      counts: rare[0],
      num: eventsTagsWithCount.find(
        ({ text }) => text === 'благотворительность'
      ),
    },
    {
      name: 'Зигмунд Фрейд',
      cause: 'Количество посещенных мероприятий с тэгом "Психология"',
      counts: rare[0],
      num: tagEventsCount('психология'),
    },
    {
      name: 'Гений',
      cause: 'Количество посещенных мероприятий с тэгом "Квиз"',
      counts: rare[1],
      num: eventsTagsWithCount.find(({ text }) => text === 'квиз'),
    },
  ]

  const achievementsWithPlace = achievements.map((achive) => ({
    ...achive,
    place: place(achive.num, achive.counts),
  }))

  const sortedAchievementsWithPlace = [
    ...achievementsWithPlace.filter(
      ({ place }) => showAllAchivement || typeof place === 'number'
    ),
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
                    place === 0
                      ? 'У Вас Высшая награда!'
                      : typeof place !== 'number'
                        ? `Для достижения необходимо: ${[...counts].reverse()[0]}`
                        : `Следующее достижение: ${counts[place - 1]}`
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
        title={`Посетил мероприятия по направлениям`}
      />
    </div>
  )
}

export default UserStatisticsContent
