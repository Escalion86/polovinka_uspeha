export default async function handler(req, res) {
  const { query, method, body } = req

  if (method === 'POST') {
    const { type, phone, message } = body.data
    if (!type)
      return res?.status(400).json({ success: false, error: 'No type' })

    if (type === 'sendMessage') {
      const resp = await fetch(process.env.WHATSAPP_SENDMESSAGE_URL, {
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
        // .then((json) => json.data)
        .catch((error) => console.log('fetchingEvents ERROR:', error))

      return res?.status(200).json({ success: true, data: resp })
    }
    if (type === 'getChatHystory') {
      const resp = await fetch(process.env.WHATSAPP_GETCHATHISTORY_URL, {
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
        // .then((json) => json.data)
        .catch((error) => console.log('fetchingEvents ERROR:', error))
      return res?.status(200).json({ success: true, data: resp })
    }

    // else
    // if (type === 'lastIncomingMessages') {

    // }
  }

  const type = query?.type || body?.data?.type

  const prepearedBody = body.data ? { ...body.data } : query ? { ...query } : {}
  delete prepearedBody.type

  const resp = await fetch(
    `${process.env.WHATSAPP_API_URL_WITH_INSTANCE}/${type}/${process.env.WHATSAPP_TOKEN}`,
    {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: prepearedBody ? JSON.stringify(prepearedBody) : undefined,
    }
  )
    .then((res) => res.json())
    // .then((json) => json.data)
    .catch((error) => console.log('fetchingEvents ERROR:', error))

  return res?.status(200).json({ success: true, data: resp })

  // return res?.status(400).json({ success: false, error: 'Wrong method' })
}
