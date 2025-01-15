import birthDateToAge from '@helpers/birthDateToAge'
import { DEFAULT_ROLES, LOCATIONS_KEYS_VISIBLE } from '@helpers/constants'
// import formatDate from '@helpers/formatDate'
import getUserFullName from '@helpers/getUserFullName'
import padNum from '@helpers/padNum'
import textAge from '@helpers/textAge'
import RemindDates from '@models/RemindDates'
import Roles from '@models/Roles'
import Users from '@models/Users'
import { sendMessageWithRepeats } from '@server/sendTelegramMessage'
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

const yearsBeetwenDates = (date1, date2) => {
  const diff = new Date(date2) - new Date(date1)
  return Math.abs(new Date(diff).getUTCFullYear() - 1969)
}

export default async function handler(req, res) {
  const { query, method, body } = req
  if (method === 'GET') {
    if (query.start) {
      try {
        const dateTimeNow = new Date()
        const minutesNow = padNum(dateTimeNow.getMinutes(), 2)
        // if (!['00', '30'].includes(minutesNow))
        //   return res
        //     ?.status(200)
        //     .json({ success: true, data: 'minutes must be 00 or 30' })

        const hoursNow = padNum(dateTimeNow.getHours(), 2)

        const strTimeNow = `${hoursNow}:${minutesNow}`

        // locations.forEach(async (location) =>

        for (const location of LOCATIONS_KEYS_VISIBLE) {
          const db = await dbConnect(location)
          if (!db)
            return res?.status(400).json({ success: false, error: 'db error' })

          const rolesSettings = await Roles.find({}).lean()
          const allRoles = [...DEFAULT_ROLES, ...rolesSettings]
          const rolesIdsToNotification = allRoles
            .filter(
              (role) =>
                role?.notifications?.birthdays ||
                role?.notifications?.remindDates
            )
            .map((role) => role._id)

          const usersToNotificate = await Users.find({
            role:
              process.env.NODE_ENV === 'development'
                ? 'dev'
                : { $in: rolesIdsToNotification },

            $or: [
              { 'notifications.settings.birthdays': true },
              { 'notifications.settings.remindDates': true },
            ],
            'notifications.settings.time': strTimeNow,
            'notifications.telegram.active': true,
            'notifications.telegram.id': {
              $exists: true,
              $ne: null,
            },
          }).lean()

          // const usersToNotificate =
          //   usersWithTelegramNotificationsOfBirthday.filter(
          //     (user) => user.notifications?.settings?.time === strTimeNow
          //     //  &&
          //     // user.notifications?.get('settings')?.birthdays &&
          //     // user.notifications?.get('telegram')?.active &&
          //     // user.notifications?.get('telegram')?.id
          //   )
          if (usersToNotificate.length > 0) {
            const usersWithBirthDayToday = []
            const usersWithBirthDayTomorow = []
            const users = await Users.find({}).lean()
            users.forEach((user) => {
              if (!user.birthday) return
              const days = daysBeforeBirthday(user.birthday, dateTimeNow)
              if (days === 0) usersWithBirthDayToday.push(user)
              if (days === 1) usersWithBirthDayTomorow.push(user)
            })

            var birthdayText = '\u{1F382} <b>Дни рождения сегодня</b>: '
            if (usersWithBirthDayToday.length > 0) {
              usersWithBirthDayToday.forEach((user) => {
                birthdayText += `\n${
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
              birthdayText += 'Сегодня нет именинников'
            }

            birthdayText += '\n\n\u{1F382} <b>Дни рождения завтра</b>: '
            if (usersWithBirthDayTomorow.length > 0) {
              usersWithBirthDayTomorow.forEach((user) => {
                birthdayText += `\n${
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
              birthdayText += 'Завтра нет именинников'
            }

            const birthdayButton = [
              {
                text: '\u{1F382} Посмотреть дни рождения на сайте',
                url: process.env.DOMAIN + '/cabinet/birthdays', // req.headers.origin
              },
            ]

            const remindDatesToday = []
            const remindDatesTomorow = []
            const remindDates = await RemindDates.find({}).lean()
            remindDates.forEach((remindDate) => {
              const days = daysBeforeBirthday(remindDate.date, dateTimeNow)
              const years = yearsBeetwenDates(remindDate.date, dateTimeNow)
              if (days === 0) remindDatesToday.push({ ...remindDate, years })
              if (days === 1) remindDatesTomorow.push({ ...remindDate, years })
            })

            const remindDatesTextArray = []
            if (remindDatesToday.length > 0)
              remindDatesTextArray.push(
                '\u{2728} <b>События Половинки успеха сегодня</b>: ' +
                  remindDatesToday
                    .map(
                      ({ name, date, comment, years }) =>
                        `\n${name ? name : '[без названия]'} (${textAge(years, true)} назад)${comment ? ` - ${comment}` : ''}`
                    )
                    .join('')
              )
            if (remindDatesTomorow.length > 0)
              remindDatesTextArray.push(
                '\u{2728} <b>События Половинки успеха завтра</b>: ' +
                  remindDatesTomorow
                    .map(
                      ({ name, date, comment, years }) =>
                        `\n${name ? name : '[без названия]'} (${textAge(years, true)} назад)${comment ? ` - ${comment}` : ''}`
                    )
                    .join('')
              )
            // console.log('remindDatesTextArray :>> ', remindDatesTextArray)

            const remindDatesText = remindDatesTextArray.join('\n\n')

            // const telegramIds = usersToNotificate.map(
            //   (user) => user.notifications.telegram.id
            // )

            for (let index = 0; index < usersToNotificate.length; index++) {
              const { notifications } = usersToNotificate[index]
              const inline_keyboard = notifications.settings.birthdays
                ? [birthdayButton]
                : undefined
              const textArray = []
              if (notifications.settings.birthdays && birthdayText)
                textArray.push(birthdayText)
              if (notifications.settings.remindDates && remindDatesText)
                textArray.push(remindDatesText)
              const text = textArray.join('\n\n')
              if (textArray.length > 0) {
                const res = await sendMessageWithRepeats({
                  req,
                  telegramId: notifications.telegram.id,
                  text,
                  // images,
                  inline_keyboard,
                })
              }
            }

            // const data = await sendTelegramMessage({
            //   req,
            //   telegramIds,
            //   text,
            //   inline_keyboard,
            // })
          }
        }

        return res?.status(200).json({ success: true })
        // await dbConnect()
        // const rolesSettings = await Roles.find({}).lean()
        // const allRoles = [...DEFAULT_ROLES, ...rolesSettings]
        // const rolesIdsToNotification = allRoles
        //   .filter(
        //     (role) =>
        //       role?.notifications?.birthdays || role?.notifications?.remindDates
        //   )
        //   .map((role) => role._id)

        // const usersToNotificate = await Users.find({
        //   role:
        //     process.env.NODE_ENV === 'development'
        //       ? 'dev'
        //       : { $in: rolesIdsToNotification },

        //   $or: [
        //     { 'notifications.settings.birthdays': true },
        //     { 'notifications.settings.remindDates': true },
        //   ],
        //   'notifications.settings.time': strTimeNow,
        //   'notifications.telegram.active': true,
        //   'notifications.telegram.id': {
        //     $exists: true,
        //     $ne: null,
        //   },
        // }).lean()

        // // const usersToNotificate =
        // //   usersWithTelegramNotificationsOfBirthday.filter(
        // //     (user) => user.notifications?.settings?.time === strTimeNow
        // //     //  &&
        // //     // user.notifications?.get('settings')?.birthdays &&
        // //     // user.notifications?.get('telegram')?.active &&
        // //     // user.notifications?.get('telegram')?.id
        // //   )
        // if (usersToNotificate.length > 0) {
        //   const usersWithBirthDayToday = []
        //   const usersWithBirthDayTomorow = []
        //   const users = await Users.find({}).lean()
        //   users.forEach((user) => {
        //     if (!user.birthday) return
        //     const days = daysBeforeBirthday(user.birthday, dateTimeNow)
        //     if (days === 0) usersWithBirthDayToday.push(user)
        //     if (days === 1) usersWithBirthDayTomorow.push(user)
        //   })

        //   var birthdayText = '\u{1F382} <b>Дни рождения сегодня</b>: '
        //   if (usersWithBirthDayToday.length > 0) {
        //     usersWithBirthDayToday.forEach((user) => {
        //       birthdayText += `\n${
        //         user.gender === 'male' ? '♂️' : '♀️'
        //       } ${getUserFullName(user)} ${
        //         user.status === 'member' ? '(клуб) ' : ''
        //       }- ${birthDateToAge(
        //         user.birthday,
        //         dateTimeNow,
        //         true,
        //         false,
        //         true
        //       )}`
        //     })
        //   } else {
        //     birthdayText += 'Сегодня нет именинников'
        //   }

        //   birthdayText += '\n\n\u{1F382} <b>Дни рождения завтра</b>: '
        //   if (usersWithBirthDayTomorow.length > 0) {
        //     usersWithBirthDayTomorow.forEach((user) => {
        //       birthdayText += `\n${
        //         user.gender === 'male' ? '♂️' : '♀️'
        //       } ${getUserFullName(user)} ${
        //         user.status === 'member' ? '(клуб) ' : ''
        //       }- ${birthDateToAge(
        //         user.birthday,
        //         dateTimeNow,
        //         true,
        //         false,
        //         true
        //       )}`
        //     })
        //   } else {
        //     birthdayText += 'Завтра нет именинников'
        //   }

        //   const birthdayButton = [
        //     {
        //       text: '\u{1F382} Посмотреть дни рождения на сайте',
        //       url: process.env.DOMAIN + '/cabinet/birthdays', // req.headers.origin
        //     },
        //   ]

        //   const remindDatesToday = []
        //   const remindDatesTomorow = []
        //   const remindDates = await RemindDates.find({}).lean()
        //   remindDates.forEach((remindDate) => {
        //     const days = daysBeforeBirthday(remindDate.date, dateTimeNow)
        //     const years = yearsBeetwenDates(remindDate.date, dateTimeNow)
        //     if (days === 0) remindDatesToday.push({ ...remindDate, years })
        //     if (days === 1) remindDatesTomorow.push({ ...remindDate, years })
        //   })

        //   const remindDatesTextArray = []
        //   if (remindDatesToday.length > 0)
        //     remindDatesTextArray.push(
        //       '\u{2728} <b>События Половинки успеха сегодня</b>: ' +
        //         remindDatesToday
        //           .map(
        //             ({ name, date, comment, years }) =>
        //               `\n${name ? name : '[без названия]'} (${textAge(years, true)} назад)${comment ? ` - ${comment}` : ''}`
        //           )
        //           .join('')
        //     )
        //   if (remindDatesTomorow.length > 0)
        //     remindDatesTextArray.push(
        //       '\u{2728} <b>События Половинки успеха завтра</b>: ' +
        //         remindDatesTomorow
        //           .map(
        //             ({ name, date, comment, years }) =>
        //               `\n${name ? name : '[без названия]'} (${textAge(years, true)} назад)${comment ? ` - ${comment}` : ''}`
        //           )
        //           .join('')
        //     )
        //   console.log('remindDatesTextArray :>> ', remindDatesTextArray)

        //   const remindDatesText = remindDatesTextArray.join('\n\n')

        //   // const telegramIds = usersToNotificate.map(
        //   //   (user) => user.notifications.telegram.id
        //   // )

        //   for (let index = 0; index < usersToNotificate.length; index++) {
        //     const { notifications } = usersToNotificate[index]
        //     const inline_keyboard = notifications.settings.birthdays
        //       ? [birthdayButton]
        //       : undefined
        //     const textArray = []
        //     if (notifications.settings.birthdays && birthdayText)
        //       textArray.push(birthdayText)
        //     if (notifications.settings.remindDates && remindDatesText)
        //       textArray.push(remindDatesText)
        //     const text = textArray.join('\n\n')
        //     if (textArray.length > 0) {
        //       const res = await sendMessageWithRepeats({
        //         req,
        //         telegramId: notifications.telegram.id,
        //         text,
        //         // images,
        //         inline_keyboard,
        //       })
        //     }
        //   }

        //   // const data = await sendTelegramMessage({
        //   //   req,
        //   //   telegramIds,
        //   //   text,
        //   //   inline_keyboard,
        //   // })
        //   return res?.status(200).json({ success: true })
        // }

        // return res
        //   ?.status(200)
        //   .json({ success: true, data: 'no users to notificate' })
      } catch (error) {
        console.log(error)
        return res?.status(400).json({ success: false, error })
      }
    }

    return res?.status(400).json({ success: false, error: 'no start cmd' })
  }
  return res?.status(400).json({ success: false, error: 'wrong method' })
}
