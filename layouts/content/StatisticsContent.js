import { useRecoilValue } from 'recoil'
import usersAtom from '@state/atoms/usersAtom'
import PieChart from '@components/Charts/PieChart'
import { useMemo, useState } from 'react'
import UsersFilter from '@components/Filter/UsersFilter'
import { H3, H4 } from '@components/tags'
import eventsAtom from '@state/atoms/eventsAtom'
import eventStatus from '@helpers/eventStatus'
import ListWrapper from '@layouts/wrappers/ListWrapper'
import Divider from '@components/Divider'
import TabContext from '@components/Tabs/TabContext'
import TabPanel from '@components/Tabs/TabPanel'
import directionsAtom from '@state/atoms/directionsAtom'

const StatisticsContent = () => {
  const users = useRecoilValue(usersAtom)
  const events = useRecoilValue(eventsAtom)
  const directions = useRecoilValue(directionsAtom)

  const [filterUsers, setFilterUsers] = useState({
    status: {
      novice: true,
      member: true,
    },
  })

  const filteredUsers = useMemo(
    () => users.filter((user) => filterUsers.status[user.status ?? 'novice']),
    [users, filterUsers]
  )

  const mansCount = filteredUsers.filter(
    (user) => user.gender === 'male'
  ).length
  const womansCount = filteredUsers.filter(
    (user) => user.gender === 'famale'
  ).length
  const noGenderCount = filteredUsers.filter((user) => !user.gender).length

  const usersByGenderData = [
    {
      id: 'Мужчины',
      label: 'Мужчины',
      value: mansCount,
      color: '#60a5fa',
    },
    {
      id: 'Женщины',
      label: 'Женщины',
      value: womansCount,
      color: '#f87171',
    },
    {
      id: 'Пол не указан',
      label: 'Пол не указан',
      value: noGenderCount,
      color: '#9ca3af',
    },
  ]

  const finishedEventsCount = events.filter(
    (event) => eventStatus(event) === 'finished'
  ).length
  const activeEventsCount = events.filter((event) =>
    ['inProgress', 'active'].includes(eventStatus(event))
  ).length
  const canceledEventsCount = events.filter(
    (event) => eventStatus(event) === 'canceled'
  ).length

  const eventsByStatusData = [
    {
      id: 'Завершены',
      label: 'Завершены',
      value: finishedEventsCount,
      color: '#4ade80',
    },
    {
      id: 'Запланированы',
      label: 'Запланированы',
      value: activeEventsCount,
      color: '#60a5fa',
    },
    {
      id: 'Отменены',
      label: 'Отменены',
      value: canceledEventsCount,
      color: '#f87171',
    },
  ]

  const eventsByDirectionsData = directions.map((direction) => {
    const eventsInDirectionCount = events.filter(
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
          <PieChart data={eventsByDirectionsData} title="По направлениям" />
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
          {/* </ListWrapper> */}
        </TabPanel>
      </TabContext>
    </div>
  )
}

export default StatisticsContent
