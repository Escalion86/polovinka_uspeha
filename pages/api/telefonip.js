// import getMinutesBetween from '@helpers/getMinutesBetween'
import phoneValidator from '@helpers/phoneValidator'
// import pinValidator from '@helpers/pinValidator'

import userRegisterTelegramNotification from '@server/userRegisterTelegramNotification'
import dbConnect from '@utils/dbConnect'

const token = process.env.TELEFONIP

// const fetchCode = async (phone) => {
//   const formatedPhone = '8' + String(phone).substring(1)
//   const response = await fetch(
//     `https://api.telefon-ip.ru/api/v1/authcalls/${token}/get_code/${formatedPhone}`,
//     { method: 'GET' }
//   ).then((response) => response.json())
//   return response
// }

// const sendCode = async (res, phone, tryNum = 1, update = false) => {
//   if (!phone)
//     return res?.status(200).json({
//       success: false,
//       data: {
//         error: {
//           message: 'Недостаточно параметров',
//           type: 'phone',
//         },
//       },
//     })
//   const response = await fetchCode(phone)
//   console.log('response', response)
//   if (response?.success) {
//     if (update) {
//       await db.model('PhoneConfirms').findOneAndUpdate(
//         { phone },
//         { tryNum, confirmed: false, code: response.data.code }
//       )
//     } else {
//       const newPhoneConfirm = await db.model('PhoneConfirms').create({
//         phone,
//         status: response.success,
//         code: response.data.code,
//         id: response.data.id,
//         confirmed: false,
//         tryNum,
//       })
//     }
//     return res?.status(201).json({
//       success: true,
//       data: {
//         status: response.success,
//         phone,
//         id: response.data.id,
//         confirmed: false,
//         tryNum,
//       },
//     })
//   } else {
//     return res?.status(200).json({
//       success: false,
//       data: {
//         error: {
//           message: `Не удалось отправить код на номер +${phone}. Ответ сервиса: ${response.error}`,
//           type: 'pinCode',
//         },
//       },
//     })
//   }
// }

