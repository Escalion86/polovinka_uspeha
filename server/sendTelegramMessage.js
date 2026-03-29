import telegramPost from './telegramApi'

// import dbConnect from '@utils/dbConnect'
import getTelegramTokenByLocation from './getTelegramTokenByLocation'
import splitText from '@helpers/splitText'

const normalizeTelegramIds = (value) => {
  const normalizeSingleTelegramId = (rawValue) => {
    if (rawValue === null || typeof rawValue === 'undefined') return null

    if (typeof rawValue === 'string') {
      const trimmed = rawValue.trim()
      return trimmed ? trimmed : null
    }

    if (typeof rawValue === 'number') {
      return Number.isFinite(rawValue) ? String(rawValue) : null
    }

    if (typeof rawValue === 'bigint') {
      return String(rawValue)
    }

    if (typeof rawValue === 'object') {
      if (
        typeof rawValue.$numberLong === 'string' &&
        rawValue.$numberLong.trim()
      ) {
        return rawValue.$numberLong.trim()
      }

      const nestedCandidates = [
        rawValue.id,
        rawValue.telegramId,
        rawValue.chat_id,
        rawValue.chatId,
        rawValue?.telegram?.id,
        rawValue?.notifications?.telegram?.id,
      ]
      for (const candidate of nestedCandidates) {
        const normalized = normalizeSingleTelegramId(candidate)
        if (normalized) return normalized
      }

      if (typeof rawValue.toString === 'function') {
        const asString = rawValue.toString()
        if (asString && asString !== '[object Object]') {
          return asString
        }
      }
    }

    return null
  }

  if (value === null || typeof value === 'undefined') return []
  if (['string', 'number', 'bigint'].includes(typeof value)) {
    const normalized = normalizeSingleTelegramId(value)
    return normalized ? [normalized] : []
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeSingleTelegramId(item))
      .filter(Boolean)
  }
  if (value instanceof Set) {
    return Array.from(value)
      .map((item) => normalizeSingleTelegramId(item))
      .filter(Boolean)
  }
  if (value instanceof Map) {
    return Array.from(value.values())
      .map((item) => normalizeSingleTelegramId(item))
      .filter(Boolean)
  }
  if (typeof value === 'object') {
    const normalized = normalizeSingleTelegramId(value)
    if (normalized) return [normalized]
  }
  return []
}

const sendMessageToTelegramId = async ({
  telegramId,
  text,
  images,
  inline_keyboard,
  location,
  topicId,
}) => {
  const telegramToken = getTelegramTokenByLocation(location)
  if (!telegramToken) return

  if (images && typeof images === 'object') {
    const media = JSON.stringify(
      images.map((photo) => {
        return {
          type: 'photo',
          media: photo,
        }
      })
    )
    await telegramPost(
      `https://api.telegram.org/bot${telegramToken}/sendMediaGroup`,
      {
        chat_id: telegramId,
        media,
        message_thread_id: topicId,
      },
      null,
      // (data) => console.log('data', data),
      (data) => console.log('error', data),
      true
    )
  }
  if (text && typeof text === 'string') {
    const reply_markup = Array.isArray(inline_keyboard) // && req?.headers?.origin?.substr(0, 5) === 'https'
      ? JSON.stringify({
        inline_keyboard: inline_keyboard.filter((button) => button),
      })
      : undefined

    // if (text.length > 4096) {
    const preparedText = splitText(text)
    const result = []
    for (let i = 0; i < preparedText.length; i++) {
      const res = await telegramPost(
        `https://api.telegram.org/bot${telegramToken}/sendMessage`,
        {
          chat_id: telegramId,
          text: preparedText[i],
          parse_mode: 'html',
          message_thread_id: topicId,
          reply_markup:
            i === preparedText.length - 1 ? reply_markup : undefined,
        },
        null,
        // (data) => console.log('data', data),
        (data) => console.log('error', data),
        true
      )
      result.push(res)
    }
    return result
    // } else {
    //   const result = await postData(
    //     `https://api.telegram.org/bot${telegramToken}/sendMessage`,
    //     {
    //       chat_id: telegramId,
    //       text,
    //       parse_mode: 'html',
    //       reply_markup,
    //     },
    //     null,
    //     // (data) => console.log('data', data),
    //     (data) => console.log('error', data),
    //     true,
    //     null,
    //     true
    //   )
    //   return result
    // }
  }
}

