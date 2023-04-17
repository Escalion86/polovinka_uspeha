import { useRecoilValue } from 'recoil'
import PieChart from '@components/Charts/PieChart'
import { useMemo, useState } from 'react'
import { H3 } from '@components/tags'
import eventsAtom from '@state/atoms/eventsAtom'
import eventStatus from '@helpers/eventStatus'
import Divider from '@components/Divider'
import directionsAtom from '@state/atoms/directionsAtom'
import EventStatusToggleButtons from '@components/IconToggleButtons/EventStatusToggleButtons'
import isEventExpiredFunc from '@helpers/isEventExpired'
import isEventActiveFunc from '@helpers/isEventActive'
import isEventCanceledFunc from '@helpers/isEventCanceled'
import isEventClosedFunc from '@helpers/isEventClosed'
import { MONTHS } from '@helpers/constants'
import arrayOfSumOfPaymentsForClosedEventsProductsAndServicesByDateSelector from '@state/selectors/arrayOfSumOfPaymentsForClosedEventsProductsAndServicesByDateSelector'

const StatisticsEventsContent = () => {
  const events = useRecoilValue(eventsAtom)
  const directions = useRecoilValue(directionsAtom)

  const incomeByDate = useRecoilValue(
    arrayOfSumOfPaymentsForClosedEventsProductsAndServicesByDateSelector
  )

  const dataOfIncomeByDate = []
  for (const year in incomeByDate) {
    const data = incomeByDate[year].map((income, index) => ({
      x: MONTHS[index],
      y: income,
    }))
    dataOfIncomeByDate.push({ id: year, data })
  }

  const [filterEvents, setFilterEvents] = useState({
    status: {
      active: false,
      finished: true,
      canceled: false,
    },
  })

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        const isEventExpired = isEventExpiredFunc(event)
        const isEventActive = isEventActiveFunc(event)
        const isEventCanceled = isEventCanceledFunc(event)
        const isEventClosed = isEventClosedFunc(event)
        return (
          (isEventClosed && filterEvents.status.finished) ||
          (isEventActive && filterEvents.status.finished && isEventExpired) ||
          (isEventActive && filterEvents.status.active && !isEventExpired) ||
          (isEventCanceled && filterEvents.status.canceled)
        )
      }),
    [events, filterEvents]
  )

  const finishedEventsCount = events.filter((event) =>
    ['finished', 'closed'].includes(eventStatus(event))
  ).length
  const activeEventsCount = events.filter((event) =>
    ['inProgress', 'active'].includes(eventStatus(event))
  ).length
  const canceledEventsCount = events.filter(
    (event) => eventStatus(event) === 'canceled'
  ).length

  const eventsByStatusData = [
    {
      id: 'Предстоят',
      label: 'Предстоят',
      value: activeEventsCount,
      color: '#60a5fa',
    },
    {
      id: 'Завершены',
      label: 'Завершены',
      value: finishedEventsCount,
      color: '#4ade80',
    },
    {
      id: 'Отменены',
      label: 'Отменены',
      value: canceledEventsCount,
      color: '#f87171',
    },
  ]

  const eventsByDirectionsData = directions.map((direction) => {
    const eventsInDirectionCount = filteredEvents.filter(
      (event) => event.directionId === direction._id
    ).length
    return {
      id: direction.title,
      label: direction.title,
      value: eventsInDirectionCount,
      // color: '#f87171',
    }
  })

  return (
    <div className="flex flex-col items-center p-2 overflow-y-auto">
      <PieChart data={eventsByStatusData} title="По статусу" />
      <Divider light />
      <div className="flex flex-col items-center w-[300px]">
        <H3>По направлениям</H3>
        <EventStatusToggleButtons
          value={filterEvents.status}
          onChange={(value) =>
            setFilterEvents((state) => ({ ...state, status: value }))
          }
          noClosed
        />
        <PieChart data={eventsByDirectionsData} />
      </div>
    </div>
  )
}

export default StatisticsEventsContent
