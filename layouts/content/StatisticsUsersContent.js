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
import DatePicker from '@components/DatePicker'
import ListWrapper from '@layouts/lists/ListWrapper'
import { UserItemFromId } from '@components/ItemCards'
import modalsFuncAtom from '@state/modalsFuncAtom'
import ContentHeader from '@components/ContentHeader'
import LoadingSpinner from '@components/LoadingSpinner'
import useEventsUsersFull from '@helpers/useEventsUsersFull'

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

  const modalsFunc = useAtomValue(modalsFuncAtom)
  const users = useAtomValue(usersAtomAsync)
  const {
    eventsUsers,
    isLoading: isEventsUsersLoading,
    error: eventsUsersError,
  } = useEventsUsersFull()

  const [periodStart, setPeriodStart] = useState(addDaysToDate(serverDate, -90))
  const [periodEnd, setPeriodEnd] = useState(serverDate)

  const [filterUsers2, setFilterUsers2] = useState({
    gender: {
      male: true,
      famale: true,
      null: true,
    },
    status: {
      novice: true,
      member: true,
    },
    relationship: {
      havePartner: true,
      noPartner: true,
    },
  })

  const filteredEventsUsers = useMemo(
    () =>
      eventsUsers.filter((eventUser) => {
        if (!eventUser.event || !eventUser.user) return false
        if (
          !(
            (filterUsers2.gender[String(eventUser.user.gender)] ||
              (filterUsers2.gender.null &&
                eventUser.user.gender !== 'male' &&
                eventUser.user.gender !== 'famale')) &&
            filterUsers2.status[eventUser.user?.status ?? 'novice'] &&
            (eventUser.user.relationship
              ? filterUsers2.relationship.havePartner
              : filterUsers2.relationship.noPartner)
          )
        )
          return false

        return (
          getDiffBetweenDates(periodStart, eventUser.event.dateStart) > 0 &&
          getDiffBetweenDates(periodEnd, eventUser.event.dateEnd) < 0
        )
      }),
    [eventsUsers, periodStart, periodEnd, filterUsers2]
  )

  const usersIdsFromFilteredEventUsers = useMemo(() => {
    const usersIds = []
    const usersEventsCount = {}
    filteredEventsUsers.forEach((eventUser) => {
      usersIds.includes(eventUser.userId) || usersIds.push(eventUser.userId)
      usersEventsCount[eventUser.userId] =
        (usersEventsCount[eventUser.userId] || 0) + 1
    })
    const sortedUsersIds = usersIds.sort(
      (a, b) => usersEventsCount[b] - usersEventsCount[a]
    )
    return sortedUsersIds
  }, [filteredEventsUsers])

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

  if (isEventsUsersLoading) {
    return (
      <div className="flex items-center justify-center w-full py-10">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (eventsUsersError) {
    return (
      <div className="p-4">
        <P>
          Не удалось загрузить данные о посещениях. Попробуйте обновить страницу.
        </P>
      </div>
    )
  }

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
      <div className="flex flex-col items-center w-full">
        <H4>Пользователи по посещению за выбранный период</H4>
        <div className="flex items-center gap-x-1">
          <DatePicker
            label="От"
            value={periodStart}
            onChange={setPeriodStart}
            showYears
          />
          <DatePicker
            label="До"
            value={periodEnd}
            onChange={setPeriodEnd}
            showYears
          />
        </div>
        <ContentHeader>
          <UsersFilter value={filterUsers2} onChange={setFilterUsers2} />
        </ContentHeader>
        <div className="flex w-full max-h-100 min-h-100 justify-stretch">
          <ListWrapper
            // className="h-full"
            itemCount={usersIdsFromFilteredEventUsers.length}
            itemSize={43}
          >
            {({ index, style }) => (
              <div style={style} className="flex border-b border-gray-700">
                <UserItemFromId
                  key={usersIdsFromFilteredEventUsers[index]}
                  userId={usersIdsFromFilteredEventUsers[index]}
                  noBorder
                  onClick={() => {
                    console.log(
                      'object :>> ',
                      filteredEventsUsers.filter(
                        ({ userId }) =>
                          usersIdsFromFilteredEventUsers[index] === userId
                      )
                    )
                    modalsFunc.user.view(usersIdsFromFilteredEventUsers[index])
                  }}
                />
                <div className="flex items-center justify-center w-10 text-lg font-bold">
                  {
                    filteredEventsUsers.filter(
                      ({ userId }) =>
                        usersIdsFromFilteredEventUsers[index] === userId
                    ).length
                  }
                </div>
              </div>
            )}
          </ListWrapper>
        </div>
      </div>
    </div>
  )
}

export default StatisticsUsersContent
