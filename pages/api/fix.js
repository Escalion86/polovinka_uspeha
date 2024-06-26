// import Events from '@models/Events'
// import EventsUsers from '@models/EventsUsers'
import Events from '@models/Events'
import EventsUsers from '@models/EventsUsers'
import Histories from '@models/Histories'
import Users from '@models/Users'
import dbConnect from '@utils/dbConnect'

export default async function handler(req, res) {
  const { query, method, body } = req
  if (method === 'GET') {
    if (query.test) {
      await dbConnect()

      // Восстановление из истории
      // const histories = await Histories.find({
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
      //         await EventsUsers.create(el)
      //         ++eventUsersAdded
      //         console.log('add Event')
      //       }
      //     }
      //     if (action === 'delete') {
      //       for (let j = 0; j < data.length; j++) {
      //         const el = data[j]
      //         await EventsUsers.findByIdAndDelete(el._id)
      //         ++eventUsersDeleted
      //       }
      //     }
      //   } else if (schema === 'events') {
      //     if (action === 'add') {
      //       const el = data[0]
      //       await Events.create(el)
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
      //       await Events.findByIdAndUpdate(id, newData)
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

      console.log('1 :>> ', 1)

      const users = await Users.updateMany(
        {},
        {
          $unset: {
            image: '',
            interests: '',
            firstname: '',
            secondname: '',
            thirdname: '',
            about: '',
            profession: '',
          },
        }
      )

      console.log('users :>> ', users)

      const events = await Events.updateMany(
        {},
        {
          $unset: {
            duration: '',
            date: '',
            price: '',
            maxParticipants: '',
            maxMans: '',
            maxWomans: '',
            minMansAge: '',
            maxMansAge: '',
            minWomansAge: '',
            maxWomansAge: '',
            usersStatusAccess: '',
            usersStatusDiscount: '',
            isReserveActive: '',
            maxMansMember: '',
            maxMansNovice: '',
            maxWomansMember: '',
            maxWomansNovice: '',
          },
        }
      )

      console.log('events :>> ', events)

      // console.log(
      //   '!! :>> ',
      //   users.map(({ interests }) => interests)
      // )
      // const users = await Users.updateMany(
      //   { interests: { $ne: '' } },
      //   { interests: '' }
      // )
      // const events = await Events.updateMany(
      //   {
      //     dateStart: { $lt: new Date(2023, 0, 1) },
      //     status: 'active',
      //   },
      //   { status: 'closed' }
      // )

      // const events = await Events.find()
      // for (let i = 0; i < events.length; i++) {
      //   const event = events[i]
      //   console.log('event :>> ', `${i + 1}/${events.length}`)
      //   await Events.findByIdAndUpdate(event._id, {
      //     subEvents: [
      //       {
      //         id: event._id,
      //         title: '',
      //         description: '',
      //         price: event.price,
      //         maxParticipants: event.maxParticipants,
      //         maxMans: event.maxMans,
      //         maxWomans: event.maxWomans,
      //         maxMansNovice: event.maxMansNovice,
      //         maxWomansNovice: event.maxWomansNovice,
      //         maxMansMember: event.maxMansMember,
      //         maxWomansMember: event.maxWomansMember,
      //         minMansAge: event.minMansAge,
      //         minWomansAge: event.minWomansAge,
      //         maxMansAge: event.maxMansAge,
      //         maxWomansAge: event.maxWomansAge,
      //         usersStatusAccess: event.usersStatusAccess,
      //         usersStatusDiscount: event.usersStatusDiscount,
      //         usersRelationshipAccess: event.usersRelationshipAccess,
      //         isReserveActive: event.isReserveActive,
      //       },
      //     ],
      //   })

      //   const eventUsers = await EventsUsers.find({
      //     eventId: String(event._id),
      //   })
      //   for (let j = 0; j < eventUsers.length; j++) {
      //     const eventUser = eventUsers[j]
      //     await EventsUsers.findByIdAndUpdate(eventUser._id, {
      //       subEventId: String(event._id),
      //       // $unset: { priceId: 1, eventSubtypeNum: 1 },
      //     })
      //   }
      // }
      // const updatedEvents = await Events.find()
      // const events = await Events.updateMany(
      //   {
      //     dateStart: { $lt: new Date(2023, 0, 1) },
      //     status: 'active',
      //   },
      //   { status: 'closed' }
      // )
      // return { updatedEvents }
      return res?.status(201).json({
        success: true,
        data: 'ok',
      })
    }
  }
  // return await CRUD(Users, req, res)
}
