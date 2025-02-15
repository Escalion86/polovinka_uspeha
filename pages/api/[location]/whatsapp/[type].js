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
    const { phone, message } = body.data

    if (type === 'sendMessage') {
      const url = `${urlWithInstance}/sendMessage/${token}`

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
        .then((res) => res.json())
        .catch((error) => console.log('fetchingEvents ERROR:', error))

      return res?.status(200).json({ success: true, data: resp })
    }
    if (type === 'getChatHystory') {
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
