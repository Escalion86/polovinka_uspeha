import formatDateTime from '@helpers/formatDateTime'
import isEventCanceled from '@helpers/isEventCanceled'
import isEventClosed from '@helpers/isEventClosed'
import Events from '@models/Events'
import Users from '@models/Users'
import isEventExpired from '@server/isEventExpired'
import sendTelegramMessage from '@server/sendTelegramMessage'
import { telegramCmdToIndex, telegramIndexToCmd } from '@server/telegramCmd'
import userSignIn from '@server/userSignIn'
import dbConnect from '@utils/dbConnect'

export default async function handler(req, res) {
  const { query, method, body } = req
  //https://www.xn--80aaennmesfbiiz1a7a.xn--p1ai/api/notifications/telegram/activate
  await dbConnect()
  if (method === 'POST') {
    try {
      // console.log(body)
      const { update_id, message, callback_query } = body
      if (callback_query?.data) {
        const cmdProps = JSON.parse(callback_query.data)
        if (typeof cmdProps === 'object') {
          const cmd = telegramIndexToCmd(cmdProps.c)
          if (cmd === 'eventSignIn') {
            const { eventId, subEventId } = cmdProps
            const userTelegramId = callback_query.from.id

            // TODO Удалить после исправления записи через телеграм
            // ---------------------------------------
            if (userTelegramId != 261102161) {
              await sendTelegramMessage({
                telegramIds: userTelegramId,
                text: 'Запись через телеграм временно не работает. Пожалуйста запишитесь через сайт!',
              })

              return res?.status(201).json({ success: true })
            }
            // ---------------------------------------

            const user = await Users.findOne({
              'notifications.telegram.id': userTelegramId,
            })

            const sendErrorMessage = async (text) => {
              await sendTelegramMessage({
                telegramIds: userTelegramId,
                text,
              })

              return res?.status(400).json({ success: false, error: text })
            }

            if (!user) {
              return sendErrorMessage('Ошибка определения пользователя')
            }

            const event = await Events.findOne(
              subEventId ? { 'subEvents.id': subEventId } : { _id: eventId }
            )

            if (!event || !event.showOnSite) {
              return await sendErrorMessage(
                'Не найдено мероприятие. Возможно оно было удалено или скрыто'
              )
            }

            if (event.blank) {
              return await sendErrorMessage(
                'Это пустое мероприятие. На него невозможно записаться'
              )
            }

            if (isEventCanceled(event)) {
              return await sendErrorMessage('Мероприятие отменено')
            }

            if (isEventExpired(event)) {
              return await sendErrorMessage('Мероприятие завершено')
            }

            if (isEventClosed(event)) {
              return await sendErrorMessage('Мероприятие закрыто')
            }

            if (!subEventId && event.subEvents.length > 1) {
              const inline_keyboard = event.subEvents.map(
                ({ title, id }, index) => [
                  {
                    text: title,
                    callback_data: JSON.stringify({
                      c: telegramCmdToIndex('eventSignIn'),
                      // eventId: event._id,
                      subEventId: id,
                    }),
                  },
                ]
              )

              // const inline_keyboard = [
              //   [
              //     {
              //       text: '\u{1F4C5} На сайте',
              //       url: process.env.DOMAIN + '/event/' + String(event._id),
              //     },
              //     // TODO Исправить запись через телеграм
              //     {
              //       text: '\u{1F4DD} Записаться',
              //       callback_data: JSON.stringify({
              //         c: telegramCmdToIndex('eventSignIn'),
              //         eventId: event._id,
              //       }),
              //     },
              //   ],
              // ]

              const text =
                'На мероприятие возможно записаться разными вариантами. Выберите вариант:'
              sendTelegramMessage({
                telegramIds: userTelegramId,
                text,
                inline_keyboard,
              })

              return res?.status(201).json({ success: true })
            }

            const subEvent = subEventId
              ? event.subEvents.find(({ id }) => subEventId === id)
              : event.subEvents[0]
            // console.log('subEventId :>> ', subEventId)
            // console.log('subEvent :>> ', subEvent)
            const result = await userSignIn({
              req,
              res,
              userId: user._id,
              eventId: event._id,
              subEventId: subEvent.id,
              autoReserve: true,
            })
            // {
            //   "success": true,
            //   "data": {
            //     "eventId": "6511cf3dde0316d770a00fc1",
            //     "userId": "6252f733183ed7f8da6baa54",
            //     "status": "participant",
            //     "userStatus": "member",
            //     "eventSubtypeNum": 0,
            //     "comment": "",
            //     "_id": "6511d43ede0316d770a0108f",
            //     "createdAt": "2023-09-25T18:41:02.453Z",
            //     "updatedAt": "2023-09-25T18:41:02.453Z",
            //     "__v": 0
            //   }
            // }
            // {
            //   "success": false,
            //   "data": {
            //     "error": "вы уже зарегистрированы"
            //   }
            // }
            let text
            if (result.success) {
              text = `Вы успешно зарегистрировались ${
                result.data?.status === 'reserve' ? 'в РЕЗЕРВ ' : ''
              }на мероприятие\n"<b>${event.title}</b>" от ${formatDateTime(
                event.dateStart
              )}${event.subEvents.length > 1 ? `\n<b>Вариант участия</b>: ${subEvent.title}` : ''}`
            } else {
              text = `Не удалось записаться на мероприятие - ${result.data.error}`
            }

            await sendTelegramMessage({
              telegramIds: userTelegramId,
              text,
            })

            return res?.status(201).json({ success: true, data: result })
          }
        } else {
          return res
            ?.status(400)
            .json({ success: false, error: 'Ошибка команды' })
        }
      }
      if (message?.text) {
        // if (!message.from.username) {
        //   await sendTelegramMessage({
        //     telegramIds: message.from.id,
        //     text: 'Похоже, что вы не указали ник telegram на сайте половинкауспеха.рф .\n\nВозможно имя пользователя у вас не задано в самом telegram. Чтобы задать имя пользователя, зайдите в настройки telegram => Мой аккаунт => Имя пользователя и задайте имя',
        //   })
        //   return res?.status(200).json({
        //     success: false,
        //     error: 'Не указан ник',
        //   })
        // }
        if (['/start', '/activate', '/deactivate'].includes(message.text)) {
          // console.log('message.text', message.text)
          // const users = await Users.find({})
          // console.log('message.from.id', message.from.id)
          const isActivation = ['/activate', '/start'].includes(message.text)

          if (isActivation) {
            await sendTelegramMessage({
              telegramIds: message.from.id,
              text: `Ваш Telegram ID <code>${message.from.id}</code>\n(нажмите на код, чтобы скопировать его)\n\nУкажите его на сайте Половинкауспеха.рф в разделе "Мой профиль" => "Оповещения"`,
            })

            return res?.status(200).json({ success: true })
          }

          // const userFromReq = await Users.findOneAndUpdate(
          //   {
          //     'notifications.telegram.userName':
          //       message.from.username.toLowerCase(),
          //   },
          //   {
          //     $set: {
          //       'notifications.telegram.id': isActivation
          //         ? message.from.id
          //         : undefined,
          //       'notifications.telegram.active': isActivation,
          //       // $set: {
          //       //   'telegram.$.id':
          //       //     message.text === '/activate' ? message.from.id : null,
          //       // },
          //     },

          //     // notifications: {
          //     //   telegram: {
          //     //     id: message.text === '/activate' ? message.from.id : null,
          //     //   },
          //     //   // $set: {
          //     //   //   'telegram.$.id':
          //     //   //     message.text === '/activate' ? message.from.id : null,
          //     //   // },
          //     // },
          //     // notifications: {
          //     //   ...userFromReq[0].notifications,
          //     //   telegram: {
          //     //     ...userFromReq[0].notifications.telegram,
          //     //     id: message.text === '/activate' ? message.from.id : null,
          //     //   },
          //     // },
          //   }
          // )
          // console.log('userFromReq', userFromReq)
          // const userFromReq = users.find(
          //   (user) =>
          //     user.notifications?.get('telegram')?.userName &&
          //     user.notifications.get('telegram').userName.toLowerCase() ===
          //       message.from.username.toLowerCase()
          // )
          // if (userFromReq) {
          //   await sendTelegramMessage({
          //     telegramIds: message.from.id,
          //     text: isActivation
          //       ? 'Активация уведомлений прошла успешно!'
          //       : 'Уведомления отключены!',
          //   })
          //   // const data = await Users.findByIdAndUpdate(userFromReq[0]._id, {
          //   //   notifications: {
          //   //     ...userFromReq[0].notifications,
          //   //     telegram: {
          //   //       ...userFromReq[0].notifications.telegram,
          //   //       id: message.text === '/activate' ? message.from.id : null,
          //   //     },
          //   //   },
          //   // })
          //   return res?.status(200).json({ success: true, data: userFromReq })
          // }
          // await sendTelegramMessage({
          //   telegramIds: message.from.id,
          //   text: isActivation
          //     ? 'ОШИБКА! Активация уведомлений не удалась. Проверьте, что вы верно указали логин телеграм на сайте!'
          //     : 'ОШИБКА! Уведомления не отключены. Пожалуйста свяжитесь с администратором! http://t.me/escalion',
          // })
          // return res?.status(200).json({
          //   success: false,
          //   error: 'Пользователь с таким логином не найден',
          // })
        }
      }

      // // Сначала проверяем есть ли такой пользователь уже
      // const existingUser = await Users.findOne({ email })
      // if (existingUser) {
      //   return res
      //     ?.status(200)
      //     .json({ success: false, data: { error: 'User already registered' } })
      // }

      // // Теперь проверяем - возможно такая заявка уже есть, тогда сначала ее удаляем и создаем новую
      // await EmailConfirmations.deleteMany({ email })

      // // Создаем заявку
      // const newEmailConfirmation = await EmailConfirmations.create({
      //   email,
      //   password,
      //   token: uuid(),
      // })
      // if (!newEmailConfirmation) {
      //   return res?.status(400).json({
      //     success: false,
      //     data: { error: `Can't create emailConfirmation` },
      //   })
      // }

      // // Отправляем письмо
      // const urlToConfirm = `${process.env.NEXTAUTH_SITE}/emailconfirm?email=${newEmailConfirmation.email}&token=${newEmailConfirmation.token}`
      // const domenName = new URL(process.env.NEXTAUTH_SITE).hostname
      // const emailRes = await emailSend(
      //   newEmailConfirmation.email,
      //   `Подтверждение регистрации на ${domenName}`,
      //   `
      //   <h3><a href="${urlToConfirm}">Кликните по мне для завершения регистрации на ${domenName}</a></h3>
      // `
      // )

      // console.log('emailRes', emailRes)

      return res?.status(200).json({ success: true })
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }

  // if (method === 'GET') {
  //   const { email, token } = query
  //   if (!email)
  //     return res
  //       ?.status(400)
  //       .json({ success: false, error: 'Отсутствует email' })
  //   if (!token)
  //     return res
  //       ?.status(400)
  //       .json({ success: false, error: 'Отсутствует токен' })
  //   try {
  //     const data = await EmailConfirmations.findOne({ email, token })
  //     if (!data) {
  //       return res
  //         ?.status(400)
  //         .json({ success: false, error: 'Нет данных по токену' })
  //     }
  //     const newUser = await Users.create({
  //       email,
  //       password: data.password,
  //       name: '',
  //     })
  //     if (!newUser)
  //       return res
  //         ?.status(400)
  //         .json({ success: false, error: 'Не удалось создать пользователя' })

  //     return res?.status(201).json({ success: true, data: newUser })
  //   } catch (error) {
  //     console.log(error)
  //     return res?.status(400).json({ success: false, error })
  //   }
  // }
}
