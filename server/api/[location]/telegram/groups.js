import { ID_TELEGRAM_GROUP } from '@helpers/constantsTelegram'
import checkLocationValid from '@server/checkLocationValid'
import sendTelegramMessage from '@server/sendTelegramMessage'

const normalizeTopicId = (value) => {
  if (value === undefined || value === null || value === '') return null
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    throw new Error('Некорректный ID темы')
  }
  return parsed
}

export default async function handler(req, res) {
  const { method, query, body } = req
  const location = query?.location

  if (!location)
    return res.status(400).json({ success: false, error: 'No location' })

  if (!checkLocationValid(location))
    return res.status(400).json({ success: false, error: 'Invalid location' })

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const textRaw =
    typeof body?.text === 'string'
      ? body.text
      : typeof body?.data?.text === 'string'
        ? body.data.text
        : ''
  const normalizedText = textRaw.trim()
  if (!normalizedText)
    return res
      .status(400)
      .json({ success: false, error: 'Текст сообщения обязателен' })

  let topicId = null
  try {
    topicId = normalizeTopicId(body?.topicId ?? body?.data?.topicId)
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error?.message || 'Некорректный ID темы',
    })
  }

  try {
    const telegramResult = await sendTelegramMessage({
      telegramIds: ID_TELEGRAM_GROUP,
      text: normalizedText,
      location,
      topicId,
    })

    const success = telegramResult?.successCount > 0
    if (!success) {
      const errorText = telegramResult?.errors?.[0]
        ? JSON.stringify(telegramResult.errors[0])
        : 'Не удалось отправить сообщение'
      throw new Error(errorText)
    }

    return res.status(200).json({
      success: true,
      data: {
        topicId,
        result: telegramResult,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error?.message || 'Ошибка отправки сообщения в Telegram',
    })
  }
}
