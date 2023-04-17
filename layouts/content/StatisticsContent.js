import { useRecoilValue } from 'recoil'
import usersAtom from '@state/atoms/usersAtom'
import PieChart from '@components/Charts/PieChart'
import { useMemo, useState } from 'react'
import UsersFilter from '@components/Filter/UsersFilter'
import { H3, H4, P } from '@components/tags'
import eventsAtom from '@state/atoms/eventsAtom'
import eventStatus from '@helpers/eventStatus'
import Divider from '@components/Divider'
import TabContext from '@components/Tabs/TabContext'
import TabPanel from '@components/Tabs/TabPanel'
import directionsAtom from '@state/atoms/directionsAtom'
import StreamChart from '@components/Charts/StreamChart'
import LineChart from '@components/Charts/LineChart'
import getDiffBetweenDates from '@helpers/getDiffBetweenDates'
import formatDate from '@helpers/formatDate'
import getDaysBetween from '@helpers/getDaysBetween'
import EventStatusToggleButtons from '@components/IconToggleButtons/EventStatusToggleButtons'
import isEventExpiredFunc from '@helpers/isEventExpired'
import isEventActiveFunc from '@helpers/isEventActive'
import isEventCanceledFunc from '@helpers/isEventCanceled'
import isEventClosedFunc from '@helpers/isEventClosed'
import arrayOfSumOfPaymentsForClosedEventsByDateSelector from '@state/selectors/arrayOfSumOfPaymentsForClosedEventsByDateSelector'
import { MONTHS, MONTHS_FULL_1 } from '@helpers/constants'
import upperCaseFirst from '@helpers/upperCaseFirst'
import arrayOfSumOfPaymentsForClosedEventsProductsAndServicesByDateSelector from '@state/selectors/arrayOfSumOfPaymentsForClosedEventsProductsAndServicesByDateSelector'
import MonthSelector from '@components/ComboBox/MonthSelector'
import YearSelector from '@components/ComboBox/YearSelector'

const addDaysToDate = (date, days) => {
  if (days === 0) return date
  return new Date(date.getTime() + 1000 * 3600 * 24 * days)
}

const usersCountByDates = (users = [], days = 90) => {
  const dateNow = new Date()
  const dateFinish = new Date(dateNow.getTime())
  const dateStart = new Date(
    dateFinish.getTime() -
      1000 * 3600 * 24 * days -
      (dateNow.getTime() % (1000 * 3600 * 24))
  )

  const result = []

  const mans = users.filter((user) => user.gender === 'male')
  const womans = users.filter((user) => user.gender === 'famale')
  const noGender = users.filter(
    (user) => user.gender !== 'male' && user.gender !== 'famale'
  )

  for (let i = 0; i <= days; i++) {
    const date = addDaysToDate(dateStart, i)
    const mansCount = mans.filter(
      (user) => getDiffBetweenDates(date, user.createdAt) < 0
    ).length
    const womansCount = womans.filter(
      (user) => getDiffBetweenDates(date, user.createdAt) < 0
    ).length
    const noGenderCount = noGender.filter(
      (user) => getDiffBetweenDates(date, user.createdAt) < 0
    ).length
    result.push({
      mans: mansCount,
      womans: womansCount,
      noGender: noGenderCount,
    })
  }

  return result
}

const linesCFG = () => {
  const today = new Date().setHours(0, 0, 0, 0)
  const dateToday = new Date(today)
  // const dateStart = new Date(today - 3600000 * 24)
  const arr = [{ index: 90 }, { index: 0 }]
  // const arr = []

  const firstDayOfMonth = new Date(
    today - (dateToday.getDate() - 1) * 3600000 * 24
  )
  const daysBetween = getDaysBetween(firstDayOfMonth, dateToday, false)
  arr.push({ index: daysBetween + 90, text: formatDate(firstDayOfMonth) })

  do {
    const prevMonth = firstDayOfMonth.setMonth(firstDayOfMonth.getMonth() - 1)
    const daysBetween = getDaysBetween(prevMonth, dateToday, false)
    if (daysBetween < -90) break
    arr.push({ index: daysBetween + 90, text: formatDate(prevMonth) })
    if (daysBetween < -62) break
  } while (true)
  return arr
}

const tooltipCaptions = () => {
  const now = new Date()
  const arr = []
  for (let i = -90; i <= 0; i++) {
    arr.push(formatDate(addDaysToDate(now, i)))
  }
  return arr
}

