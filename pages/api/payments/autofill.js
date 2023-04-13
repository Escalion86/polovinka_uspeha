import { DEFAULT_EVENT } from '@helpers/constants'
import Events from '@models/Events'
import EventsUsers from '@models/EventsUsers'
import Payments from '@models/Payments'
import Users from '@models/Users'
import CRUD from '@server/CRUD'
import dbConnect from '@utils/dbConnect'

export default async function handler(req, res) {
  const { query, method, body } = req

  await dbConnect()
  if (method === 'POST') {
    try {
      const { eventId, payType, payAt, couponForOrganizer } = body.data
      const event = await Events.findById(eventId)
      const eventPrice = event.price
      const eventPrices = {
        noStatus: eventPrice,
        novice: eventPrice - (event.usersStatusDiscount?.get('novice') ?? 0),
        member: eventPrice - (event.usersStatusDiscount?.get('member') ?? 0),
        ban: eventPrice,
      }

      const eventParticipants = await EventsUsers.find({
        eventId,
        status: 'participant',
      })

      const eventParticipantsIds = eventParticipants.map(
        (eventUser) => eventUser.userId
      )

      const participants = await Users.find({
        _id: { $in: eventParticipantsIds },
      })

      const paymentsFromAndToParticipantsOfEvent = await Payments.find({
        eventId,
        payDirection: { $in: ['fromUser', 'toUser'] },
        userId: { $in: eventParticipantsIds },
      })

      const needToPayUsers = []

      participants.forEach((user) => {
        const userId = user._id.toString()
        const eventUser = eventParticipants.find(
          (eventUser) => eventUser.userId === userId
        )
        const userStatus = eventUser?.userStatus ?? 'noStatus'
        // (!user?.status || user.status === 'ban' ? 'novice' : user.status)
        const priceForUser =
          typeof eventPrices[userStatus] === 'number'
            ? eventPrices[userStatus]
            : 0
        const userPayments = paymentsFromAndToParticipantsOfEvent.filter(
          (payment) => payment.userId === userId
        )
        const userPaid = userPayments.reduce(
          (total, payment) =>
            total +
            (payment.sum ?? 0) *
              (payment.payDirection === 'toUser' ||
              payment.payDirection === 'toEvent'
                ? -1
                : 1),
          0
        )
        const userNeedToPay = priceForUser - userPaid
        const isUserOrganizer = userId === event.organizerId
        if (userNeedToPay > 0) {
          needToPayUsers.push({
            sector: 'event',
            eventId,
            userId,
            payType: couponForOrganizer && isUserOrganizer ? 'coupon' : payType,
            payAt,
            sum: userNeedToPay,
            payDirection: 'fromUser',
          })
        }
      })

      const payments =
        needToPayUsers.length > 0
          ? await Payments.insertMany(needToPayUsers)
          : []
      // const updatedEvents = await Promise.all(
      //   events.map(async (event) => {
      //     if (event?.duration) {
      //       const dateStart = event.date ?? new Date()
      //       const dateEnd = new Date(
      //         new Date(dateStart).getTime() +
      //           (event?.duration ?? DEFAULT_EVENT.duration) * 60000
      //       )
      //       await Events.findByIdAndUpdate(event._id, { dateStart, dateEnd })
      //     }
      //   })
      // ).catch((error) => {
      //   console.log(error)
      //   return res?.status(400).json({ success: false, error })
      // })
      // const eventsUpdated = await Events.find({})
      return res?.status(201).json({ success: true, data: payments })
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }

  return await CRUD(Events, req, res)
}
