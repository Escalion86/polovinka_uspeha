export default async function handler(req, res) {
  const { query, method, body } = req

  if (method === 'GET') {
    const { type } = query
    if (!type)
      return res?.status(400).json({ success: false, error: 'No type' })

    // const prepearedQuery = query ? { ...query } : {}
    // delete prepearedQuery.type

    const resp = await fetch(
      `${process.env.WHATSAPP_API_URL_WITH_INSTANCE}/${type}/${process.env.WHATSAPP_TOKEN}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    // .then((res) => {
    //   console.log('res :>> ', res)
    //   res.json()
    // })
    // .then((json) => json.data)
    // .catch((error) => console.log('fetchingEvents ERROR:', error))

    const json = await resp.json()
    console.log('json :>> ', json)
    return res?.status(200).json({ success: true, data: json })
  }

  return res?.status(400).json({ success: false, error: 'Wrong method' })
}
