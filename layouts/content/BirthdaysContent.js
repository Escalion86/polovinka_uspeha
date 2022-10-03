import { useRecoilValue } from 'recoil'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'
import usersAtom from '@state/atoms/usersAtom'
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

var daysBeforeBirthday = (birthday) => {
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

const BirthdaysContent = () => {
  const users = useRecoilValue(usersAtom)

  // const usersBirthday = users.map((user) => ({
  //   user,
  //   daysBeforeBirthday: daysBeforeBirthday(user.birthday),
  // }))
  // const sortedAndFilteredUsers = [...usersBirthday].sort((a, b) =>
  //   a.daysBeforeBirthday < b.daysBeforeBirthday ? -1 : 1
  // ).filter((userBirthday) => userBirthday.daysBeforeBirthday < 30)
  const array = new Array(30).fill(0).map((arr) => [])
  var lastIndex = 0

  users.forEach((user) => {
    const beforeBirthday = daysBeforeBirthday(user.birthday)

    if (beforeBirthday < 30) {
      array[beforeBirthday].push(user)
      if (lastIndex < beforeBirthday) lastIndex = beforeBirthday
    }
  })

  return (
    <>
      {/* <CardListWrapper> */}
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
                    style={{ paddingLeft: 0, paddingRight: 0, marginTop: 1 }}
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
                  <div className="flex flex-col gap-y-1">
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
      {/* </CardListWrapper> */}
    </>
  )
}

export default BirthdaysContent
