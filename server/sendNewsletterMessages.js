import extractVariables from '@helpers/extractVariables'
import htmlToWhatsapp from '@helpers/htmlToWhatsapp'
import htmlToTelegram from '@helpers/htmlToTelegram'
import replaceVariableInTextTemplate from '@helpers/replaceVariableInTextTemplate'
import timeout from '@helpers/timoutPromise'
import { whatsappConstants } from '@server/constants'
import sendTelegramMessage from '@server/sendTelegramMessage'
import dbConnect from '@utils/dbConnect'

const generateArray = (n) => {
  if (n === 0) {
    return Array(1)
  }
  if (n === 1) {
    return Array(2)
  }
  return [generateArray(n - 1), generateArray(n - 1)]
}

const getText = (variablesInMessage, userVariables, messageArray, message) => {
  if (!variablesInMessage?.length) return message
  let current = messageArray

  for (let i = 0; i < variablesInMessage.length - 1; i++) {
    const key = variablesInMessage[i]
    const index = userVariables[key] ? 1 : 0
    current = current[index]
  }

  const lastKey = variablesInMessage[variablesInMessage.length - 1]
  const lastIndex = userVariables[lastKey] ? 1 : 0

  if (!current[lastIndex]) {
    current[lastIndex] = replaceVariableInTextTemplate(message, userVariables)
  }

  return current[lastIndex]
}

const buildWhatsappSender =
  ({ urlWithInstance, token }) =>
  async (whatsappPhone, messageToSend) => {
    if (!whatsappPhone) {
      return { success: false, error: 'no whatsapp phone number' }
    }

    const respSend = await fetch(`${urlWithInstance}/sendMessage/${token}`, {
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
      return {
        success: true,
        messageId: respSendJson?.idMessage,
      }
    }

    return { success: false, error: 'no response' }
  }

const buildWhatsappImageSender =
  ({ urlWithInstance, token }) =>
  async (whatsappPhone, imageUrl) => {
    if (!whatsappPhone) {
      return { success: false, error: 'no whatsapp phone number' }
    }
    if (!imageUrl) return { success: false, error: 'no image url' }

    const respSend = await fetch(`${urlWithInstance}/sendFileByUrl/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: `${whatsappPhone}@c.us`,
        urlFile: imageUrl,
        fileName: imageUrl.split('/').pop() || 'image.jpg',
      }),
    })

    if (respSend) {
      const respSendJson = await respSend.json()
      const messageId =
        respSendJson?.idMessage || respSendJson?.message?.idMessage
      const errorText = respSendJson?.reason || respSendJson?.error
      return {
        success: !!messageId,
        messageId,
        error: errorText,
      }
    }

    return { success: false, error: 'no response' }
  }

const sendNewsletterMessages = async ({
  location,
  name,
  usersMessages,
  message,
  sendType = 'whatsapp-only',
  image,
  db,
}) => {
  if (!location) throw new Error('No location for newsletter send')
  const { urlWithInstance, token } = whatsappConstants[location]
  if (!db) {
    db = await dbConnect(location)
  }
  if (!db) throw new Error('db error')

  const whatsappMessage = htmlToWhatsapp(message)
  const telegramMessage = htmlToTelegram(message)

  const sendWhatsapp = buildWhatsappSender({ urlWithInstance, token })
  const sendWhatsappImage = buildWhatsappImageSender({
    urlWithInstance,
    token,
  })

  const sendTelegram = async (telegramId, messageToSend, imageUrl) => {
    if (!telegramId) return { success: false, error: 'no telegram id' }

    const telegramResult = await sendTelegramMessage({
      telegramIds: telegramId,
      text: messageToSend,
      images: imageUrl ? [imageUrl] : undefined,
      location,
      repeats: 1,
      retryOnUnknown: false,
    })

    const success = telegramResult?.successCount > 0
    const telegramResultEntry = telegramResult?.successes?.[0]?.result?.[0]
    const lastMessageResult = Array.isArray(telegramResultEntry)
      ? telegramResultEntry[telegramResultEntry.length - 1]
      : telegramResultEntry

    const messageId =
      lastMessageResult?.result?.message_id ||
      lastMessageResult?.result?.result?.message_id ||
      telegramResult?.successes?.[0]?.result?.result?.message_id

    const errorText = telegramResult?.errors?.[0]
      ? typeof telegramResult.errors[0] === 'string'
        ? telegramResult.errors[0]
        : JSON.stringify(telegramResult.errors[0])
      : undefined

    return {
      success,
      messageId,
      error: success ? undefined : errorText,
    }
  }

  const siteSettings = await db
    .model('SiteSettings')
    .findOne({}, { 'newsletter.whatsappActivated': 1 })
    .lean()

  const whatsappActivated =
    siteSettings?.newsletter?.whatsappActivated === true

  const normalizedSendType = (sendType || 'whatsapp-only').toLowerCase()

  if (!whatsappActivated && normalizedSendType !== 'telegram-only') {
    throw new Error('Whatsapp рассылки недоступны')
  }

  const variablesInMessage = extractVariables(telegramMessage)
  const messageArray = generateArray(variablesInMessage.length)
  const messageArrayTelegram = generateArray(variablesInMessage.length)

  const result = []

  for (let i = 0; i < usersMessages.length; i++) {
    const { whatsappPhone, telegramId, userId, variables } = usersMessages[i]
    let resultJson = {}
    let whatsappImageResult

    const messageToSendWhatsapp = getText(
      variablesInMessage,
      variables,
      messageArray,
      whatsappMessage
    )

    const messageToSendTelegram = getText(
      variablesInMessage,
      variables,
      messageArrayTelegram,
      telegramMessage
    )

    let telegramResult
    let whatsappResult

    switch (normalizedSendType) {
      case 'telegram-only':
        telegramResult = await sendTelegram(
          telegramId,
          messageToSendTelegram,
          image
        )
        break
      case 'telegram-first':
        telegramResult = await sendTelegram(
          telegramId,
          messageToSendTelegram,
          image
        )
        if (!telegramResult?.success) {
          if (image) {
            whatsappImageResult = await sendWhatsappImage(
              whatsappPhone,
              image
            )
          }
          whatsappResult = await sendWhatsapp(
            whatsappPhone,
            messageToSendWhatsapp
          )
        }
        break
      case 'both':
        telegramResult = await sendTelegram(
          telegramId,
          messageToSendTelegram,
          image
        )
        if (image) {
          whatsappImageResult = await sendWhatsappImage(
            whatsappPhone,
            image
          )
        }
        whatsappResult = await sendWhatsapp(
          whatsappPhone,
          messageToSendWhatsapp
        )
        break
      default:
        if (image) {
          whatsappImageResult = await sendWhatsappImage(
            whatsappPhone,
            image
          )
        }
        whatsappResult = await sendWhatsapp(
          whatsappPhone,
          messageToSendWhatsapp
        )
    }

    const whatsappError =
      whatsappResult?.error || whatsappImageResult?.error
        ? [whatsappImageResult?.error, whatsappResult?.error]
            .filter((errorText) => errorText)
            .join('; ')
        : undefined

    resultJson = {
      userId,
      name,
      whatsappPhone,
      telegramId,
      whatsappSuccess: whatsappResult?.success,
      whatsappMessageId: whatsappResult?.messageId,
      whatsappError,
      telegramSuccess: telegramResult?.success,
      telegramMessageId: telegramResult?.messageId,
      telegramError: telegramResult?.error,
      variables,
    }

    result.push(resultJson)
    await timeout(20)
  }

  return { result, normalizedSendType, whatsappActivated }
}

export default sendNewsletterMessages
