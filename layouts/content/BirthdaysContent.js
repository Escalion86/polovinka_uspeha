import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import usersAtom from '@state/atoms/usersAtom'

import CardListWrapper from '@layouts/wrappers/CardListWrapper'
import UserCard from '@layouts/cards/UserCard'
import birthDateToAge from '@helpers/birthDateToAge'
import { SelectUserList } from '@components/SelectItemList'
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab'
import { timelineClasses } from '@mui/lab/Timeline'
import { timelineContentClasses } from '@mui/lab/TimelineContent'
import { timelineConnectorClasses } from '@mui/lab/TimelineConnector'
import { timelineDotClasses } from '@mui/lab/TimelineDot'
import { timelineItemClasses } from '@mui/lab/TimelineItem'
import { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent'
import formatDate from '@helpers/formatDate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBirthdayCake } from '@fortawesome/free-solid-svg-icons'
import getDaysFromNow from '@helpers/getDaysFromNow'
import ContentHeader from '@components/ContentHeader'
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material'
import { getNounBirthdays } from '@helpers/getNoun'

var daysBeforeBirthday = (birthday) => {
  if (!birthday) return undefined
  var today, bday, diff, days
  const [bDate, bTime] = birthday.split('T')
  const day = new Date(bDate).getDate() + (bTime !== '00:00:00.000Z' ? 1 : 0)
  const month = new Date(bDate).getMonth() + 1
  var now = new Date()
  today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  bday = new Date(today.getFullYear(), month - 1, day)
  if (today.getTime() > bday.getTime()) {
    bday.setFullYear(bday.getFullYear() + 1)
  }
  diff = bday.getTime() - today.getTime()
  days = Math.floor(diff / (1000 * 60 * 60 * 24))
  return days
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      // width: 200,
    },
  },
}

const BirthdaysContent = () => {
  const users = useRecoilValue(usersAtom)
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
    const beforeBirthday = daysBeforeBirthday(user.birthday)

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
            <FormControl
              sx={{ mt: 1, mb: 0.5, width: 200 }}
              size="small"
              margin="none"
            >
              <InputLabel id="demo-multiple-name-label">Период</InputLabel>
              <Select
                value={periodDays}
                onChange={(e) => setPeriodDays(e.target.value)}
                input={<OutlinedInput label="Период" />}
                MenuProps={MenuProps}
              >
                <MenuItem value={30}>1 месяц (30 дней)</MenuItem>
                <MenuItem value={60}>2 месяца (60 дней)</MenuItem>
                <MenuItem value={90}>3 месяца (90 дней)</MenuItem>
                <MenuItem value={180}>Пол года (180 дней)</MenuItem>
                <MenuItem value={365}>Год (365 дней)</MenuItem>
              </Select>
            </FormControl>
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
              var date = new Date()
              date.setDate(date.getDate() + index)
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
                        <span>({getDaysFromNow(date, true)})</span>
                      </div>
                      <div className="flex flex-col pb-2 gap-y-1">
                        {users.map((user) => (
                          <div key={user._id}>
                            <div className="flex px-1 text-sm gap-x-1">
                              <span>Исполнится</span>
                              <span>
                                {birthDateToAge(
                                  user.birthday,
                                  true,
                                  false,
                                  true,
                                  1
                                )}
                              </span>
                            </div>

                            <SelectUserList
                              // label="Участники Мужчины"
                              key={user._id}
                              usersId={[user._id]}
                              showCounter={false}
                              readOnly
                            />
                          </div>
                        ))}
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

export default BirthdaysContent
