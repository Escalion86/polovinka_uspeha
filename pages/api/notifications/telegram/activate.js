import Users from '@models/Users'
import dbConnect from '@utils/dbConnect'

export default async function handler(req, res) {
  const { query, method, body } = req
  //https://www.xn--80aaennmesfbiiz1a7a.xn--p1ai/api/notifications/telegram/activate
  await dbConnect()
  if (method === 'POST') {
    try {
      const { update_id, message } = body
      console.log('telegram body', body)
      if (message.text === '/activate' || message.text === '/deactivate') {
        const users = await Users.find({})
        console.log(
          'message.from.username.toLowerCase()',
          message.from.username.toLowerCase()
        )
        const userFromReq = users.find((user) => {
          return (
            user.notifications?.telegram?.userName &&
            user.notifications.telegram.userName.toLowerCase() ===
              message.from.username.toLowerCase()
          )
        })
        console.log('userFromReq', userFromReq)
        if (userFromReq) {
          const data = await Users.findByIdAndUpdate(userFromReq._id, {
            notifications: {
              ...userFromReq.notifications,
              telegram: {
                ...userFromReq.notifications.telegram,
                id: message.text === '/activate' ? message.from.id : null,
              },
            },
          })
          console.log('user updated', data)
          return res?.status(200).json({ success: true, data })
        }
        console.log('Пользователь с таким логином не найден')
        return res?.status(200).json({
          success: false,
          error: 'Пользователь с таким логином не найден',
        })
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