const getTelegramResultStatus = (res) => {
  if (!res) return 'unknown'
  if (Array.isArray(res)) {
    let hasSuccess = false
    let hasError = false
    let hasAny = false
    for (const item of res) {
      if (!item) continue
      hasAny = true
      if (item.ok === true) hasSuccess = true
      if (item.ok === false) hasError = true
    }
    if (hasSuccess) return 'success'
    if (hasError || hasAny) return 'error'
    return 'unknown'
  }
  if (res.ok === true) return 'success'
  if (res.ok === false) return 'error'
  return 'unknown'
}

export const sendMessageWithRepeats = async (
  body,
  repeats = 5,
  { retryOnUnknown = true } = {}
) => {
  let result = []
  let error = false
  let status = 'unknown'
  let i = 0
  let res
  do {
    i = i + 1
    res = await sendMessageToTelegramId(body)
    status = getTelegramResultStatus(res)
  } while (
    (status === 'error' || (retryOnUnknown && status === 'unknown')) &&
    i < repeats
  )
  if (status !== 'success') error = true
  result.push(res)
  return { result, error, status }
}

const sendTelegramMessage = async ({
  telegramIds,
  text,
  images,
  inline_keyboard,
  location,
  topicId,
  repeats = 5,
  retryOnUnknown = true,
}) => {
  // const db = await dbConnect(location)
  // if (!db) return

  // if (
  //   !telegramIds ||
  //   !['object', 'string', 'number'].includes(typeof telegramIds)
  // ) {
  //   await db
  //     .model('Test')
  //     .create({ data: { telegramIds }, error: 'Wrong telegramIds' })
  //   return undefined
  // }

  const normalizedTelegramIds = normalizeTelegramIds(telegramIds)
  if (normalizedTelegramIds.length === 0) {
    console.log('[sendTelegramMessage] skip: invalid telegramIds', {
      type: typeof telegramIds,
      hasValue: Boolean(telegramIds),
    })
    return { successes: [], errors: [], successCount: 0, errorCount: 0 }
  }

  const successes = []
  const errors = []
  let error = false
  let errorCount = 0
  let successCount = 0
  if (normalizedTelegramIds.length === 1) {
    const targetTelegramId = normalizedTelegramIds[0]
    const res = await sendMessageWithRepeats(
      {
        telegramId: targetTelegramId,
        text,
        images,
        inline_keyboard,
        location,
        topicId,
      },
      repeats,
      { retryOnUnknown }
    )
    error = res.error
    if (res.error) {
      errors.push({
        body: {
          telegramId: targetTelegramId,
          text,
          images,
          inline_keyboard,
        },
        result: res.result,
      })
      ++errorCount
    } else {
      successes.push({
        body: {
          telegramId: targetTelegramId,
          text,
          images,
          inline_keyboard,
        },
        result: res.result,
      })
      ++successCount
    }
  } else {
    for (const telegramId of normalizedTelegramIds) {
      const res = await sendMessageWithRepeats(
        {
          telegramId,
          text,
          images,
          inline_keyboard,
          location,
          topicId,
        },
        repeats,
        { retryOnUnknown }
      )
      if (res.error) {
        if (!error) error = res.error
        errors.push({
          body: {
            telegramId,
            text,
            images,
            inline_keyboard,
          },
          result: res.result,
        })
        ++errorCount
      } else {
        successes.push({
          body: {
            telegramId,
            text,
            images,
            inline_keyboard,
          },
          result: res.result,
        })
        ++successCount
      }
    }
  }

  // await db.model('Test').create({
  //   data: { successes, errors },
  //   error,
  //   successCount,
  //   errorCount,
  // })

  return { successes, errors, successCount, errorCount }

  // const result = await Promise.all(
  //   telegramIds.map(
  //     async (telegramId) =>
  //       await sendMessageToTelegramId({
  //         req,
  //         telegramId,
  //         text,
  //         images,
  //         inline_keyboard,
  //       })
  //   )
  // )

  // const reduceWay = callback => urls.reduce(
  //   (acc, item) => acc.then(res => fakeFetch(item, res)),
  //   Promise.resolve())
  //   .then(result => callback(result))

  // function fakeFetch (url, params='-') {
  //   // этот вывод в консоль покажет порядок вызовов с их входящими параметрами
  //   console.log(`fakeFetch to: ${url} with params: ${params}`);
  //   return new Promise(resolve => {
  //       setTimeout(() => resolve(`${url} is DONE`), 1000);
  //   })
  // };
}

export default sendTelegramMessage
