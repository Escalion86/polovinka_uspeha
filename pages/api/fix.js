// import Events from '@models/Events'
// import EventsUsers from '@models/EventsUsers'
import Users from '@models/Users'
import dbConnect from '@utils/dbConnect'

export default async function handler(req, res) {
  const { query, method, body } = req
  if (method === 'GET') {
    if (query.test) {
      await dbConnect()
      console.log('! :>> ')
      const users = await Users.updateMany(
        {},
        {
          $unset: {
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
      return res?.status(201).json({ success: true, data: 'ok' })
    }
  }
  // return await CRUD(Users, req, res)
}
