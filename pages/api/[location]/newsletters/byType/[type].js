import extractVariables from '@helpers/extractVariables'
import htmlToWhatsapp from '@helpers/htmlToWhatsapp'
import htmlToTelegram from '@helpers/htmlToTelegram'
import replaceVariableInTextTemplate from '@helpers/replaceVariableInTextTemplate'
import timeout from '@helpers/timoutPromise'
import checkLocationValid from '@server/checkLocationValid'
import { whatsappConstants } from '@server/constants'
import sendTelegramMessage from '@server/sendTelegramMessage'
import dbConnect from '@utils/dbConnect'
// import TurndownService from 'turndown'

function generateArray(n) {
  if (n === 0) {
    return Array(1)
  }
  if (n === 1) {
    return Array(2)
  } else {
    return [generateArray(n - 1), generateArray(n - 1)]
  }
}

function getText(variablesInMessage, userVariables, messageArray, message) {
  if (!variablesInMessage?.length) return message
  let current = messageArray

  // Проходим по всем ключам, кроме последнего
  for (let i = 0; i < variablesInMessage.length - 1; i++) {
    const key = variablesInMessage[i]
    const index = userVariables[key] ? 1 : 0
    current = current[index]
  }

  // Обрабатываем последний ключ
  const lastKey = variablesInMessage[variablesInMessage.length - 1]
  const lastIndex = userVariables[lastKey] ? 1 : 0

  // Если значение не сгенерировано ранее, задаем его
  if (!current[lastIndex]) {
    current[lastIndex] = replaceVariableInTextTemplate(message, userVariables)
  }

  return current[lastIndex]
}

