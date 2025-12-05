import {
  NEWSLETTER_SEND_MODES,
  NEWSLETTER_SENDING_STATUSES,
} from '@helpers/constantsNewsletters'
import checkLocationValid from '@server/checkLocationValid'
import { whatsappConstants } from '@server/constants'
import dbConnect from '@utils/dbConnect'
import sendNewsletterMessages from '@server/sendNewsletterMessages'

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
      const { name, usersMessages, message, sendType, image } = body.data || {}
      if (!name || !Array.isArray(usersMessages) || !usersMessages.length || !message) {
        return res?.status(400).json({ success: false, error: 'Invalid payload' })
      }
      const db = await dbConnect(location)
      if (!db)
        return res?.status(400).json({ success: false, error: 'db error' })

      try {
        const { result, normalizedSendType } = await sendNewsletterMessages({
          location,
          name,
          usersMessages,
          message,
          sendType,
          image,
          db,
        })

        const newNewsletter = await db.model('Newsletters').create({
          name,
          newsletters: result,
          status: 'active',
          message,
          sendType: normalizedSendType,
          image,
          sendMode: NEWSLETTER_SEND_MODES.IMMEDIATE,
          sendingStatus: NEWSLETTER_SENDING_STATUSES.SENT,
          plannedSendDate: '',
          plannedSendTime: '',
        })

        return res?.status(200).json({ success: true, data: newNewsletter })
      } catch (error) {
        console.log('newsletter send error :>> ', error)
        return res
          ?.status(200)
          .json({ success: false, error: error?.message || String(error) })
      }
    }
    if (type === 'getMessage') {
      const { phone, messageId } = body.data
      const url = `${urlWithInstance}/getMessage/${token}`
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
        console.log('whatsapp getMessage ERROR')
        return res
          ?.status(400)
          .json({ success: false, error: 'getMessage error' })
      }
    }
    if (type === 'checkWhatsapp') {
      const { phone } = body.data
      const url = `${urlWithInstance}/checkWhatsapp/${token}`
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
        console.log('whatsapp checkWhatsapp ERROR')
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
        }),
      })
      if (resp) {
        const respJson = await resp.json()
        return res?.status(200).json({ success: true, data: respJson })
      } else {
        console.log('whatsapp getChatHystory ERROR')
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
    }).catch((error) => console.log('whatsapp GET ERROR:', error))

    const json = await resp.json()
    return res?.status(200).json({ success: true, data: json })
  }

  return res?.status(400).json({ success: false, error: 'Wrong method' })
}
