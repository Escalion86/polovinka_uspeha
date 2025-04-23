import { LOCATIONS_KEYS_VISIBLE } from '@helpers/constants'

import dbConnect from '@utils/dbConnect'

export default async function handler(req, res) {
  const { query, method, body } = req

  if (method === 'GET') {
    if (query.test) {
      for (const location of LOCATIONS_KEYS_VISIBLE) {
        const db = await dbConnect(location)

        if (!db)
          return res?.status(400).json({ success: false, error: 'db error' })

        // Восстановление из истории
        // const histories = await db.model('Histories').find({
        //   createdAt: { $gt: new Date('2024-03-26') },
        // })
        // console.log('histories.length :>> ', histories.length)
        // // console.log('histories[0] :>> ', histories[0])

        // let eventsAdded = 0,
        //   eventsUpdated = 0,
        //   eventUsersAdded = 0,
        //   eventUsersDeleted = 0,
        //   other = 0
        // for (let i = 0; i < histories.length; i++) {
        //   const { data, schema, action } = histories[i]

        //   if (schema === 'eventsusers') {
        //     if (action === 'add') {
        //       for (let j = 0; j < data.length; j++) {
        //         const el = data[j]
        //         await db.model('EventsUsers').create(el)
        //         ++eventUsersAdded
        //         console.log('add Event')
        //       }
        //     }
        //     if (action === 'delete') {
        //       for (let j = 0; j < data.length; j++) {
        //         const el = data[j]
        //         await db.model('EventsUsers').findByIdAndDelete(el._id)
        //         ++eventUsersDeleted
        //       }
        //     }
        //   } else if (schema === 'events') {
        //     if (action === 'add') {
        //       const el = data[0]
        //       await db.model('Events').create(el)
        //       ++eventsAdded
        //     }
        //     if (action === 'update') {
        //       const el = data[0]
        //       const id = el._id
        //       delete el._id
        //       const newData = {}
        //       for (const [key, value] of Object.entries(el)) {
        //         newData[key] = el[key].new
        //       }
        //       await db.model('Events').findByIdAndUpdate(id, newData)
        //       ++eventsUpdated
        //     }
        //   } else {
        //     ++other
        //   }
        // }
        // console.log({
        //   eventsAdded,
        //   eventsUpdated,
        //   eventUsersAdded,
        //   eventUsersDeleted,
        //   other,
        // })
        // return res?.status(201).json({
        //   success: true,
        //   data: {
        //     eventsAdded,
        //     eventsUpdated,
        //     eventUsersAdded,
        //     eventUsersDeleted,
        //     other,
        //   },
        // })

        //Старое и исправленное
        // const users = await db.model('Users').collection.updateMany(
        //   {},
        //   {
        //     $unset: {
        //       image: 1,
        //       interests: 1,
        //       firstname: 1,
        //       secondname: 1,
        //       thirdname: 1,
        //       about: 1,
        //       profession: 1,
        //       orientation: 1,
        //     },
        //     $set: {
        //       'notifications.whatsapp.active': true,
        //     },
        //   }
        // )
        // const usersShowContactsTrue = await db
        //   .model('Users')
        //   .collection.updateMany(
        //     { 'security.showContacts': true },
        //     {
        //       $set: {
        //         'security.showPhone': true,
        //         'security.showWhatsapp': true,
        //         'security.showViber': true,
        //         'security.showTelegram': true,
        //         'security.showInstagram': true,
        //         'security.showVk': true,
        //         'security.showEmail': true,
        //       },
        //       $unset: {
        //         'security.showContacts': 1,
        //       },
        //     }
        //   )

        // const usersShowContactsFalse = await db
        //   .model('Users')
        //   .collection.updateMany(
        //     { 'security.showContacts': false },
        //     {
        //       $set: {
        //         'security.showPhone': false,
        //         'security.showWhatsapp': false,
        //         'security.showViber': false,
        //         'security.showTelegram': false,
        //         'security.showInstagram': false,
        //         'security.showVk': false,
        //         'security.showEmail': false,
        //       },
        //       $unset: {
        //         'security.showContacts': 1,
        //       },
        //     }
        //   )

        // const events = await db.model('Events').collection.updateMany(
        //   {},
        //   {
        //     $unset: {
        //       duration: 1,
        //       date: 1,
        //       price: 1,
        //       maxParticipants: 1,
        //       maxMans: 1,
        //       maxWomans: 1,
        //       minMansAge: 1,
        //       maxMansAge: 1,
        //       minWomansAge: 1,
        //       maxWomansAge: 1,
        //       usersStatusAccess: 1,
        //       usersStatusDiscount: 1,
        //       isReserveActive: 1,
        //       maxMansMember: 1,
        //       maxMansNovice: 1,
        //       maxWomansMember: 1,
        //       maxWomansNovice: 1,
        //     },
        //   }
        // )

        // const directions = await db.model('Directions').collection.updateMany(
        //   {},
        //   {
        //     $unset: {
        //       plugins: 1,
        //     },
        //   }
        // )

        const eventsNotBlanks = await db.model('Events').collection.updateMany(
          {
            $or: [
              { blank: { $exists: false } },
              { blank: null },
              { blank: undefined },
            ],
          },
          { $set: { blank: false } }
        )
      }
      return res?.status(201).json({
        success: true,
        data: 'ok',
      })
    }
  }
  return res?.status(400).json({ success: false, error: 'wrong method' })
}
