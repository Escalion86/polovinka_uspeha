import extractVariables from '@helpers/extractVariables'
import htmlToWhatsapp from '@helpers/htmlToWhatsapp'
import htmlToTelegram from '@helpers/htmlToTelegram'
import replaceVariableInTextTemplate from '@helpers/replaceVariableInTextTemplate'
import timeout from '@helpers/timoutPromise'
import { whatsappConstants } from '@server/constants'
import sendTelegramMessage from '@server/sendTelegramMessage'
import { pushTextFromHtml } from '@server/pushNotifications'
import dbConnect from '@utils/dbConnect'
import dbConnectGlobal from '@utils/dbConnectGlobal'
import webpush from 'web-push'

const PUSH_PUBLIC_KEY = process.env.WEB_PUSH_VAPID_PUBLIC_KEY
const PUSH_PRIVATE_KEY = process.env.WEB_PUSH_VAPID_PRIVATE_KEY
const PUSH_SUBJECT =
  process.env.WEB_PUSH_VAPID_SUBJECT || 'mailto:support@polovinka-uspeha.ru'

let vapidInitializedForNewsletter = false

const ensureVapidForNewsletter = () => {
  if (vapidInitializedForNewsletter) return true
  if (!PUSH_PUBLIC_KEY || !PUSH_PRIVATE_KEY) return false
  webpush.setVapidDetails(PUSH_SUBJECT, PUSH_PUBLIC_KEY, PUSH_PRIVATE_KEY)
  vapidInitializedForNewsletter = true
  return true
}

const normalizePushSubscription = (value) => {
  if (!value || typeof value !== 'object') return null
  const endpoint = String(value?.endpoint || '').trim()
  const p256dh = String(value?.keys?.p256dh || '').trim()
  const auth = String(value?.keys?.auth || '').trim()
  if (!endpoint || !p256dh || !auth) return null
  return {
    endpoint,
    expirationTime:
      typeof value?.expirationTime === 'number' ? value.expirationTime : null,
    keys: { p256dh, auth },
  }
}