export default async function handler(req, res) {
  const { query, method, body } = req

  const location = query?.location
  if (!location)
    return res?.status(400).json({ success: false, error: 'No location' })

  if (!checkLocationValid(location))
    return res?.status(400).json({ success: false, error: 'Invalid location' })

  const type = query?.type
  if (!type) return res?.status(400).json({ success: false, error: 'No type' })

  const { urlWithInstance, token } = whatsappConstants[location]

  if (method === 'POST') {
    if (type === 'sendMessage') {
      const { name, usersMessages, message, sendType } = body.data
      const db = await dbConnect(location)
      if (!db)
        return res?.status(400).json({ success: false, error: 'db error' })

      // var turndownService = new TurndownService()
      // var markdownMessage = turndownService.turndown(
      //   message.replaceAll('-', '—').replaceAll('*', '⚹')
      // )

      const whatsappMessage = htmlToWhatsapp(message)
      const telegramMessage = htmlToTelegram(message)

      const urlSend = `${urlWithInstance}/sendMessage/${token}`
      // const urlCheckWhatsapp = `${urlWithInstance}/checkWhatsapp/${token}`

      // const prepearedText = DOMPurify.sanitize(html, {
      //   ALLOWED_TAGS: ['em'],
      //   ALLOWED_ATTR: [],
      // })

      const variablesInMessage = extractVariables(telegramMessage)

      const messageArray = generateArray(variablesInMessage.length)
      const messageArrayTelegram = generateArray(variablesInMessage.length)

      const normalizedSendType = (sendType || 'whatsapp-only').toLowerCase()

      const sendWhatsapp = async (whatsappPhone, messageToSend) => {
        if (!whatsappPhone)
          return { success: false, error: 'no whatsapp phone number' }

        const respSend = await fetch(urlSend, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId: `${whatsappPhone}@c.us`,
            message: messageToSend,
          }),
        })

        if (respSend) {
          const respSendJson = await respSend.json()
          return {
            success: true,
            messageId: respSendJson?.idMessage,
          }
        }

        return { success: false, error: 'no response' }
      }

      const sendTelegram = async (telegramId, messageToSend) => {
        if (!telegramId) return { success: false, error: 'no telegram id' }

        const telegramResult = await sendTelegramMessage({
          telegramIds: telegramId,
          text: messageToSend,
          location,
        })

        const success = telegramResult?.successCount > 0
        const messageId =
          telegramResult?.successes?.[0]?.result?.[0]?.result?.result
            ?.message_id ||
          telegramResult?.successes?.[0]?.result?.[0]?.result?.message_id

        const errorText = telegramResult?.errors?.[0]
          ? typeof telegramResult.errors[0] === 'string'
            ? telegramResult.errors[0]
            : JSON.stringify(telegramResult.errors[0])
          : undefined

        return {
          success,
          messageId,
          error: success ? undefined : errorText,
        }
      }

      const result = []

      try {
        for (let i = 0; i < usersMessages.length; i++) {
          const { whatsappPhone, telegramId, userId, variables } =
            usersMessages[i]

          let resultJson = {}

          const messageToSendWhatsapp = getText(
            variablesInMessage,
            variables,
            messageArray,
            whatsappMessage
          )

          const messageToSendTelegram = getText(
            variablesInMessage,
            variables,
            messageArrayTelegram,
            telegramMessage
          )

          // // const message = messageArray[variablesInMessage]
          // console.log('variablesInMessage :>> ', variablesInMessage)
          // console.log('variables :>> ', variables)
          // console.log('messageArray1 :>> ', messageArray)
          // console.log(
          //   'gettext',
          //   getText(variablesInMessage, variables, messageArray, markdown)
          // )
          // console.log('messageArray', messageArray)

          // continue

          // Если отправляем через WhatsApp
          // if (whatsappMessage) {
          //   const respCheckWhatsapp = await fetch(urlCheckWhatsapp, {
          //     method: 'POST',
          //     headers: {
          //       'Content-Type': 'application/json',
          //     },
          //     body: JSON.stringify({
          //       phoneNumber: whatsappPhone,
          //     }),
          //   })
          // if (!respCheckWhatsapp) {
          //   resultJson = {
          //     userId,
          //     whatsappMessage,
          //     whatsappSuccess: false,
          //     whatsappError: 'checkWhatsapp error',
          //   }
          // } else {
          // const respCheckWhatsappJson = await respCheckWhatsapp.json()
          // if (!respCheckWhatsappJson.existsWhatsapp) {
          //   resultJson = {
          //     userId,
          //     whatsappMessage,
          //     whatsappSuccess: false,
          //     whatsappError: 'no whatsapp on number',
          //   }
          // } else {
          let telegramResult
          let whatsappResult

          switch (normalizedSendType) {
            case 'telegram-only':
              telegramResult = await sendTelegram(
                telegramId,
                messageToSendTelegram
              )
              break
            case 'telegram-first':
              telegramResult = await sendTelegram(
                telegramId,
                messageToSendTelegram
              )
              if (!telegramResult?.success) {
                whatsappResult = await sendWhatsapp(
                  whatsappPhone,
                  messageToSendWhatsapp
                )
              }
              break
            case 'both':
              telegramResult = await sendTelegram(
                telegramId,
                messageToSendTelegram
              )
              whatsappResult = await sendWhatsapp(
                whatsappPhone,
                messageToSendWhatsapp
              )
              break
            default:
              whatsappResult = await sendWhatsapp(
                whatsappPhone,
                messageToSendWhatsapp
              )
          }

          resultJson = {
            userId,
            whatsappPhone,
            telegramId,
            whatsappSuccess: whatsappResult?.success,
            whatsappMessageId: whatsappResult?.messageId,
            whatsappError: whatsappResult?.error,
            telegramSuccess: telegramResult?.success,
            telegramMessageId: telegramResult?.messageId,
            telegramError: telegramResult?.error,
          }
          // }
          // }
          // }
          result.push(resultJson)
          await timeout(20)
        }

        const newNewsletter = await db.model('Newsletters').create({
          name,
          newsletters: result,
          status: 'active',
          message,
          sendType: normalizedSendType,
        })

        return res?.status(200).json({ success: true, data: newNewsletter })
      } catch (error) {
        console.log('error :>> ', error)
        await db.model('Test').create({
          data: { success: result, error },
          error: true,
        })

        return res?.status(200).json({ success: false, error })
      }

      // .then((res) => res.json())
      // .catch((error) => console.log('fetchingEvents ERROR:', error))

      // Example
      // result :>>  [
      //   {
      //     userId: '6252f733183ed7f8da6baa54',
      //     success: true,
      //     resp: { idMessage: 'BAE5E9A4F28119D2' }
      //   }
      // ]
    }
    if (type === 'getMessage') {
      const { phone, messageId } = body.data
      console.log('{ phone, messageId } :>> ', { phone, messageId })
      const url = `${urlWithInstance}/getMessage/${token}`
      // Вариант ответа:
      // { "existsWhatsapp": true }
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: `${phone}@c.us`,
          idMessage: messageId,
        }),
      })

      if (resp) {
        const respJson = await resp.json()
        return res?.status(200).json({ success: true, data: respJson })
      } else {
        console.log('whatsapp getMessage ERROR:', error)
        return res
          ?.status(400)
          .json({ success: false, error: 'getMessage error' })
      }
    }
    if (type === 'checkWhatsapp') {
      const { phone } = body.data
      const url = `${urlWithInstance}/checkWhatsapp/${token}`
      // Вариант ответа:
      // { "existsWhatsapp": true }
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phone,
        }),
      })
      if (resp) {
        const respJson = await resp.json()
        return res?.status(200).json({ success: true, data: respJson })
      } else {
        console.log('whatsapp checkWhatsapp ERROR:', error)
        return res
          ?.status(400)
          .json({ success: false, error: 'checkWhatsapp error' })
      }
    }
    if (type === 'getChatHystory') {
      const { phone } = body.data
      const url = `${urlWithInstance}/getChatHistory/${token}`

      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: `${phone}@c.us`,
          // count:10,
        }),
      })
      if (resp) {
        const respJson = await resp.json()
        return res?.status(200).json({ success: true, data: respJson })
      } else {
        console.log('whatsapp getChatHystory ERROR:', error)
        return res
          ?.status(400)
          .json({ success: false, error: 'getChatHystory error' })
      }
    }
  }

  if (method === 'GET') {
    const resp = await fetch(`${urlWithInstance}/${type}/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      // .then((res) => {
      //   console.log('res :>> ', res)
      //   res.json()
      // })
      .catch((error) => console.log('whatsapp GET ERROR:', error))

    const json = await resp.json()
    return res?.status(200).json({ success: true, data: json })
  }

  return res?.status(400).json({ success: false, error: 'Wrong method' })
}
