import ComboBox from '@components/ComboBox'
import ContentHeader from '@components/ContentHeader'
import LoadingSpinner from '@components/LoadingSpinner'
import { SelectUserList } from '@components/SelectItemList'
import { faBirthdayCake } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import birthDateToAge from '@helpers/birthDateToAge'
import formatDate from '@helpers/formatDate'
import getDaysFromNow from '@helpers/getDaysFromNow'
import { getNounBirthdays } from '@helpers/getNoun'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab'
import { timelineItemClasses } from '@mui/lab/TimelineItem'
import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
import usersAtom from '@state/atoms/usersAtom'
import { Suspense, useState } from 'react'
import { useRecoilValue } from 'recoil'

var daysBeforeBirthday = (birthday, dateNow = new Date()) => {
  if (!birthday) return undefined
  var today, bday, diff, days
  const [bDate, bTime] = birthday.split('T')
  const day = new Date(bDate).getDate() + (bTime !== '00:00:00.000Z' ? 1 : 0)
  const month = new Date(bDate).getMonth() + 1
  const tempDateNow = dateNow
  today = new Date(
    tempDateNow.getFullYear(),
    tempDateNow.getMonth(),
    tempDateNow.getDate()
  )
  bday = new Date(today.getFullYear(), month - 1, day)
  if (today.getTime() > bday.getTime()) {
    bday.setFullYear(bday.getFullYear() + 1)
  }
  diff = bday.getTime() - today.getTime()
  days = Math.floor(diff / (1000 * 60 * 60 * 24))
  return days
}

// const ITEM_HEIGHT = 48
// const ITEM_PADDING_TOP = 8
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       // width: 200,
//     },
//   },
// }

const BirthdaysContentComponent = () => {
  const users = useRecoilValue(usersAtom)
  const serverDate = new Date(useRecoilValue(serverSettingsAtom)?.dateTime)
  const [periodDays, setPeriodDays] = useState(90)

  // const usersBirthday = users.map((user) => ({
  //   user,
  //   daysBeforeBirthday: daysBeforeBirthday(user.birthday),
  // }))
  // const sortedAndFilteredUsers = [...usersBirthday].sort((a, b) =>
  //   a.daysBeforeBirthday < b.daysBeforeBirthday ? -1 : 1
  // ).filter((userBirthday) => userBirthday.daysBeforeBirthday < 30)
  const array = new Array(periodDays).fill(0).map((arr) => [])
  var lastIndex = 0
  var birthdaysCount = 0

  users.forEach((user) => {
    const beforeBirthday = daysBeforeBirthday(user.birthday, serverDate)
    if (beforeBirthday < periodDays) {
      array[beforeBirthday].push(user)
      birthdaysCount++
      if (lastIndex < beforeBirthday) lastIndex = beforeBirthday
    }
  })

  return (
    <>
      <ContentHeader>
        <div className="flex flex-wrap items-center justify-start flex-1">
          <div className="flex flex-1 gap-x-2">
            <ComboBox
              label="Период"
              value={String(periodDays)}
              onChange={(value) => setPeriodDays(Number(value))}
              items={[
                { name: '1 месяц (30 дней)', value: 30 },
                { name: '2 месяца (60 дней)', value: 60 },
                { name: '3 месяца (90 дней)', value: 90 },
                { name: 'Пол года (180 дней)', value: 180 },
                { name: 'Год (365 дней)', value: 365 },
              ]}
              noMargin
              className="mt-1"
            />
          </div>
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounBirthdays(birthdaysCount)}
          </div>
        </div>
        {/* <div className="flex-1" /> */}
      </ContentHeader>
      <CardListWrapper>
        {birthdaysCount > 0 ? (
          <Timeline
            style={{ paddingLeft: 8, paddingRight: 8 }}
            sx={{
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
              },
              // [`& .${timelineContentClasses.root}`]: {
              //   paddingRight: 0,
              //   paddingLeft: 1.5,
              // },
            }}
          >
            {array.map((users, index) => {
              var date = new Date(serverDate)
              date.setDate(date.getDate() + index)
              const daysFromNow = getDaysFromNow(date, true)
              return (
                users.length > 0 && (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <TimelineDot
                        className="flex items-center justify-center w-7 h-7"
                        style={{
                          paddingLeft: 0,
                          paddingRight: 0,
                          marginTop: 1,
                        }}
                        color="success"
                      >
                        <div className="flex items-center justify-center w-4 h-4">
                          <FontAwesomeIcon icon={faBirthdayCake} size="1x" />
                        </div>
                      </TimelineDot>
                      {index < lastIndex && (
                        <TimelineConnector style={{ marginBottom: 8 }} />
                      )}
                    </TimelineSeparator>

                    <TimelineContent
                      className="flex flex-col"
                      style={{
                        paddingRight: 0,
                        paddingLeft: 8,
                        paddingTop: 0,
                        paddingBottom: 0,
                      }}
                    >
                      <div className="flex items-center h-8 gap-x-1">
                        <span className="font-bold">
                          {formatDate(date, false, true)}
                        </span>
                        <span>({daysFromNow})</span>
                      </div>
                      <div className="flex flex-col pb-2 gap-y-1">
                        {users.map((user) => {
                          const ages = birthDateToAge(
                            user.birthday,
                            date,
                            true,
                            false,
                            true
                          )
                          return (
                            <div key={user._id}>
                              <div className="flex px-1 text-sm gap-x-1">
                                <span>
                                  {daysFromNow === 'сегодня'
                                    ? 'Исполнилось'
                                    : 'Исполнится'}
                                </span>
                                <span>{ages}</span>
                              </div>

                              <SelectUserList
                                // label="Участники Мужчины"
                                key={user._id}
                                usersId={[user._id]}
                                showCounter={false}
                                readOnly
                              />
                            </div>
                          )
                        })}
                      </div>
                    </TimelineContent>
                  </TimelineItem>
                )
              )
            })}
          </Timeline>
        ) : (
          <div className="flex justify-center w-full px-2 text-center">
            {'В выбранный период дней рождения ни у кого не предвидится'}
          </div>
        )}
      </CardListWrapper>
    </>
  )
}

const BirthdaysContent = (props) => (
  <Suspense
    fallback={
      <div className="z-10 flex items-center justify-center h-full">
        <LoadingSpinner text="идет загрузка пользователей...." />
      </div>
    }
  >
    <BirthdaysContentComponent {...props} />
  </Suspense>
)

export default BirthdaysContent
