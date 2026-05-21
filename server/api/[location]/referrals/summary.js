import checkLocationValid from '@server/checkLocationValid'
import dbConnect from '@utils/dbConnect'

const EXCLUDED_STATUSES = ['reserve', 'ban']

const isPaidEvent = (event) =>
  Array.isArray(event?.subEvents) &&
  event.subEvents.some((subEvent) => Number(subEvent?.price ?? 0) > 0)

const toStringSafe = (value) => {
  if (!value && value !== 0) return null
  if (typeof value === 'string') return value
  try {
    return String(value)
  } catch (error) {
    return null
  }
}

const formatEventSummary = (event) => {
  if (!event) return null
  return {
    _id: event?._id ? String(event._id) : null,
    title: event?.title ?? null,
    dateStart: event?.dateStart ?? null,
    dateEnd: event?.dateEnd ?? null,
    date: event?.date ?? null,
    status: event?.status ?? null,
  }
}

export default async function handler(req, res) {
  const { method, query } = req
  const location = query?.location

  if (!location) {
    return res?.status(400).json({ success: false, error: 'No location' })
  }

  if (!checkLocationValid(location)) {
    return res?.status(400).json({ success: false, error: 'Invalid location' })
  }

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res
      ?.status(405)
      .json({ success: false, error: `Method ${method} Not Allowed` })
  }

  const referrerId =
    typeof query?.referrerId === 'string' && query.referrerId.trim().length
      ? query.referrerId.trim()
      : null

  if (!referrerId) {
    return res?.status(200).json({
      success: true,
      data: { referrals: [], referralProgram: null },
    })
  }

  try {
    const db = await dbConnect(location)
    if (!db) {
      return res?.status(500).json({ success: false, error: 'db error' })
    }

    const [siteSettings, referrals] = await Promise.all([
      db.model('SiteSettings').findOne({}, { referralProgram: 1 }).lean(),
      db
        .model('Users')
        .find(
          { referrerId },
          {
            firstName: 1,
            secondName: 1,
            thirdName: 1,
            status: 1,
            security: 1,
            createdAt: 1,
          }
        )
        .lean(),
    ])

    const referralProgram = siteSettings?.referralProgram ?? null
    const requirePaidEvent = referralProgram?.requirePaidEvent ?? false

    const referralIds = Array.isArray(referrals)
      ? referrals
          .map((referral) => toStringSafe(referral?._id))
          .filter(Boolean)
      : []

    const [eventsUsers, couponsRaw] = referralIds.length
      ? await Promise.all([
          db
            .model('EventsUsers')
            .find(
              {
                userId: { $in: referralIds },
                status: { $nin: EXCLUDED_STATUSES },
              },
              { eventId: 1, userId: 1 }
            )
            .lean(),
          db
            .model('Payments')
            .find(
              {
                isReferralCoupon: true,
                userId: referrerId,
                'referralReward.referrerId': referrerId,
                'referralReward.referralUserId': { $in: referralIds },
                'referralReward.rewardFor': 'referrer',
              },
              { sum: 1, payAt: 1, comment: 1, eventId: 1, referralReward: 1 }
            )
            .lean(),
        ])
      : [[], []]

    const eventIds = new Set()

    eventsUsers.forEach((eventUser) => {
      const eventId = toStringSafe(eventUser?.eventId)
      if (eventId) {
        eventIds.add(eventId)
      }
    })

    couponsRaw.forEach((payment) => {
      const usageEventId = toStringSafe(payment?.eventId)
      const rewardEventId = toStringSafe(payment?.referralReward?.eventId)
      if (usageEventId) {
        eventIds.add(usageEventId)
      }
      if (rewardEventId) {
        eventIds.add(rewardEventId)
      }
    })

    const events = eventIds.size
      ? await db
          .model('Events')
          .find(
            { _id: { $in: Array.from(eventIds) } },
            {
              title: 1,
              dateStart: 1,
              dateEnd: 1,
              date: 1,
              status: 1,
              subEvents: 1,
            }
          )
          .lean()
      : []

    const eventsMap = new Map()
    events.forEach((eventDoc) => {
      const eventId = toStringSafe(eventDoc?._id)
      if (eventId) {
        eventsMap.set(eventId, eventDoc)
      }
    })

    const qualifyingEventByReferral = new Map()

    eventsUsers.forEach((eventUser) => {
      const userId = toStringSafe(eventUser?.userId)
      const eventId = toStringSafe(eventUser?.eventId)
      if (!userId || !eventId) return

      const event = eventsMap.get(eventId)
      if (!event || event.status !== 'closed') return
      if (requirePaidEvent && !isPaidEvent(event)) return

      const timestamp = event?.dateStart
        ? new Date(event.dateStart).getTime()
        : event?.date
        ? new Date(event.date).getTime()
        : 0

      const existing = qualifyingEventByReferral.get(userId)
      if (!existing || timestamp > (existing.timestamp ?? 0)) {
        qualifyingEventByReferral.set(userId, {
          timestamp,
          event: formatEventSummary(event),
        })
      }
    })

    const couponsByReferral = new Map()

    couponsRaw.forEach((payment) => {
      const referralUserId = toStringSafe(payment?.referralReward?.referralUserId)
      if (!referralUserId) return

      const usageEventId = toStringSafe(payment?.eventId)
      const rewardEventId = toStringSafe(payment?.referralReward?.eventId)

      const couponDetails = {
        sum: typeof payment?.sum === 'number' ? payment.sum : null,
        payAt: payment?.payAt ?? null,
        comment: payment?.comment ?? '',
        rewardEventId,
        usageEventId,
      }

      const existing = couponsByReferral.get(referralUserId) ?? {}

      if (usageEventId) {
        couponsByReferral.set(referralUserId, {
          ...existing,
          used: {
            ...couponDetails,
            usageEvent: formatEventSummary(eventsMap.get(usageEventId)),
          },
        })
      } else {
        couponsByReferral.set(referralUserId, {
          ...existing,
          issued: {
            ...couponDetails,
            rewardEvent: formatEventSummary(eventsMap.get(rewardEventId)),
          },
        })
      }
    })

    const formattedReferrals = referrals.map((referral) => {
      const id = toStringSafe(referral?._id)
      const qualifyingEvent = qualifyingEventByReferral.get(id)?.event ?? null
      const coupon = couponsByReferral.get(id) ?? null
      const conditionMet = Boolean(
        qualifyingEvent || coupon?.issued || coupon?.used
      )

      return {
        _id: id,
        firstName: referral?.firstName ?? '',
        secondName: referral?.secondName ?? '',
        thirdName: referral?.thirdName ?? '',
        status: referral?.status ?? null,
        security: referral?.security ?? null,
        createdAt: referral?.createdAt ?? null,
        qualifyingEvent,
        coupon,
        conditionMet,
      }
    })

    return res?.status(200).json({
      success: true,
      data: {
        referrals: formattedReferrals,
        referralProgram,
      },
    })
  } catch (error) {
    console.error('Failed to fetch referrals summary', error)
    return res
      ?.status(500)
      .json({ success: false, error: 'Failed to load referrals summary' })
  }
}
