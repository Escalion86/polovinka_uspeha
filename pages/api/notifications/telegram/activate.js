import formatDateTime from '@helpers/formatDateTime'
import Events from '@models/Events'
import Users from '@models/Users'
import sendTelegramMessage from '@server/sendTelegramMessage'
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
      // console.log('telegram body', body)
      if (callback_query?.data) {
        const cmdProps = JSON.parse(callback_query.data)
        if (typeof cmdProps === 'object') {
          const cmd = cmdProps.c
          if (cmd === 'eventSignIn') {
            const { eventId } = cmdProps
            console.log(
              'activate => callback_query.from :>> ',
              callback_query.from
            )
            const userTelegramId = callback_query.from.id
            const user = await Users.findOne({
              'notifications.telegram.id': userTelegramId,
            })
            console.log('activate => userId :>> ', user._id)
            if (!user)
              return res
                ?.status(400)
                .json({ success: false, error: 'Не найден пользователь' })

            const event = await Events.findOne({ _id: eventId })
            if (!event)
              return res
                ?.status(400)
                .json({ success: false, error: 'Не найдено мероприятие' })

            console.log('activate => eventId :>> ', event._id)

            const result = await userSignIn({
              req,
              res,
              userId: user._id,
              eventId,
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
            console.log('result :>> ', result)
            if (result.success) {
              text = `Вы успешно зарегистрировались ${
                result.data?.status === 'reserve' ? 'в РЕЗЕРВ ' : ''
              }на мероприятие "${event.title}" от ${formatDateTime(
                event.dateStart
              )}`
            } else {
              text = `ОШИБКА - ${result.data.error}`
            }
            await sendTelegramMessage({
              req,
              telegramIds: userTelegramId,
              text,
            })

            return result
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
        //     req,
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
              req,
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
          //     req,
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
          //   req,
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