const StatisticsContent = () => {
  const users = useRecoilValue(usersAtom)
  const events = useRecoilValue(eventsAtom)
  const directions = useRecoilValue(directionsAtom)
  // const payments = useRecoilValue(paymentsAtom)
  // const closedPayments = useRecoilValue(allPaymentsForClosedEventsSelector)
  // const closedEvents =
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

  const [filterUsers, setFilterUsers] = useState({
    status: {
      novice: true,
      member: true,
    },
  })

  const [filterEvents, setFilterEvents] = useState({
    status: {
      active: false,
      finished: true,
      canceled: false,
    },
  })

  const filteredUsers = useMemo(
    () => users.filter((user) => filterUsers.status[user.status ?? 'novice']),
    [users, filterUsers]
  )

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

  // const usersByDays = usersCountByDates()

  const mansCount = filteredUsers.filter(
    (user) => user.gender === 'male'
  ).length
  const womansCount = filteredUsers.filter(
    (user) => user.gender === 'famale'
  ).length
  const noGenderCount = filteredUsers.filter((user) => !user.gender).length

  const manColor = '#60a5fa'
  const womanColor = '#f87171'
  const noGenderColor = '#9ca3af'

  const usersByGenderData = [
    {
      id: 'Мужчины',
      label: 'Мужчины',
      value: mansCount,
      color: manColor,
    },
    {
      id: 'Женщины',
      label: 'Женщины',
      value: womansCount,
      color: womanColor,
    },
    {
      id: 'Пол не указан',
      label: 'Пол не указан',
      value: noGenderCount,
      color: noGenderColor,
    },
  ]

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

  const usersTitle = filterUsers.status.novice
    ? filterUsers.status.member
      ? 'Все'
      : 'Новички'
    : 'Участники клуба'

  return (
    <div className="flex flex-col flex-1 h-full max-w-full max-h-full min-h-full">
      <TabContext value="Мероприятия">
        <TabPanel tabName="Мероприятия" className="flex flex-col items-center">
          {/* <ListWrapper className="flex flex-col items-center w-full py-1"> */}

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

          {/* </ListWrapper> */}
        </TabPanel>
        <TabPanel tabName="Пользователи" className="flex flex-col items-center">
          {/* <ListWrapper className="flex flex-col items-center w-full py-1"> */}
          <div className="flex flex-col items-center w-[300px]">
            <H3>По полу</H3>
            <UsersFilter value={filterUsers} onChange={setFilterUsers} />
            <H4>{usersTitle}</H4>
            <PieChart data={usersByGenderData} />
          </div>
          <div className="flex flex-col items-center w-full">
            <H4>Показатели за последние 90 дней</H4>
            <P>
              {`с ${formatDate(
                new Date(
                  new Date().getTime() -
                    1000 * 3600 * 24 * 89 -
                    (new Date().getTime() % (1000 * 3600 * 24))
                )
              )} по ${formatDate(new Date())}`}
            </P>
            <StreamChart
              data={usersCountByDates(filteredUsers)}
              linesOnX={linesCFG()}
              colors={{
                mans: manColor,
                womans: womanColor,
                noGender: noGenderColor,
              }}
              labels={{
                mans: 'Мужчины',
                womans: 'Женщины',
                noGender: 'Пол не указан',
              }}
              axisBottom={false}
              axisLeft="Пользователей"
              legend={false}
              tooltipCaptions={tooltipCaptions()}
            />
          </div>
          {/* </ListWrapper> */}
        </TabPanel>
        <TabPanel
          tabName="Финансы"
          className="flex flex-col items-center pt-20"
        >
          <LineChart
            onClick={(point, event) => console.log({ point, event })}
            data={dataOfIncomeByDate}
            xAxisLegend="Месяц"
            yAxisLegend="Прибыль, ₽"
            // enableSlices="x"
            tooltip={(data) => {
              return (
                <div
                  style={{
                    background: 'white',
                    padding: '9px 12px',
                    border: '1px solid #ccc',
                  }}
                >
                  <div>{upperCaseFirst(MONTHS_FULL_1[data.point.index])}</div>
                  {/* {slice.points.map((point) => ( */}
                  <div
                    key={data.point.id}
                    style={{
                      color: data.point.serieColor,
                      padding: '3px 0',
                    }}
                  >
                    <strong>{data.point.serieId}</strong>
                    <span className="pl-2 text-black">{`${data.point.data.yFormatted} ₽`}</span>
                  </div>
                  {/* ))} */}
                </div>
              )
            }}
            // sliceTooltip={({ slice }) => {
            //   return (
            //     <div
            //       style={{
            //         background: 'white',
            //         padding: '9px 12px',
            //         border: '1px solid #ccc',
            //       }}
            //     >
            //       <div>
            //         {upperCaseFirst(
            //           MONTHS_FULL_1[slice.points[slice.points.length - 1].index]
            //         )}
            //       </div>
            //       {slice.points.map((point) => (
            //         <div
            //           key={point.id}
            //           style={{
            //             color: point.serieColor,
            //             padding: '3px 0',
            //           }}
            //         >
            //           <strong>{point.serieId}</strong>
            //           <span className="pl-2 text-black">{`${point.data.yFormatted} ₽`}</span>
            //         </div>
            //       ))}
            //     </div>
            //   )
            // }}
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            // yScale={{
            //   type: 'linear',
            //   stacked: true,
            // }}
            // xScale={{
            //   type: 'linear',
            //   min: 0,
            //   max: 'auto',
            // }}
            // axisLeft={{
            //   legend: 'Прибыль',
            //   legendOffset: -60,
            // }}
            // axisBottom={{
            //   legend: 'Месяц',
            //   legendOffset: 30,
            // }}
            // curve={select('curve', curveOptions, 'linear')}
          />
          {/* <MonthSelector month={month} onChange={setMonth} />
          <YearSelector year={year} onChange={setYear} /> */}
        </TabPanel>
      </TabContext>
    </div>
  )
}

export default StatisticsContent
