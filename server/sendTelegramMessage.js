import { postData } from '@helpers/CRUD'

const sendTelegramMessage = async ({
  req,
  telegramIds,
  text,
  images,
  inline_keyboard,
}) => {
  return await Promise.all(
    telegramIds.map(async (telegramId) => {
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
          (data) => console.log('data', data),
          (data) => console.log('error', data),
          true,
          null,
          true
        )
      }
      if (text && typeof text === 'string') {
        const reply_markup =
          inline_keyboard && req.headers.origin.substr(0, 5) === 'https'
            ? JSON.stringify({
                inline_keyboard: inline_keyboard.filter((botton) => botton),
              })
            : undefined

        await postData(
          `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
          {
            chat_id: telegramId,
            text,
            parse_mode: 'html',
            reply_markup,
          },
          (data) => console.log('data', data),
          (data) => console.log('error', data),
          true,
          null,
          true
        )
      }
    })
  )
}

export default sendTelegramMessage
