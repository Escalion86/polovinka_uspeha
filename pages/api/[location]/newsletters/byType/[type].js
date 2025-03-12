import checkLocationValid from '@server/checkLocationValid'
import dbConnect from '@utils/dbConnect'

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

      const urlSend = `${urlWithInstance}/sendMessage/${token}`
      // const urlCheckWhatsapp = `${urlWithInstance}/checkWhatsapp/${token}`

      const result = []
      console.log('usersMessages[0]', usersMessages[0])
      for (let i = 0; i < usersMessages.length; i++) {
        const {
          whatsappPhone,
          // whatsappMessage,
          // telegramId,
          // telegramMessage,
          userId,
        } = usersMessages[i]

        let resultJson = {}

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
            message: message,
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
            success: false,
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

      console.log('newNewsletter :>> ', newNewsletter)
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
