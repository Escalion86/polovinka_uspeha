import { postData } from '@helpers/CRUD'

import dbConnect from '@utils/dbConnect'
import getTelegramTokenByLocation from './getTelegramTokenByLocation'
import splitText from '@helpers/splitText'

const sendMessageToTelegramId = async ({
  telegramId,
  text,
  images,
  inline_keyboard,
  location,
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
    await postData(
      `https://api.telegram.org/bot${telegramToken}/sendMediaGroup`,
      {
        chat_id: telegramId,
        media,
      },
      null,
      // (data) => console.log('data', data),
      (data) => console.log('error', data),
      true,
      null,
      true
    )
  }
  if (text && typeof text === 'string') {
    const reply_markup = inline_keyboard // && req?.headers?.origin?.substr(0, 5) === 'https'
      ? JSON.stringify({
          inline_keyboard: inline_keyboard.filter((button) => button),
        })
      : undefined

    // if (text.length > 4096) {
    const preparedText = splitText(text)
    const result = []
    for (let i = 0; i < preparedText.length; i++) {
      const res = await postData(
        `https://api.telegram.org/bot${telegramToken}/sendMessage`,
        {
          chat_id: telegramId,
          text: preparedText[i],
          parse_mode: 'html',
          reply_markup:
            i === preparedText.length - 1 ? reply_markup : undefined,
        },
        null,
        // (data) => console.log('data', data),
        (data) => console.log('error', data),
        true,
        null,
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

export const sendMessageWithRepeats = async (body, repeats = 5) => {
  let result = []
  let error = false
  let i = 0
  let res
  do {
    i = i + 1
    res = await sendMessageToTelegramId(body)
  } while (!res && i < repeats)
  if (i >= repeats) error = true
  result.push(res)
  return { result, error }
}

const sendTelegramMessage = async ({
  telegramIds,
  text,
  images,
  inline_keyboard,
  location,
}) => {
  const db = await dbConnect(location)
  if (!db) return

  if (
    !telegramIds ||
    !['object', 'string', 'number'].includes(typeof telegramIds)
  ) {
    await db
      .model('Test')
      .create({ data: { telegramIds }, error: 'Wrong telegramIds' })
    return undefined
  }

  const successes = []
  const errors = []
  let error = false
  let errorCount = 0
  let successCount = 0
  if (['string', 'number'].includes(typeof telegramIds)) {
    const res = await sendMessageWithRepeats({
      telegramId: telegramIds,
      text,
      images,
      inline_keyboard,
      location,
    })
    error = res.error
    if (res.error) {
      errors.push({
        body: {
          telegramId: telegramIds,
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
          telegramId: telegramIds,
          text,
          images,
          inline_keyboard,
        },
        result: res.result,
      })
      ++successCount
    }
  } else {
    for (const telegramId of telegramIds) {
      const res = await sendMessageWithRepeats({
        telegramId,
        text,
        images,
        inline_keyboard,
        location,
      })
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

  await db.model('Test').create({
    data: { successes, errors },
    error,
    successCount,
    errorCount,
  })

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
