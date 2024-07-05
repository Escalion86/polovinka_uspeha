import { postData } from '@helpers/CRUD'
import Test from '@models/Test'
import dbConnect from '@utils/dbConnect'

export const sendMessageToTelegramId = async ({
  req,
  telegramId,
  text,
  images,
  inline_keyboard,
}) => {
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
      `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMediaGroup`,
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

    const result = await postData(
      `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: telegramId,
        text,
        parse_mode: 'html',
        reply_markup,
      },
      null,
      // (data) => console.log('data', data),
      (data) => console.log('error', data),
      true,
      null,
      true
    )
    return result
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
  req,
  telegramIds,
  text,
  images,
  inline_keyboard,
}) => {
  await dbConnect()
  if (
    !telegramIds ||
    !['object', 'string', 'number'].includes(typeof telegramIds)
  ) {
    await Test.create({ data: { telegramIds }, error: 'Wrong telegramIds' })
    return undefined
  }

  let result = []
  let error = false
  if (['string', 'number'].includes(typeof telegramIds)) {
    const res = await sendMessageWithRepeats({
      req,
      telegramId: telegramIds,
      text,
      images,
      inline_keyboard,
    })
    result.push(res.result)
    error = res.error
  } else {
    for (const telegramId of telegramIds) {
      const res = await sendMessageWithRepeats({
        req,
        telegramId,
        text,
        images,
        inline_keyboard,
      })
      result.push(res.result)
      if (!error) error = res.error
    }
  }

  await Test.create({ data: result, error })

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
