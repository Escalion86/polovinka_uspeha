import birthDateToAge from '@helpers/birthDateToAge'
import { postData } from '@helpers/CRUD'
// import formatDate from '@helpers/formatDate'
import getUserFullName from '@helpers/getUserFullName'
import isUserAdmin from '@helpers/isUserAdmin'
import isUserQuestionnaireFilled from '@helpers/isUserQuestionnaireFilled'
import Histories from '@models/Histories'
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
          const clearedBody = { ...body.data }
          delete clearedBody._id
          data = await Schema.create(clearedBody)
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          await Histories.create({
            schema: Schema.collection.collectionName,
            action: 'add',
            data,
            userId: body.userId,
          })

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
          console.log('Schema', Schema.collection.collectionName)
          console.log('typeof', typeof Schema.collection.collectionName)
          if (!data) {
            return res?.status(400).json({ success: false })
          }

          // Если это пользователь обновляет анкету, то после обновления оповестим о результате через телеграм
          const afterUpdateNeedToNotificate =
            // body.userId === id &&
            Schema === Users && !isUserQuestionnaireFilled(data)

          data = await Schema.findByIdAndUpdate(id, body.data, {
            new: true,
            runValidators: true,
          })

          if (!data) {
            return res?.status(400).json({ success: false })
          }

          await Histories.create({
            schema: Schema.collection.collectionName,
            action: 'updete',
            data,
            userId: body.userId,
          })

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
                const fullUserName = getUserFullName(data)
                await postData(
                  `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
                  {
                    chat_id: telegramId,
                    text: `Пользователь с номером +${
                      data.phone
                    } заполнил анкету:\n - Полное имя: ${fullUserName}\n - Пол: ${
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
                  true,
                  null,
                  true
                )
                if (data.images && data.images[0]) {
                  await postData(
                    `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMediaGroup`,
                    {
                      chat_id: telegramId,
                      media: JSON.stringify(
                        data.images.map((photo) => {
                          return {
                            type: 'photo',
                            media: photo,
                            // caption: 'Наденька',
                            // "parse_mode": "optional (you can delete this parameter) the parse mode of the caption"
                          }
                        })
                      ),
                      // reply_markup:
                      //   req.headers.origin.substr(0, 5) === 'https'
                      //     ? JSON.stringify({
                      //         inline_keyboard: [
                      //           [
                      //             {
                      //               text: 'Открыть пользователя',
                      //               url: req.headers.origin + '/user/' + eventId,
                      //             },
                      //           ],
                      //         ],
                      //       })
                      //     : undefined,
                    },
                    (data) => console.log('data', data),
                    (data) => console.log('error', data),
                    true,
                    null,
                    true
                  )
                  // await postData(
                  //   `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendPhoto`,
                  //   {
                  //     chat_id: telegramId,
                  //     photo: data.images[0],
                  //     caption: fullUserName,
                  //     // reply_markup:
                  //     //   req.headers.origin.substr(0, 5) === 'https'
                  //     //     ? JSON.stringify({
                  //     //         inline_keyboard: [
                  //     //           [
                  //     //             {
                  //     //               text: 'Открыть пользователя',
                  //     //               url: req.headers.origin + '/user/' + eventId,
                  //     //             },
                  //     //           ],
                  //     //         ],
                  //     //       })
                  //     //     : undefined,
                  //   },
                  //   (data) => console.log('data', data),
                  //   (data) => console.log('error', data),
                  //   true
                  // )
                }
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
          await Histories.create({
            schema: Schema.collection.collectionName,
            action: 'updete',
            data,
            userId: body.userId,
          })
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
          await Histories.create({
            schema: Schema.collection.collectionName,
            action: 'updete',
            data,
            userId: body.userId,
          })
          return res?.status(200).json({ success: true, data })
        } else if (body?.params) {
          data = await Schema.deleteMany({
            _id: { $in: body.params },
          })
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          await Histories.create({
            schema: Schema.collection.collectionName,
            action: 'updete',
            data,
            userId: body.userId,
          })
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
