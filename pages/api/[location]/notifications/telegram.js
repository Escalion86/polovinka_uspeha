import formatDateTime from '@helpers/formatDateTime'
import isEventCanceled from '@helpers/isEventCanceled'
import isEventClosed from '@helpers/isEventClosed'

import checkLocationValid from '@server/checkLocationValid'
import isEventExpired from '@server/isEventExpired'
import sendTelegramMessage from '@server/sendTelegramMessage'
import { telegramCmdToIndex, telegramIndexToCmd } from '@server/telegramCmd'
import userSignIn from '@server/userSignIn'
import dbConnect from '@utils/dbConnect'

export default async function handler(req, res) {
  const { query, method, body } = req

  const location = query?.location
  if (!location)
    return res?.status(400).json({ success: false, error: 'No location' })

  if (!checkLocationValid(location))
    return res?.status(400).json({ success: false, error: 'Invalid location' })

  //https://www.xn--80aaennmesfbiiz1a7a.xn--p1ai/api/notifications/telegram/activate
  const db = await dbConnect(location)
  if (!db) return res?.status(400).json({ success: false, error: 'db error' })

  if (method === 'POST') {
    try {
      delete query.location
      // console.log(body)
      const { update_id, message, callback_query } = body
      if (callback_query?.data) {
        console.log('!!!telegram callback_query recived:>> ')
        const cmdProps = JSON.parse(callback_query.data)
        console.log('cmdProps :>> ', cmdProps)
        if (typeof cmdProps === 'object') {
          const cmd = telegramIndexToCmd(cmdProps.c)
          console.log('cmd :>> ', cmd)
          if (cmd === 'eventSignIn') {
            const { eventId, subEventId } = cmdProps
            const userTelegramId = callback_query.from.id

            // TODO Удалить после исправления записи через телеграм
            // ---------------------------------------
            // if (userTelegramId != 261102161) {
            //   await sendTelegramMessage({
            //     telegramIds: userTelegramId,
            //     text: 'Запись через телеграм временно не работает. Пожалуйста запишитесь через сайт!',
            //     location,
            //   })

            //   return res?.status(201).json({ success: true })
            // }
            // ---------------------------------------

            const user = await db.model('Users').findOne({
              'notifications.telegram.id': userTelegramId,
            })

            const sendErrorMessage = async (text) => {
              await sendTelegramMessage({
                telegramIds: userTelegramId,
                text,
                location,
              })

              return res?.status(400).json({ success: false, error: text })
            }

            if (!user) {
              return sendErrorMessage('Ошибка определения пользователя')
            }

            const event = await db
              .model('Events')
              .findOne(
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

              const text =
                'На мероприятие возможно записаться разными вариантами. Выберите вариант:'
              sendTelegramMessage({
                telegramIds: userTelegramId,
                text,
                inline_keyboard,
                location,
              })

              return res?.status(201).json({ success: true })
            }

            const subEvent = subEventId
              ? event.subEvents.find(({ id }) => subEventId === id)
              : event.subEvents[0]

            const result = await userSignIn({
              req,
              res,
              userId: user._id,
              eventId: event._id,
              subEventId: subEvent.id,
              autoReserve: true,
              location,
            })

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
              location,
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
        if (['/start', '/activate', '/deactivate'].includes(message.text)) {
          const isActivation = ['/activate', '/start'].includes(message.text)

          if (isActivation) {
            await sendTelegramMessage({
              telegramIds: message.from.id,
              text: `Ваш Telegram ID <code>${message.from.id}</code>\n(нажмите на код, чтобы скопировать его)\n\nУкажите его на сайте Половинкауспеха.рф в разделе "Мой профиль" => "Оповещения"`,
              location,
            })

            return res?.status(200).json({ success: true })
          }
        }
      }

      return res?.status(200).json({ success: true })
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }

  return res?.status(400).json({ success: false, error: 'wrong method' })
}