export default async function handler(req, res) {
  const { query, method, body } = req

  if (method === 'POST') {
    try {
      console.log('body', body)
      const {
        phone,
        code,
        password,
        forgotPassword,
        get_balance,
        backCall,
        checkBackCallId,
        location,
      } = body

      const db = await dbConnect(location)
      if (!db)
        return res?.status(400).json({ success: false, error: 'db error' })

      if (checkBackCallId) {
        const response = await fetch(
          `https://api.telefon-ip.ru/api/v1/authcalls/${token}/reverse_auth_phone_check/${checkBackCallId}`,
          { method: 'GET' }
        ).then((response) => response.json())

        console.log('-----------response :>> ', response)
        if (response?.success) {
          var phone1 = String(response.data.phone).substring(1)
          var phone2 = String(phone).substring(1)
          if (phone1 === phone2) {
            await db
              .model('PhoneConfirms')
              .findOneAndUpdate({ phone }, { confirmed: true })
            // await db.model('PhoneConfirms').findOneAndDelete({ phone })
          }
        }

        return res?.status(201).json({
          success: true,
          data: response,
        })
      }

      if (get_balance) {
        const response = await fetch(
          `https://api.telefon-ip.ru/api/v1/authcalls/${token}/get_balance/`,
          { method: 'GET' }
        ).then((response) => response.json())
        return res?.status(201).json({
          success: true,
          data: response,
        })
      }

      if (!phone)
        return res?.status(200).json({
          success: false,
          data: {
            error: {
              message: 'Недостаточно параметров',
              type: 'phone',
            },
          },
        })

      if (!phoneValidator(phone))
        return res?.status(200).json({
          success: false,
          data: {
            error: {
              message: 'Телефон указан не верно',
              type: 'phone',
            },
          },
        })

      // Сначала проверяем - есть ли уже такой зарегистрированный номер?
      const existingUser = await db.model('Users').findOne({ phone })

      if (!forgotPassword && existingUser && existingUser.password) {
        return res?.status(200).json({
          success: false,
          data: {
            error: {
              message: 'Такой номер телефона уже зарегистрирован',
              type: 'phone',
              existingPhone: true,
            },
          },
        })
      }

      if (forgotPassword && !existingUser) {
        return res?.status(200).json({
          success: false,
          data: {
            error: {
              message: 'Такой номер телефона не зарегистрирован',
              type: 'phone',
              notExistingPhone: true,
            },
          },
        })
      }

      if (backCall) {
        var formatedPhone = '8' + String(phone).substring(1)
        const url = `https://api.telefon-ip.ru/api/v1/authcalls/${token}/reverse_auth_phone_get?phone=${formatedPhone}`
        const response = await fetch(url, { method: 'GET' }).then((response) =>
          response.json()
        )

        console.log('!!response', response)
        if (response?.success) {
          const phoneConfirm = await db
            .model('PhoneConfirms')
            .findOneAndUpdate(
              { phone },
              { callId: response.data.id },
              { upsert: true }
            )
          console.log('--------phoneConfirm:', phoneConfirm)
        }

        return res?.status(201).json({
          success: true,
          data: response,
        })
      }

      // Теперь проверяем есть ли уже запрос на подтверждение номера
      const existingPhoneConfirm = await db
        .model('PhoneConfirms')
        .findOne({ phone })
      // console.log('existingPhoneConfirm', existingPhoneConfirm)

      // TODO Временно удаленный код для смс авторизации
      // Если код уже был отправлен
      // if (!code && !password && existingPhoneConfirm) {
      //   // Если  код уже был отправлен, но идет запрос снова на отправку кода
      //   const minutesBeetween = getMinutesBetween(
      //     existingPhoneConfirm.updatedAt
      //   )
      //   // Смотрим как давно был отправлен код
      //   if (minutesBeetween < 1)
      //     return res?.status(200).json({
      //       success: false,
      //       data: {
      //         error: {
      //           message:
      //             'Код уже отправлен на номер +' +
      //             phone +
      //             '. Запрашивать код можно не чаще, чем раз в минуту',
      //           type: 'pinCode',
      //         },
      //       },
      //     })
      //   else {
      //     // Если более чем минуту назад был отправлен код
      //     // Смотрим какая это была попытка
      //     // Было уже сделано 3 попытки
      //     if (existingPhoneConfirm.tryNum >= 3) {
      //       // Прошло ли пол часа с момента последней попытки?
      //       if (minutesBeetween >= 30) {
      //         await sendCode(res, phone, 1, true)
      //         return
      //       } else
      //         return res?.status(200).json({
      //           success: false,
      //           data: {
      //             error: {
      //               message:
      //                 'Код уже отправлен на номер +' +
      //                 phone +
      //                 ' более 3 раз! Повторный запрос можно сделать через ' +
      //                 Math.ceil(30 - minutesBeetween) +
      //                 ' мин',
      //               type: 'pinCodeCountLimit',
      //             },
      //           },
      //         })
      //     } else {
      //       // Если было менее 3 попыток

      //       await sendCode(res, phone, 1, true)
      //       return
      //       // if (response?.success) {
      //       //   const newPhoneConfirm = await db.model('PhoneConfirms').findOneAndUpdate(
      //       //     { phone },
      //       //     {
      //       //       status: response.success,
      //       //       code: response.data.code,
      //       //       id: response.data.id,
      //       //       confirmed: false,
      //       //       tryNum: existingPhoneConfirm.tryNum + 1,
      //       //     }
      //       //   )
      //       //   return res?.status(201).json({
      //       //     success: true,
      //       //     data: {
      //       //       status: response.success,
      //       //       phone,
      //       //       id: response.data.id,
      //       //       confirmed: false,
      //       //       tryNum: newPhoneConfirm.tryNum,
      //       //     },
      //       //   })
      //       // } else {
      //       //   // if (response.code == 11 || response.code == 13) {
      //       //   //   await sendCode(
      //       //   //     res,
      //       //   //     phone,
      //       //   //     existingPhoneConfirm.tryNum + 1,
      //       //   //     true,
      //       //   //     existingPhoneConfirm.code
      //       //   //   )
      //       //   // } else
      //       //   return res?.status(200).json({
      //       //     success: false,
      //       //     data: {
      //       //       error: {
      //       //         message: 'Не удалось отправить код на номер +' + phone,
      //       //         type: 'pinCode',
      //       //       },
      //       //     },
      //       //   })
      //       // }
      //     }
      //   }
      // }

      // Если код уже подтвержден, то создаем пользователя
      console.log('password :>> ', password)
      console.log('existingPhoneConfirm :>> ', existingPhoneConfirm)
      if (password && existingPhoneConfirm?.confirmed === true) {
        console.log(1)
        await db.model('PhoneConfirms').findOneAndDelete({ phone })
        console.log(2)
        // Проверяем - возможно такой пользователь есть, просто у него не задан пароль
        if (existingUser && (!existingUser.password || forgotPassword)) {
          const updatedUser = await db
            .model('Users')
            .findOneAndUpdate({ phone }, { password })
          return res?.status(201).json({
            success: true,
            data: updatedUser,
          })
        } else {
          const newUser = await db.model('Users').create({ phone, password })
          await db.model('Histories').create({
            schema: 'users',
            action: 'add',
            data: newUser,
            userId: newUser._id,
          })
          await userRegisterTelegramNotification({ phone, location })

          return res?.status(201).json({
            success: true,
            data: newUser,
          })
        }
      }

      return res?.status(200).json({
        success: false,
        data: {
          error: {
            message: 'Неизвестная ошибка',
            type: 'unknown',
          },
        },
      })

      // TODO Временно удаленный код для смс авторизации
      // Если был также отправлен код, тоесть проверка
      // if (code) {
      //   if (!existingPhoneConfirm) {
      //     return res?.status(200).json({
      //       success: false,
      //       data: {
      //         error: {
      //           message:
      //             'Ошибка. Не найдена запись кода. Обратитесь к администратору',
      //           type: 'pinCode',
      //         },
      //       },
      //     })
      //   }
      //   if (!pinValidator(code) || existingPhoneConfirm.code !== code) {
      //     return res?.status(200).json({
      //       success: false,
      //       data: {
      //         error: {
      //           message: 'Ошибка. Неверный код',
      //           type: 'pinCode',
      //         },
      //       },
      //     })
      //   } else {
      //     await db.model('PhoneConfirms').findOneAndUpdate({ phone }, { confirmed: true })
      //     return res?.status(201).json({
      //       success: true,
      //       data: {
      //         status: true,
      //         phone,
      //         code,
      //         id: existingPhoneConfirm.id,
      //         confirmed: true,
      //       },
      //     })
      //   }
      // } else {
      //   await sendCode(res, phone, 1)
      //   return
      // }
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }
}
