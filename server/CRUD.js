import birthDateToAge from '@helpers/birthDateToAge'
import { postData } from '@helpers/CRUD'
import formatDate from '@helpers/formatDate'
import getUserFullName from '@helpers/getUserFullName'
import isUserAdmin from '@helpers/isUserAdmin'
import isUserQuestionnaireFilled from '@helpers/isUserQuestionnaireFilled'
import Users from '@models/Users'
import dbConnect from '@utils/dbConnect'

export default async function handler(Schema, req, res, params = null) {
  const { query, method, body } = req

  const id = query?.id

  await dbConnect()

  let data
  console.log('Schema', Schema)
  console.log(`method`, method)
  console.log(`params`, params)
  console.log(`id`, id)
  console.log(`body`, body)

  switch (method) {
    case 'GET':
      try {
        if (params) {
          data = await Schema.find(params).select({ password: 0 })
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          return res?.status(200).json({ success: true, data })
        } else if (id) {
          data = await Schema.findById(id).select({ password: 0 })
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          return res?.status(200).json({ success: true, data })
        } else {
          data = await Schema.find().select({ password: 0 })
          return res?.status(200).json({ success: true, data })
        }
      } catch (error) {
        console.log(error)
        return res?.status(400).json({ success: false, error })
      }
      break
    case 'POST':
      try {
        if (id) {
          return res
            ?.status(400)
            .json({ success: false, error: 'No need to set Id' })
        } else {
          const clearedBody = { ...body }
          delete clearedBody._id
          data = await Schema.create(clearedBody)
          if (!data) {
            return res?.status(400).json({ success: false })
          }

          return res?.status(201).json({ success: true, data })
        }
      } catch (error) {
        console.log(error)
        return res?.status(400).json({ success: false, error })
      }
      break
    case 'PUT':
      try {
        if (id) {
          data = await Schema.findById(id)
          if (!data) {
            return res?.status(400).json({ success: false })
          }

          // Если это пользователь обновляет анкету, то после обновления оповестим о результате через телеграм
          const afterUpdateNeedToNotificate =
            Schema === Users && !isUserQuestionnaireFilled(data)

          data = await Schema.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
          })
          if (!data) {
            return res?.status(400).json({ success: false })
          }

          if (afterUpdateNeedToNotificate) {
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
                    text: `Пользователь с номером +${
                      data.phone
                    } заполнил анкету:\n - Полное имя: ${getUserFullName(
                      data
                    )}\n - Пол: ${
                      data.gender === 'male' ? 'Мужчина' : 'Женщина'
                    }\n - Дата рождения: ${birthDateToAge(
                      data.birthday,
                      true,
                      true,
                      true
                    )}`,
                    parse_mode: 'html',
                  },
                  (data) => console.log('data', data),
                  (data) => console.log('error', data),
                  true
                )
              })
            )
          }

          return res?.status(200).json({ success: true, data })
        } else {
          return res?.status(400).json({ success: false, error: 'No Id' })
        }
      } catch (error) {
        console.log(error)
        return res?.status(400).json({ success: false })
      }
      break
    case 'DELETE':
      try {
        if (params) {
          data = await Schema.deleteMany(params)
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          return res?.status(200).json({ success: true, data })
        } else if (id) {
          data = await Schema.findById(id)
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          data = await Schema.deleteOne({
            _id: id,
          })
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          return res?.status(200).json({ success: true, data })
        } else if (body?.params) {
          data = await Schema.deleteMany({
            _id: { $in: body.params },
          })
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          return res?.status(200).json({ success: true, data })
        } else {
          return res?.status(400).json({ success: false })
        }
      } catch (error) {
        console.log(error)
        return res?.status(400).json({ success: false, error })
      }
      break
    default:
      return res?.status(400).json({ success: false })
      break
  }
}
