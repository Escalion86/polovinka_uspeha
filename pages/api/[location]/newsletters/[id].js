import checkLocationValid from '@server/checkLocationValid'
import { whatsappConstants } from '@server/constants'
import CRUD from '@server/CRUD'
import dbConnect from '@utils/dbConnect'

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default async function handler(req, res) {
  const { query, method, body } = req

  const location = query?.location
  if (!location)
    return res?.status(400).json({ success: false, error: 'No location' })

  if (!checkLocationValid(location))
    return res?.status(400).json({ success: false, error: 'Invalid location' })

  if (method === 'PUT') {
    const { messageStatusesUpdate } = body.data
    if (messageStatusesUpdate) {
      delete query.location

      const db = await dbConnect(location)
      if (!db)
        return res?.status(400).json({ success: false, error: 'db error' })

      const newsletter = await db.model('Newsletters').findById(query.id)
      if (!newsletter)
        return res?.status(400).json({ success: false, error: 'No newsletter' })

      const { urlWithInstance, token } = whatsappConstants[location]

      const url = `${urlWithInstance}/getMessage/${token}`

      const updatedNewsletters = []
      let i = 0
      while (i < newsletter.newsletters.length) {
        // const updatedNewsletters = await Promise.all(
        //   newsletter.newsletters.map(async (item) => {
        const item = newsletter.newsletters[i]
        const { userId, whatsappMessageId, whatsappPhone } = item
        var phone = whatsappPhone
        if (!whatsappPhone) {
          const user = await db
            .model('Users')
            .findById(userId)
            .select({ phone: 1, whatsapp: 1 })
            .lean()
          phone = user?.whatsapp || user?.phone
        }
        if (phone && whatsappMessageId) {
          const resp = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chatId: `${phone}@c.us`,
              idMessage: whatsappMessageId,
            }),
          })
          // console.log('resp :>> ', resp)
          console.log('resp.status :>> ', i + ' <== ' + resp.status)
          if (resp.status === 200 || resp.status === 400) {
            const respJson = await resp.json()
            updatedNewsletters.push({
              ...item,
              whatsappPhone: phone,
              whatsappStatus: respJson?.statusMessage || respJson?.message,
              whatsappSuccess: !!respJson?.statusMessage,
            })
            i++
            await timeout(10)
          } else {
            console.log('resp :>> ', resp)
            console.log('object :>> ', { phone, whatsappMessageId })
            // updatedNewsletters.push({
            //   ...item,
            //   whatsappPhone: phone,
            //   whatsappStatus: false,
            //   whatsappSuccess: 'error',
            // })
            await timeout(300)
          }
        } else {
          updatedNewsletters.push({
            ...item,
            whatsappPhone: phone,
            whatsappStatus: false,
            whatsappSuccess: 'error',
          })
          i++
          await timeout(10)
        }
      }
      // )
      // )

      const updatedNewsletter = await db.model('Newsletters').findByIdAndUpdate(
        query.id,
        {
          newsletters: updatedNewsletters,
        },
        { new: true }
      )
      // console.log('updatedNewsletter :>> ', updatedNewsletter)
      return res?.status(200).json({ success: true, data: updatedNewsletter })
    }
    // const { phone, userId, messageStatus } = body.data
    // console.log('body.data :>> ', body.data)
    // if (phone && userId && messageStatus) {
    //   delete query.location

    //   const db = await dbConnect(location)
    //   if (!db)
    //     return res?.status(400).json({ success: false, error: 'db error' })

    //   const data = await db.model('Newsletters').findByIdAndUpdate(
    //     query.id,
    //     { $set: { 'newsletters.$[elem].whatsappStatus': messageStatus } },
    //     { arrayFilters: [{ 'elem.userId': userId }] }
    //     // (err, result) => {
    //     //   if (err) {
    //     //     console.error(err)
    //     //   } else {
    //     //     console.log(result)
    //     //   }
    //     // }
    //   )
    //   return res?.status(200).json({ success: true, data })
    // }
  }

  return await CRUD('Newsletters', req, res)
}
