import checkLocationValid from '@server/checkLocationValid'
import { whatsappConstants } from '@server/constants'

const requestWhatsapp = async (url) => {
  const response = await fetch(url)
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

const normalizeCount = (data) => {
  if (typeof data?.totalMessages === 'number') return data.totalMessages
  if (typeof data?.count === 'number') return data.count
  if (typeof data?.outgoingMessages === 'number') return data.outgoingMessages
  if (typeof data?.messages === 'number') return data.messages
  if (typeof data?.messageCount === 'number') return data.messageCount
  return 0
}

export default async function handler(req, res) {
  const { method, query } = req
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
        `${config.urlWithInstance}/getMessagesCount/${config.token}`
      )
      return res.status(200).json({
        success: true,
        data: {
          totalMessages: normalizeCount(data),
        },
      })
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: error.message || 'Count request error' })
    }
  }

  if (method === 'POST') {
    try {
      const data = await requestWhatsapp(
        `${config.urlWithInstance}/clearMessagesQueue/${config.token}`
      )
      return res.status(200).json({ success: true, data })
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Clear queue error',
      })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ success: false, error: 'Method not allowed' })
}
