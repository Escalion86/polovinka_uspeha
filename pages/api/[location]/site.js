import compareObjectsWithDif from '@helpers/compareObjectsWithDif'
import checkLocationValid from '@server/checkLocationValid'
// import CRUD from '@server/CRUD'
import dbConnect from '@utils/dbConnect'
import mongoose from 'mongoose'

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

      const oldData = await db.model('SiteSettings').findOne({}).lean()

      const data = await db
        .model('SiteSettings')
        .findOneAndUpdate({}, body.data, {
          new: true,
          upsert: true, // Make this update into an upsert
        })
      if (!data) {
        return res?.status(400).json({
          success: false,
          data: { error: `Can't update settings` },
        })
      }

      const difference = compareObjectsWithDif(oldData, data)

      await db.model('Histories').create({
        schema: 'sitesettings',
        action: 'update',
        data: difference,
        userId: body.userId,
        difference: true,
      })

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
  if (method === 'GET') {
    try {
      delete query.location

      const data = await db.model('SiteSettings').find()
      if (!data) {
        return res?.status(400).json({ success: false })
      }
      return res
        ?.status(200)
        .json({ success: true, data: data.length > 0 ? data[0] : {} })
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }
  return res?.status(400).json({ success: false, error: 'Wrong method' })
}
