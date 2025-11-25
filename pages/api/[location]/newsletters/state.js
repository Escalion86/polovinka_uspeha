import checkLocationValid from '@server/checkLocationValid'
import { whatsappConstants } from '@server/constants'

const requestWhatsapp = async (url, options) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })
  let data = null

  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const errorMessage =
      typeof data?.message === 'string' && data.message.length > 0
        ? data.message
        : 'Whatsapp request failed'
    throw new Error(errorMessage)
  }

  return data
}

export default async function handler(req, res) {
  const { method, query, body } = req
  const location = query?.location

  if (!location)
    return res.status(400).json({ success: false, error: 'No location' })

  if (!checkLocationValid(location))
    return res.status(400).json({ success: false, error: 'Invalid location' })

  const config = whatsappConstants[location]
  if (!config?.urlWithInstance || !config?.token)
    return res
      .status(500)
      .json({ success: false, error: 'Whatsapp config not found' })

  if (method === 'GET') {
    try {
      const data = await requestWhatsapp(
        `${config.urlWithInstance}/getStateInstance/${config.token}`
      )
      return res.status(200).json({
        success: true,
        data: {
          stateInstance: data?.stateInstance || null,
          statusInstance: data?.statusInstance || null,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message || 'State request error',
      })
    }
  }

  if (method === 'POST') {
    const phoneNumber = body?.data?.phoneNumber || body?.phoneNumber
    if (!phoneNumber)
      return res
        .status(400)
        .json({ success: false, error: 'Phone number required' })

    try {
      const data = await requestWhatsapp(
        `${config.urlWithInstance}/getAuthorizationCode/${config.token}`,
        {
          method: 'POST',
          body: JSON.stringify({ phoneNumber }),
        }
      )
      return res.status(200).json({ success: true, data })
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Authorization request error',
      })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ success: false, error: 'Method not allowed' })
}
