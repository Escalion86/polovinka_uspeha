import extractVariables from '@helpers/extractVariables'
import replaceVariableInTextTemplate from '@helpers/replaceVariableInTextTemplate'
import checkLocationValid from '@server/checkLocationValid'
import { whatsappConstants } from '@server/constants'
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

function htmlToWhatsappMD(htmlText) {
  let markdown = (htmlText || '')
    // 0. Замена символов влияющих на форматирование
    // .replaceAll('-', '—')
    .replaceAll('*', '⚹')
    // 1. Замена HTML-сущностей
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')

    // 2. Обработка переносов строк
    .replace(/<\/p><p><br><\/p><p><br><\/p><p>/gi, '\n\n\n')
    .replace(/<\/p><p><br><\/p><p>/gi, '\n\n')
    .replace(/<p><br><\/p>/gi, '\n')
    .replace(/<br><p>/gi, '\n')

    .replace(/<br\s*\/?>/gi, '\n') // <br> → перенос
    .replace(/<\/p><p>/gi, '\n') // </p> → перенос
    .replace(/<\/p>/gi, '\n') // </p> → перенос
    .replace(/<p>/gi, '\n') // <p> → начало нового абзаца

    // Обработка пробелов вокруг открывающих тегов
    .replace(
      /(\s*)<(b|strong)>(\s*)(.*?)(\s*)<\/\2>(\s*)/gi,
      (_, before, tag, wsOpen, content, wsClose, after) => {
        return `${before + wsOpen || ' '}*${content.trim()}*${wsClose + after || ' '}`
      }
    )
    .replace(
      /(\s*)<(i|em)>(\s*)(.*?)(\s*)<\/\3>(\s*)/gi,
      (_, before, tag, wsOpen, content, wsClose, after) => {
        return `${before + wsOpen || ' '}_${content.trim()}_${wsClose + after || ' '}`
      }
    )
    .replace(
      /(\s*)<(s|del|strike)>(\s*)(.*?)(\s*)<\/\4>(\s*)/gi,
      (_, before, tag, wsOpen, content, wsClose, after) => {
        return `${before + wsOpen || ' '}~${content.trim()}~${wsClose + after || ' '}`
      }
    )

    // 3. Обработка форматирования
    // .replace(/\s<(b|strong)>(.*?)<\/\1>/gi, '*$2* ')
    // .replace(/<(b|strong)>(.*?)<\/\1>/gi, '*$2*')
    // .replace(/<(i|em)>(.*?)<\/\1>/gi, '_$2_')
    // .replace(/<(s|del)>(.*?)<\/\1>/gi, '~$2~')

    // 4. Удаление HTML-тегов (сохраняем пробелы)
    .replace(/<[^>]+>/g, '')

    // 5. Чистка пробелов (БЕЗ УДАЛЕНИЯ ПЕРЕНОСОВ)
    // console.log('1', JSON.stringify({ markdown }))
    // markdown = markdown
    // .replace(/[ \t]+/g, ' ') // Схлопываем пробелы и табы
    .replace(/ +(\n)/g, '$1') // Убираем пробелы перед переносами
    .replace(/(\n) +/g, '$1') // Убираем пробелы после переносов
    // .replace(/(\*|_|~) /g, '$1') // Пробелы после форматирования
    // .replace(/ (\*|_|~)/g, '$1') // Пробелы перед форматированием

    // 6. Нормализация переносов
    .replace(/\n{4,}/g, '\n\n\n') // Максимум 3 переноса подряд
    .trim()
  return markdown
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
      const { name, usersMessages, message } = body.data
      const db = await dbConnect(location)
      if (!db)
        return res?.status(400).json({ success: false, error: 'db error' })

      // var turndownService = new TurndownService()
      // var markdownMessage = turndownService.turndown(
      //   message.replaceAll('-', '—').replaceAll('*', '⚹')
      // )

      var markdownMessage = htmlToWhatsappMD(message)

      const urlSend = `${urlWithInstance}/sendMessage/${token}`
      // const urlCheckWhatsapp = `${urlWithInstance}/checkWhatsapp/${token}`

      // const prepearedText = DOMPurify.sanitize(html, {
      //   ALLOWED_TAGS: ['em'],
      //   ALLOWED_ATTR: [],
      // })

      const variablesInMessage = extractVariables(markdownMessage)

      const messageArray = generateArray(variablesInMessage.length)

      const result = []
      for (let i = 0; i < usersMessages.length; i++) {
        const {
          whatsappPhone,
          // whatsappMessage,
          // telegramId,
          // telegramMessage,
          userId,
          variables,
        } = usersMessages[i]

        let resultJson = {}

        const messageToSend = getText(
          variablesInMessage,
          variables,
          messageArray,
          markdownMessage
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
          resultJson = {
            userId,
            whatsappPhone,
            whatsappSuccess: true,
            whatsappMessageId: respSendJson?.idMessage,
            // whatsappMessage,
          }
        } else {
          resultJson = {
            userId,
            whatsappPhone,
            whatsappSuccess: false,
            // whatsappMessage,
            whatsappError: 'no response',
          }
        }
        // }
        // }
        // }
        result.push(resultJson)
      }

      const newNewsletter = await db.model('Newsletters').create({
        name,
        newsletters: result,
        status: 'active',
        message,
      })

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

      return res?.status(200).json({ success: true, data: newNewsletter })
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
