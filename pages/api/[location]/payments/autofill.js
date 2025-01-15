import { DEFAULT_EVENT } from '@helpers/constants'
import Events from '@models/Events'
import EventsUsers from '@models/EventsUsers'
import Payments from '@models/Payments'
import Users from '@models/Users'
import CRUD from '@server/CRUD'
import dbConnect from '@utils/dbConnect'

export default async function handler(req, res) {
  const { query, method, body } = req

  const location = query?.location
  if (!location)
    return res?.status(400).json({ success: false, error: 'No location' })

  const db = await dbConnect(location)
  if (!db) return res?.status(400).json({ success: false, error: 'db error' })

  if (method === 'POST') {
    try {
      delete query.location

      const { eventId, payType, payAt, couponForOrganizer } = body.data
      const event = await Events.findById(eventId)

      const eventParticipants = await EventsUsers.find({
        eventId,
        status: 'participant',
      })

      const participantsIds = eventParticipants.map(
        (eventUser) => eventUser.userId
      )
      const participants = await Users.find({
        _id: { $in: participantsIds },
      })

      const paymentsFromAndToParticipantsOfEvent = await Payments.find({
        eventId,
        payDirection: { $in: ['fromUser', 'toUser'] },
        userId: { $in: participantsIds },
      })

      const needToPayUsers = []

      for (let i = 0; i < event.subEvents.length; i++) {
        const subEvent = event.subEvents[i]
        const subEventParticipants = eventParticipants.filter(
          ({ subEventId }) => subEventId === subEvent.id
        )
        const subEventParticipantsIds = subEventParticipants.map(
          (eventUser) => eventUser.userId
        )

        const subEventPrice = subEvent.price
        const subEventPrices = {
          noStatus: subEventPrice,
          novice:
            subEventPrice - (subEvent.usersStatusDiscount?.get('novice') ?? 0),
          member:
            subEventPrice - (subEvent.usersStatusDiscount?.get('member') ?? 0),
          ban: subEventPrice,
        }

        participants.forEach((user) => {
          const userId = user._id.toString()
          if (subEventParticipantsIds.includes(userId)) {
            const eventUser = eventParticipants.find(
              (eventUser) => eventUser.userId === userId
            )
            const userStatus = eventUser?.userStatus ?? 'noStatus'
            // (!user?.status || user.status === 'ban' ? 'novice' : user.status)
            const priceForUser =
              typeof subEventPrices[userStatus] === 'number'
                ? subEventPrices[userStatus]
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
                payType:
                  couponForOrganizer && isUserOrganizer ? 'coupon' : payType,
                payAt,
                sum: userNeedToPay,
                payDirection: 'fromUser',
              })
            }
          }
        })
      }

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
