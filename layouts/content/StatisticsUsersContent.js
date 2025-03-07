'use client'

import PieChart from '@components/Charts/PieChart'
import StreamChart from '@components/Charts/StreamChart'
import UsersFilter from '@components/Filter/UsersFilter'
import { H3, H4, P } from '@components/tags'
import formatDate from '@helpers/formatDate'
import getDaysBetween from '@helpers/getDaysBetween'
import getDiffBetweenDates from '@helpers/getDiffBetweenDates'
import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
import usersAtomAsync from '@state/async/usersAtomAsync'
import { useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'

const addDaysToDate = (date, days) => {
  if (days === 0) return date
  return new Date(date.getTime() + 1000 * 3600 * 24 * days)
}

const usersCountByDates = (users = [], dateNow = new Date(), days = 90) => {
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

const linesCFG = (dateNow = new Date()) => {
  const today = dateNow.setHours(0, 0, 0, 0)
  const dateToday = new Date(today)

  const arr = [{ index: 90 }, { index: 0 }]

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

const tooltipCaptions = (dateNow = new Date()) => {
  const arr = []
  for (let i = -90; i <= 0; i++) {
    arr.push(formatDate(addDaysToDate(dateNow, i)))
  }
  return arr
}

const StatisticsUsersContent = () => {
  const serverDate = new Date(useAtomValue(serverSettingsAtom)?.dateTime)
  const users = useAtomValue(usersAtomAsync)

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

  const usersTitle = filterUsers.status.novice
    ? filterUsers.status.member
      ? 'Все'
      : 'Новички'
    : 'Участники клуба'

  return (
    <div className="flex flex-col items-center p-2 overflow-y-auto">
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
              serverDate.getTime() -
                1000 * 3600 * 24 * 89 -
                (serverDate.getTime() % (1000 * 3600 * 24))
            )
          )} по ${formatDate(serverDate)}`}
        </P>
        <StreamChart
          data={usersCountByDates(filteredUsers, serverDate)}
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
          tooltipCaptions={tooltipCaptions(serverDate)}
        />
      </div>
    </div>
  )
}

export default StatisticsUsersContent
