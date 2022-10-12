import { useRecoilValue } from 'recoil'
import usersAtom from '@state/atoms/usersAtom'
import PieChart from '@components/Charts/PieChart'
import { useMemo, useState } from 'react'
import UsersFilter from '@components/Filter/UsersFilter'
import { H3, H4 } from '@components/tags'
import eventsAtom from '@state/atoms/eventsAtom'
import eventStatus from '@helpers/eventStatus'

const StatisticsContent = () => {
  const users = useRecoilValue(usersAtom)
  const events = useRecoilValue(eventsAtom)

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

  const usersData = [
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

  const eventsData = [
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

  const usersTitle = filterUsers.status.novice
    ? filterUsers.status.member
      ? 'Все'
      : 'Новички'
    : 'Участники клуба'

  return (
    <div className="flex flex-col items-center w-full my-2 gap-y-4">
      <div className="flex flex-col items-center w-[300px]">
        <H3>Пользователи</H3>
        <UsersFilter value={filterUsers} onChange={setFilterUsers} />
        <H4>{usersTitle}</H4>
        <PieChart data={usersData} />
      </div>
      <PieChart data={eventsData} title="Мероприятия" />
    </div>
  )
}

export default StatisticsContent
