import checkLocationValid from '@server/checkLocationValid'
// import CRUD from '@server/CRUD'
import dbConnect from '@utils/dbConnect'

export default async function handler(req, res) {
  const { query, method, body } = req

  const location = query?.location
  if (!location)
    return res?.status(400).json({ success: false, error: 'No location' })

  if (!checkLocationValid(location))
    return res?.status(400).json({ success: false, error: 'Invalid location' })

  const db = await dbConnect(location)
  if (!db) return res?.status(400).json({ success: false, error: 'db error' })
  if (method === 'POST') {
    try {
      delete query.location
      const roles = body.data
      if (!roles) {
        return res?.status(400).json({
          success: false,
          data: { error: `Can't update roles (no roles)` },
        })
      }
      const data = []
      await db.model('Roles').deleteMany({})
      for (const role of roles) {
        const res = await db.model('Roles').create(role)
        data.push(res)
      }

      // if (data.length === 0) {
      //   return res?.status(400).json({
      //     success: false,
      //     data: { error: `Can't update roles` },
      //   })
      // }

      return res?.status(201).json({ success: true, data })
      // Сначала находим запись
      // const siteSettings = await db.model('SiteSettings').findOne()
      // if (!siteSettings) {
      //   const newSiteSettings = await db.model('SiteSettings').create(body)
      //   if (!newSiteSettings)
      //   return res
      //     ?.status(200)
      //     .json({ success: false, data: { error: "Can't create settings" } })
      //     return res?.status(201).json({ success: true, data: newSiteSettings })
      // }

      // const data = await db.model('SiteSettings').findOneAndUpdate({}, body)

      // const newEventUser = await db.model('EventsUsers').create({
      //   eventId,
      //   userId,
      // })

      // if (!newEventUser) {
      //   return res?.status(400).json({
      //     success: false,
      //     data: { error: `Can't create user registration on event` },
      //   })
      // }

      // return res?.status(201).json({ success: true, data: newEventUser })
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }
  // if (method === 'GET') {
  //   try {
  //     const data = await db.model('SiteSettings').find()
  //     if (!data) {
  //       return res?.status(400).json({ success: false })
  //     }
  //     return res
  //       ?.status(200)
  //       .json({ success: true, data: data.length > 0 ? data[0] : {} })
  //   } catch (error) {
  //     console.log(error)
  //     return res?.status(400).json({ success: false, error })
  //   }
  // }
  return res?.status(400).json({ success: false, error: 'Wrong method' })
}
