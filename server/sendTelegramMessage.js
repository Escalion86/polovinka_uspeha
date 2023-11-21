import { postData } from '@helpers/CRUD'
import Test from '@models/Test'

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
    const reply_markup =
      inline_keyboard && req?.headers?.origin?.substr(0, 5) === 'https'
        ? JSON.stringify({
            inline_keyboard: inline_keyboard.filter((botton) => botton),
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

const sendTelegramMessage = async ({
  req,
  telegramIds,
  text,
  images,
  inline_keyboard,
}) => {
  if (
    !telegramIds ||
    !['object', 'string', 'number'].includes(typeof telegramIds)
  )
    return undefined

  if (['string', 'number'].includes(typeof telegramIds)) {
    return await sendMessageToTelegramId({
      req,
      telegramId: telegramIds,
      text,
      images,
      inline_keyboard,
    })
  }

  let result = []
  let error = false
  for (const telegramId of telegramIds) {
    let i = 0
    let res
    do {
      i = i + 1
      res = await sendMessageToTelegramId({
        req,
        telegramId,
        text,
        images,
        inline_keyboard,
      })
    } while (res || i < 5)
    if (i >= 5) error = true
    result.push(res)
  }

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

  await Test.create({ data: result, error })
}

export default sendTelegramMessage
