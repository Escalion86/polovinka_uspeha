import { UCALLER_VOICE } from '@helpers/constants'
import { postData } from '@helpers/CRUD'
import getMinutesBetween from '@helpers/getMinutesBetween'
import isUserAdmin from '@helpers/isUserAdmin'
import phoneValidator from '@helpers/phoneValidator'
import pinValidator from '@helpers/pinValidator'
import PhoneConfirms from '@models/PhoneConfirms'
import Users from '@models/Users'
import dbConnect from '@utils/dbConnect'

const key = process.env.UCALLER_KEY
const service_id = process.env.UCALLER_SERVICE_ID

const fetchUcallerCode = async (phone, code) =>
  await fetch(
    `https://api.ucaller.ru/v1.0/initCall?phone=${phone}${
      code ? '&code=' + code : ''
    }&key=${key}&service_id=${service_id}${UCALLER_VOICE ? '&voice=true' : ''}`,
    { method: 'GET' }
  ).then((response) => response.json())

const fetchUcallerCodeRepeat = async (uid) =>
  await fetch(
    `https://api.ucaller.ru/v1.0/initRepeat?uid=${uid}&key=${key}&service_id=${service_id}${
      UCALLER_VOICE ? '&voice=true' : ''
    }`,
    { method: 'GET' }
  ).then((response) => response.json())

const sendCode = async (res, phone, tryNum = 1, update = false, code) => {
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
  const response = await fetchUcallerCode(phone, code)

  if (response?.status) {
    if (update) {
      await PhoneConfirms.findOneAndUpdate(
        { phone },
        { tryNum, confirmed: false }
      )
    } else {
      const newPhoneConfirm = await PhoneConfirms.create({
        phone,
        status: response.status,
        code: response.code,
        ucaller_id: response.ucaller_id,
        confirmed: false,
        tryNum,
      })
    }
    return res?.status(201).json({
      success: true,
      data: {
        status: response.status,
        phone,
        ucaller_id: response.ucaller_id,
        confirmed: false,
        tryNum,
      },
    })
  } else {
    return res?.status(200).json({
      success: false,
      data: {
        error: {
          message: 'Не удалось отправить код на номер +' + phone,
          type: 'pinCode',
        },
      },
    })
  }
}

