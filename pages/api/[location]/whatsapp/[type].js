import checkLocationValid from '@server/checkLocationValid'

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
  console.log('type :>> ', type)
  const { urlWithInstance, token } = whatsappConstants[location]

  if (method === 'POST') {
    if (type === 'sendMessage') {
      const { users, message } = body.data
      const url = `${urlWithInstance}/sendMessage/${token}`

      const result = []
      for (let i = 0; i < users.length; i++) {
        const { phone, userId } = users[i]
        const resp = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId: `${phone}@c.us`,
            message,
          }),
        })

        if (resp) {
          result.push({ userId, success: true, resp: await resp.json() })
        } else {
          result.push({ userId, success: false, error: 'no response' })
        }
      }
      // .then((res) => res.json())
      // .catch((error) => console.log('fetchingEvents ERROR:', error))
      console.log('result :>> ', result)

      // Example
      // result :>>  [
      //   {
      //     userId: '6252f733183ed7f8da6baa54',
      //     success: true,
      //     resp: { idMessage: 'BAE5E9A4F28119D2' }
      //   }
      // ]

      return res?.status(200).json({ success: true, data: result })
    }
    if (type === 'checkWhatsapp') {
      const { phone } = body.data
      const url = `${urlWithInstance}/checkWhatsapp/${token}`
      // Вариант ответа:
      // { "existsWhatsapp": true }
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
        .catch((error) => console.log('fetchingEvents ERROR:', error))
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
      .catch((error) => console.log('fetchingEvents ERROR:', error))

    const json = await resp.json()
    return res?.status(200).json({ success: true, data: json })
  }

  return res?.status(400).json({ success: false, error: 'Wrong method' })
}