const sendPushToUser = async (user, messageText, name, location) => {
  if (!user?.notifications?.push?.active) {
    return { success: false, error: 'push не активен у пользователя' }
  }

  const subscriptions = Array.isArray(user?.notifications?.push?.subscriptions)
    ? user.notifications.push.subscriptions
    : []

  const validSubscriptions = subscriptions
    .map(normalizePushSubscription)
    .filter(Boolean)

  if (!validSubscriptions.length) {
    return { success: false, error: 'нет push-подписок' }
  }

  if (!ensureVapidForNewsletter()) {
    return { success: false, error: 'push не настроен на сервере' }
  }

  let anySuccess = false
  let lastError = null

  for (const subscription of validSubscriptions) {
    try {
      await webpush.sendNotification(
        subscription,
        JSON.stringify({
          title: name || 'Половинка успеха',
          body: messageText.slice(0, 1000),
          tag: `newsletter-${location || 'global'}`,
          data: {
            url: process.env.DOMAIN ? `${process.env.DOMAIN}/${location}` : '/',
            location,
          },
        })
      )
      anySuccess = true
    } catch (error) {
      const statusCode = Number(error?.statusCode)
      lastError =
        statusCode && Number.isFinite(statusCode)
          ? `PUSH_HTTP_${statusCode}`
          : error?.message || 'PUSH_SEND_ERROR'
    }
  }

  return anySuccess
    ? { success: true }
    : { success: false, error: lastError || 'PUSH_SEND_ERROR' }
}

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
  channels,
  image,
  db,
}) => {
  if (!location) throw new Error('No location for newsletter send')
  const { urlWithInstance, token } = whatsappConstants[location]
  if (!db) {
    db = await dbConnect(location)
  }
  if (!db) throw new Error('db error')

  // Определяем каналы из channels или по sendType для обратной совместимости
  const resolvedChannels = channels || {
    push: false,
    whatsapp: sendType !== 'telegram-only',
    telegram: sendType !== 'whatsapp-only',
  }

  const usePush = !!resolvedChannels.push
  const useWhatsapp = !!resolvedChannels.whatsapp
  const useTelegram = !!resolvedChannels.telegram

  const whatsappMessage = htmlToWhatsapp(message)
  const telegramMessage = htmlToTelegram(message)

  const sendWhatsapp = buildWhatsappSender({ urlWithInstance, token })
  const sendWhatsappImage = buildWhatsappImageSender({
    urlWithInstance,
    token,
  })

  const sendTelegram = async (telegramId, messageToSend, imageUrl) => {
    if (!telegramId) return { success: false, error: 'no telegram id' }

    console.log(
      '[Newsletter] Sending telegram to:',
      telegramId,
      'location:',
      location
    )

    const telegramResult = await sendTelegramMessage({
      telegramIds: telegramId,
      text: messageToSend,
      images: imageUrl ? [imageUrl] : undefined,
      location,
      repeats: 1,
      retryOnUnknown: false,
    })

    console.log(
      '[Newsletter] Telegram result for',
      telegramId,
      ':',
      JSON.stringify({
        successCount: telegramResult?.successCount,
        errorCount: telegramResult?.errorCount,
        errors: telegramResult?.errors?.map((e) => ({
          telegramId: e?.body?.telegramId,
          result: e?.result,
        })),
        successes: telegramResult?.successes?.length,
      })
    )

    const success = telegramResult?.successCount > 0
    const telegramResultEntry = telegramResult?.successes?.[0]?.result?.[0]
    const lastMessageResult = Array.isArray(telegramResultEntry)
      ? telegramResultEntry[telegramResultEntry.length - 1]
      : telegramResultEntry

    const messageId =
      lastMessageResult?.result?.message_id ||
      lastMessageResult?.result?.result?.message_id ||
      telegramResult?.successes?.[0]?.result?.result?.message_id

    // Извлекаем текст ошибки из errors
    let errorText
    if (!success && telegramResult?.errors?.length) {
      const firstError = telegramResult.errors[0]
      const errorResult = firstError?.result?.[0]
      // Пробуем разные форматы ошибок
      if (errorResult?.description) {
        errorText = errorResult.description
      } else if (errorResult?.result?.description) {
        errorText = errorResult.result.description
      } else if (typeof firstError === 'string') {
        errorText = firstError
      } else {
        errorText = JSON.stringify(firstError)
      }
    }

    if (!success) {
      console.log(
        '[Newsletter] Telegram FAILED for',
        telegramId,
        'error:',
        errorText
      )
    }

    return {
      success,
      messageId,
      error: success ? undefined : errorText || 'unknown telegram error',
    }
  }

  const siteSettings = await db
    .model('SiteSettings')
    .findOne({}, { 'newsletter.whatsappActivated': 1 })
    .lean()

  const whatsappActivated = siteSettings?.newsletter?.whatsappActivated === true

  const normalizedSendType = (sendType || 'whatsapp-only').toLowerCase()

  if (useWhatsapp && !whatsappActivated) {
    throw new Error('Whatsapp рассылки недоступны')
  }

  // Загружаем пользователей для push если нужно
  let usersForPush = {}
  if (usePush) {
    const userIds = usersMessages.map((u) => u.userId).filter(Boolean)
    const usersFromDb = await db
      .model('Users')
      .find({ _id: { $in: userIds } }, { notifications: 1 })
      .lean()
    for (const user of usersFromDb) {
      usersForPush[String(user._id)] = user
    }
  }

  // Подтягиваем telegramId из БД для пользователей, у которых он отсутствует
  const telegramIdFallback = {}
  if (useTelegram) {
    const missingTelegramUsers = usersMessages.filter(
      (u) => !u.telegramId && u.userId
    )
    if (missingTelegramUsers.length > 0) {
      const missingIds = missingTelegramUsers.map((u) => u.userId)
      // Загружаем городские профили для получения globalUserId
      const cityUsers = await db
        .model('Users')
        .find(
          { _id: { $in: missingIds } },
          { 'notifications.telegram.id': 1, globalUserId: 1 }
        )
        .lean()

      // Сначала пробуем получить telegramId из глобальных профилей
      const globalUserIds = []
      const globalToLocalMap = {}
      const cityUserMap = {}

      for (const cu of cityUsers) {
        cityUserMap[String(cu._id)] = cu
        if (cu.globalUserId) {
          globalUserIds.push(cu.globalUserId)
          globalToLocalMap[cu.globalUserId] = String(cu._id)
        }
      }

      if (globalUserIds.length > 0) {
        try {
          const globalDb = await dbConnectGlobal()
          if (globalDb) {
            const globalUsers = await globalDb
              .model('GlobalUsers')
              .find(
                { _id: { $in: globalUserIds } },
                { 'authProviders.telegram.id': 1 }
              )
              .lean()
            for (const gu of globalUsers) {
              const globalTgId = gu?.authProviders?.telegram?.id
              const localUserId = globalToLocalMap[String(gu._id)]
              if (globalTgId && localUserId) {
                telegramIdFallback[localUserId] = globalTgId
                console.log(
                  '[Newsletter] Telegram ID resolved from global user for',
                  localUserId,
                  ':',
                  globalTgId
                )
              }
            }
          }
        } catch (err) {
          console.log(
            '[Newsletter] Failed to fetch global telegram IDs:',
            err.message
          )
        }
      }

      // Фоллбэк: для тех, кого не нашли в глобальном — берём из городского профиля
      for (const cu of cityUsers) {
        const localId = String(cu._id)
        if (!telegramIdFallback[localId]) {
          const cityTgId = cu?.notifications?.telegram?.id
          if (cityTgId) {
            telegramIdFallback[localId] = cityTgId
          }
        }
      }
    }
  }

  const pushMessage = usePush ? pushTextFromHtml(message) : ''

  const variablesInMessage = extractVariables(telegramMessage)
  const messageArray = generateArray(variablesInMessage.length)
  const messageArrayTelegram = generateArray(variablesInMessage.length)
  const messageArrayPush = usePush
    ? generateArray(variablesInMessage.length)
    : null

  const result = []

  for (let i = 0; i < usersMessages.length; i++) {
    const {
      whatsappPhone,
      telegramId: originalTelegramId,
      userId,
      variables,
    } = usersMessages[i]
    const telegramId =
      originalTelegramId || telegramIdFallback[String(userId)] || null
    let resultJson = {}
    let whatsappImageResult

    const messageToSendWhatsapp = useWhatsapp
      ? getText(variablesInMessage, variables, messageArray, whatsappMessage)
      : null

    const messageToSendTelegram = useTelegram
      ? getText(
          variablesInMessage,
          variables,
          messageArrayTelegram,
          telegramMessage
        )
      : null

    const messageToSendPush = usePush
      ? getText(variablesInMessage, variables, messageArrayPush, pushMessage)
      : null

    let telegramResult
    let whatsappResult
    let pushResult

    // Отправка через Telegram
    if (useTelegram) {
      telegramResult = await sendTelegram(
        telegramId,
        messageToSendTelegram,
        image
      )
    }

    // Отправка через WhatsApp
    if (useWhatsapp) {
      if (image) {
        whatsappImageResult = await sendWhatsappImage(whatsappPhone, image)
      }
      whatsappResult = await sendWhatsapp(whatsappPhone, messageToSendWhatsapp)
    }

    // Отправка через Push
    if (usePush) {
      const userForPush = usersForPush[String(userId)]
      if (userForPush) {
        pushResult = await sendPushToUser(
          userForPush,
          messageToSendPush,
          name,
          location
        )
      } else {
        pushResult = { success: false, error: 'пользователь не найден' }
      }
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
      pushSuccess: pushResult?.success,
      pushError: pushResult?.error,
      variables,
    }

    result.push(resultJson)
    await timeout(20)
  }

  return {
    result,
    normalizedSendType,
    whatsappActivated,
    channels: resolvedChannels,
  }
}

export default sendNewsletterMessages
