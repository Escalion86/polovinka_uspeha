import extractVariables from '@helpers/extractVariables'
import replaceVariableInTextTemplate from '@helpers/replaceVariableInTextTemplate'
import checkLocationValid from '@server/checkLocationValid'
import dbConnect from '@utils/dbConnect'
import TurndownService from 'turndown'

const whatsappConstants = {
  krsk: {
    urlWithInstance: `${process.env.WHATSAPP_API_URL_KRSK}/waInstance${process.env.WHATSAPP_ID_INSTANCE_KRSK}`,
    token: process.env.WHATSAPP_TOKEN_KRSK,
  },
  nrsk: {
    urlWithInstance: `${process.env.WHATSAPP_API_URL_NRSK}/waInstance${process.env.WHATSAPP_ID_INSTANCE_NRSK}`,
    token: process.env.WHATSAPP_TOKEN_NRSK,
  },
  ekb: {
    urlWithInstance: `${process.env.WHATSAPP_API_URL_EKB}/waInstance${process.env.WHATSAPP_ID_INSTANCE_EKB}`,
    token: process.env.WHATSAPP_TOKEN_EKB,
  },
}

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
      const { name, usersMessages, message } = body.data
      const db = await dbConnect(location)
      if (!db)
        return res?.status(400).json({ success: false, error: 'db error' })

      var turndownService = new TurndownService()
      var markdownMessage = turndownService.turndown(message)

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
            whatsappSuccess: true,
            whatsappMessageId: respSendJson?.idMessage,
            // whatsappMessage,
          }
        } else {
          resultJson = {
            userId,
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
        .then((res) => res.json())
        .catch((error) => console.log('whatsapp checkWhatsapp ERROR:', error))
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
        .then((res) => res.json())
        .catch((error) => console.log('whatsapp getChatHystory ERROR:', error))
      return res?.status(200).json({ success: true, data: resp })
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
