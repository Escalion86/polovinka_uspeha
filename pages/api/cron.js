import birthDateToAge from '@helpers/birthDateToAge'
import getUserFullName from '@helpers/getUserFullName'
import isUserModer from '@helpers/isUserModer'
import padNum from '@helpers/padNum'
import Users from '@models/Users'
import sendTelegramMessage from '@server/sendTelegramMessage'
import dbConnect from '@utils/dbConnect'

var daysBeforeBirthday = (birthday, dateNow = new Date()) => {
  if (!birthday) return undefined
  var today, bday, diff, days

  const bDate = new Date(birthday)
  const tempDateNow = dateNow
  today = new Date(
    tempDateNow.getFullYear(),
    tempDateNow.getMonth(),
    tempDateNow.getDate()
  )
  bday = new Date(today.getFullYear(), bDate.getMonth(), bDate.getDate())

  if (today.getTime() > bday.getTime()) {
    bday.setFullYear(bday.getFullYear() + 1)
  }
  diff = bday.getTime() - today.getTime()
  days = Math.floor(diff / (1000 * 60 * 60 * 24))
  return days
}

export default async function handler(req, res) {
  const { query, method, body } = req
  if (method === 'GET') {
    if (query.start) {
      try {
        const dateTimeNow = new Date()
        const minutesNow = dateTimeNow.getMinutes()
        const hoursNow = dateTimeNow.getHours()

        await dbConnect()
        const users = await Users.find({})

        const strTimeNow = `${padNum(hoursNow, 2)}:${padNum(minutesNow, 2)}`

        const usersToNotificate = users.filter(
          (user) =>
            isUserModer(user) &&
            user.notifications?.get('settings')?.time === strTimeNow &&
            user.notifications?.get('settings')?.birthdays &&
            user.notifications?.get('telegram')?.active &&
            user.notifications?.get('telegram')?.id
        )
        if (usersToNotificate.length > 0) {
          const usersWithBirthDayToday = users.filter((user) => {
            return (
              user.birthday &&
              daysBeforeBirthday(user.birthday, dateTimeNow) === 0
            )
          })

          var text = '<b>Дни рождения сегодня</b>: '
          if (usersWithBirthDayToday.length > 0) {
            usersWithBirthDayToday.forEach((user) => {
              text += `\n${
                user.gender === 'male' ? '♂️' : '♀️'
              } ${getUserFullName(user)} ${
                user.status === 'member' ? '(клуб) ' : ''
              }- ${birthDateToAge(
                user.birthday,
                dateTimeNow,
                true,
                false,
                true
              )}`
            })
          } else {
            text += 'Сегодня нет именинников'
          }
          const telegramIds = usersToNotificate.map(
            (user) => user.notifications.get('telegram').id
          )

          const inline_keyboard = [
            [
              {
                text: '\u{1F382} Посмотреть дни рождения на сайте',
                url: req.headers.origin + '/cabinet/birthdays',
              },
            ],
          ]
          const data = await sendTelegramMessage({
            req,
            telegramIds,
            text,
            inline_keyboard,
          })
          return res?.status(200).json({ success: true })
        }
        return res
          ?.status(200)
          .json({ success: true, data: 'no users to notificate' })
      } catch (error) {
        console.log(error)
        return res?.status(400).json({ success: false, error })
      }
    }
  }
  return res?.status(400).json({ success: false, error: 'wrong method' })
}
