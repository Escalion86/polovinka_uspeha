import Roles from '@models/Roles'
// import CRUD from '@server/CRUD'
import dbConnect from '@utils/dbConnect'

export default async function handler(req, res) {
  const { query, method, body } = req

  await dbConnect()
  if (method === 'POST') {
    try {
      const roles = body.data
      if (!roles) {
        return res?.status(400).json({
          success: false,
          data: { error: `Can't update roles (no roles)` },
        })
      }
      const data = []
      await Roles.deleteMany({})
      for (const role of roles) {
        const res = await Roles.create(role)
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
      // const siteSettings = await SiteSettings.findOne()
      // if (!siteSettings) {
      //   const newSiteSettings = await SiteSettings.create(body)
      //   if (!newSiteSettings)
      //   return res
      //     ?.status(200)
      //     .json({ success: false, data: { error: "Can't create settings" } })
      //     return res?.status(201).json({ success: true, data: newSiteSettings })
      // }

      // const data = await SiteSettings.findOneAndUpdate({}, body)

      // const newEventUser = await EventsUsers.create({
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
  //     const data = await SiteSettings.find()
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
  // return await CRUD(Reviews, req, res)
}