export default async function handler(req, res) {
  const { query, method, body } = req

  if (method === 'POST') {
    try {
      await dbConnect()

      const { phone, code, password, forgotPassword } = body

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
      const existingUser = await Users.findOne({ phone })
      if (!forgotPassword && existingUser && existingUser.password) {
        return res?.status(200).json({
          success: false,
          data: {
            error: {
              message: 'Такой номер телефона уже зарегистрирован',
              type: 'phone',
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
            },
          },
        })
      }

      // Теперь проверяем есть ли уже запрос на подтверждение номера
      const existingPhoneConfirm = await PhoneConfirms.findOne({ phone })

      // Если код уже был отправлен
      if (existingPhoneConfirm)
        if (!code && !password && existingPhoneConfirm) {
          // Если  код уже был отправлен, но идет запрос снова на отправку кода
          const minutesBeetween = getMinutesBetween(
            existingPhoneConfirm.updatedAt
          )
          // Смотрим как давно был отправлен код
          if (minutesBeetween < 1)
            return res?.status(200).json({
              success: false,
              data: {
                error: {
                  message:
                    'Код уже отправлен на номер +' +
                    phone +
                    '. Запрашивать код можно не чаще, чем раз в минуту',
                  type: 'pinCode',
                },
              },
            })
          else {
            // Если более чем минуту назад был отправлен код
            // Смотрим какая это была попытка
            // Было уже сделано 3 попытки
            if (existingPhoneConfirm.tryNum >= 3) {
              // Прошло ли пол часа с момента последней попытки?
              if (minutesBeetween >= 30) {
                // TODO Удаление старого запроса на код и составление нового
                await sendCode(res, phone, 1, true)
              } else
                return res?.status(200).json({
                  success: false,
                  data: {
                    error: {
                      message:
                        'Код уже отправлен на номер +' +
                        phone +
                        ' более 3 раз! Повторный запрос можно сделать через ' +
                        Math.ceil(30 - minutesBeetween) +
                        ' мин',
                      type: 'pinCodeCountLimit',
                    },
                  },
                })
            } else {
              // Если было менее 3 попыток
              // TODO Повторный запрос кода

              // await sendCode(
              //   res,
              //   phone,
              //   existingPhoneConfirm.tryNum + 1,
              //   true,
              //   existingPhoneConfirm.code
              // )

              const response = await fetchUcallerCodeRepeat(
                existingPhoneConfirm.ucaller_id
              )

              if (response.status) {
                const newPhoneConfirm = await PhoneConfirms.findOneAndUpdate(
                  { phone },
                  {
                    status: response.status,
                    code: response.code,
                    ucaller_id: response.ucaller_id,
                    confirmed: false,
                    tryNum: existingPhoneConfirm.tryNum + 1,
                  }
                )
                return res?.status(201).json({
                  success: true,
                  data: {
                    status: response.status,
                    phone,
                    ucaller_id: response.ucaller_id,
                    confirmed: false,
                    tryNum: newPhoneConfirm.tryNum,
                  },
                })
              } else {
                if (response.code == 11 || response.code == 13) {
                  await sendCode(
                    res,
                    phone,
                    existingPhoneConfirm.tryNum + 1,
                    true,
                    existingPhoneConfirm.code
                  )
                } else
                  return res?.status(200).json({
                    success: false,
                    data: {
                      error: {
                        message: 'Не удалось отправить код на номер +' + phone,
                        type: 'pinCode',
                      },
                    },
                  })
              }
            }
          }
        }

      // const res = await fetch('https://api.ucaller.ru/', {
      //   method: 'POST',
      //   headers: {
      //     // Accept: contentType,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ key:'SAsimce9yKmh3acFMHhkJrG9YS6xs3xY', servise_id:'620185' }),
      // })

      // Если код уже подтвержден, то создаем пользователя
      if (password && existingPhoneConfirm?.confirmed === true) {
        await PhoneConfirms.findOneAndDelete({ phone })

        // Проверяем - возможно такой пользователь есть, просто у него не задан пароль
        if (existingUser && (!existingUser.password || forgotPassword)) {
          const updatedUser = await Users.findOneAndUpdate(
            { phone },
            { password }
          )
          return res?.status(201).json({
            success: true,
            data: updatedUser,
          })
        } else {
          const newUser = await Users.create({ phone, password })

          const users = await Users.find({})
          const usersTelegramIds = users
            .filter(
              (user) =>
                isUserAdmin(user) &&
                user.notifications?.get('telegram').active &&
                user.notifications?.get('telegram')?.id
            )
            .map((user) => user.notifications?.get('telegram')?.id)
          await Promise.all(
            usersTelegramIds.map(async (telegramId) => {
              await postData(
                `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
                {
                  chat_id: telegramId,
                  text: `Зарегистрирован новый пользователь с телефонным номером +${phone}`,
                  parse_mode: 'html',
                },
                (data) => console.log('data', data),
                (data) => console.log('error', data),
                true
              )
            })
          )

          return res?.status(201).json({
            success: true,
            data: newUser,
          })
        }
      }

      // Если был также отправлен код, тоесть проверка
      if (code) {
        if (!existingPhoneConfirm) {
          return res?.status(200).json({
            success: false,
            data: {
              error: {
                message:
                  'Ошибка. Не найдена запись кода. Обратитесь к администратору',
                type: 'pinCode',
              },
            },
          })
        }
        if (!pinValidator(code) || existingPhoneConfirm.code !== code) {
          return res?.status(200).json({
            success: false,
            data: {
              error: {
                message: 'Ошибка. Неверный код',
                type: 'pinCode',
              },
            },
          })
        } else {
          await PhoneConfirms.findOneAndUpdate({ phone }, { confirmed: true })
          return res?.status(201).json({
            success: true,
            data: {
              status: true,
              phone,
              code,
              ucaller_id: existingPhoneConfirm.ucaller_id,
              confirmed: true,
            },
          })
        }
      } else {
        // const key = process.env.UCALLER_KEY
        // const service_id = process.env.UCALLER_SERVICE_ID
        // const phone2 = '79000000001' //'79138370020'
        // const code2 = null //'7542'
        // const voice = 'false'
        // const client = null //'nickname'
        await sendCode(res, phone, 1)

        //   const response = await fetchUcallerCode(phone)

        //   if (response.status) {
        //     const newPhoneConfirm = await PhoneConfirms.create({
        //       phone,
        //       status: response.status,
        //       code: response.code,
        //       ucaller_id: response.ucaller_id,
        //       confirmed: false,
        //     })
        //     return res?.status(201).json({
        //       success: true,
        //       data: {
        //         status: response.status,
        //         phone,
        //         ucaller_id: response.ucaller_id,
        //         confirmed: false,
        //       },
        //     })
        //   } else {
        //     return res?.status(200).json({
        //       success: false,
        //       data: {
        //         error: {
        //           message: 'Не удалось отправить код на номер +' + phone,
        //           type: 'pinCode',
        //         },
        //       },
        //     })
        //   }
      }

      // ' https://api.ucaller.ru/v1.0/initCall?phone=79001000010&code=1000&client=nickname&unique=f32d7ab0-2695-44ee-a20c-a34262a06b90&voice=true&key=<Секретный ключ вашего сервиса>&service_id=<Идентификатор сервиса>'

      // Сначала проверяем есть ли такой пользователь уже
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

      // return res
      //   ?.status(201)
      //   .json({ success: true, data: newEmailConfirmation })
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
