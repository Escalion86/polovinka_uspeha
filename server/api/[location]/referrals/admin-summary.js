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

const formatUserSummary = (user) => {
  if (!user) return null
  return {
    _id: toStringSafe(user?._id),
    firstName: user?.firstName ?? null,
    secondName: user?.secondName ?? null,
    thirdName: user?.thirdName ?? null,
    status: user?.status ?? null,
    security: user?.security ?? null,
  }
}

const formatEventSummary = (event) => {
  if (!event) return null
  return {
    _id: toStringSafe(event?._id),
    title: event?.title ?? null,
    dateStart: event?.dateStart ?? null,
    dateEnd: event?.dateEnd ?? null,
    date: event?.date ?? null,
    status: event?.status ?? null,
  }
}

const pickLatestByDate = (existing, candidate) => {
  if (!candidate) return existing ?? null
  if (!existing) return candidate

  const existingTime = existing?.payAt ? new Date(existing.payAt).getTime() : 0
  const candidateTime = candidate?.payAt ? new Date(candidate.payAt).getTime() : 0

  return candidateTime >= existingTime ? candidate : existing
}

const formatCouponDetail = (detail, eventsSummaryMap) => {
  if (!detail) return null

  const eventId = detail?.eventId ? String(detail.eventId) : null
  const usageEventId = detail?.usageEventId ? String(detail.usageEventId) : null

  return {
    sum: typeof detail?.sum === 'number' ? detail.sum : null,
    payAt: detail?.payAt ?? null,
    comment: detail?.comment ?? '',
    eventId,
    usageEventId,
    event: eventId ? eventsSummaryMap.get(eventId) ?? null : null,
    usageEvent: usageEventId ? eventsSummaryMap.get(usageEventId) ?? null : null,
  }
}

export default async function handler(req, res) {
  const { query, method } = req
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

  try {
    const db = await dbConnect(location)
    if (!db) {
      return res?.status(500).json({ success: false, error: 'db error' })
    }

    const [siteSettings, referralsRaw] = await Promise.all([
      db.model('SiteSettings').findOne({}, { referralProgram: 1 }).lean(),
      db
        .model('Users')
        .find(
          {
            referrerId: { $exists: true, $ne: null, $ne: '' },
          },
          {
            referrerId: 1,
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

    const referrals = Array.isArray(referralsRaw) ? referralsRaw : []

    const referrerIdsSet = new Set()
    const referralIds = []

    referrals.forEach((referral) => {
      const referrerId = toStringSafe(referral?.referrerId)
      if (referrerId) {
        referrerIdsSet.add(referrerId)
      }
      const referralId = toStringSafe(referral?._id)
      if (referralId) {
        referralIds.push(referralId)
      }
    })

    const referrerIds = Array.from(referrerIdsSet)

    const [referrersRaw, eventsUsersRaw, paymentsRaw] = await Promise.all([
      referrerIds.length
        ? db
            .model('Users')
            .find(
              { _id: { $in: referrerIds } },
              {
                firstName: 1,
                secondName: 1,
                thirdName: 1,
                status: 1,
                security: 1,
              }
            )
            .lean()
        : Promise.resolve([]),
      referralIds.length
        ? db
            .model('EventsUsers')
            .find(
              {
                userId: { $in: referralIds },
                status: { $nin: EXCLUDED_STATUSES },
              },
              {
                userId: 1,
                eventId: 1,
                createdAt: 1,
              }
            )
            .lean()
        : Promise.resolve([]),
      referralIds.length
        ? db
            .model('Payments')
            .find(
              {
                isReferralCoupon: true,
                'referralReward.referralUserId': { $in: referralIds },
              },
              {
                sum: 1,
                payAt: 1,
                eventId: 1,
                userId: 1,
                comment: 1,
                referralReward: 1,
              }
            )
            .lean()
        : Promise.resolve([]),
    ])

    const eventIdsSet = new Set()

    eventsUsersRaw.forEach((eventUser) => {
      const eventId = toStringSafe(eventUser?.eventId)
      if (eventId) {
        eventIdsSet.add(eventId)
      }
    })

    paymentsRaw.forEach((payment) => {
      const usageEventId = toStringSafe(payment?.eventId)
      if (usageEventId) {
        eventIdsSet.add(usageEventId)
      }
      const rewardEventId = toStringSafe(payment?.referralReward?.eventId)
      if (rewardEventId) {
        eventIdsSet.add(rewardEventId)
      }
    })

    const eventIds = Array.from(eventIdsSet)

    const eventsRaw = eventIds.length
      ? await db
          .model('Events')
          .find(
            { _id: { $in: eventIds } },
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

    const eventsSummaryMap = new Map()
    const eventsRawMap = new Map()

    eventsRaw.forEach((eventDoc) => {
      const eventId = toStringSafe(eventDoc?._id)
      if (!eventId) return
      eventsRawMap.set(eventId, eventDoc)
      eventsSummaryMap.set(eventId, formatEventSummary(eventDoc))
    })

    const referrersMap = new Map()
    referrersRaw.forEach((referrer) => {
      const referrerId = toStringSafe(referrer?._id)
      if (referrerId) {
        referrersMap.set(referrerId, referrer)
      }
    })

    const conditionStatusByUser = new Map()

    eventsUsersRaw.forEach((eventUser) => {
      const userId = toStringSafe(eventUser?.userId)
      const eventId = toStringSafe(eventUser?.eventId)
      if (!userId || !eventId) return

      const eventDoc = eventsRawMap.get(eventId)
      if (!eventDoc || eventDoc.status !== 'closed') return

      if (requirePaidEvent && !isPaidEvent(eventDoc)) return

      const baseDate =
        eventDoc?.dateStart ?? eventDoc?.date ?? eventUser?.createdAt ?? null
      const timestamp = baseDate ? new Date(baseDate).getTime() : 0

      const detail = {
        met: true,
        event: formatEventSummary(eventDoc),
        timestamp,
      }

      const existing = conditionStatusByUser.get(userId)
      if (!existing || timestamp > (existing?.timestamp ?? 0)) {
        conditionStatusByUser.set(userId, detail)
      }
    })

    const couponsByPair = new Map()

    paymentsRaw.forEach((payment) => {
      if (!payment?.isReferralCoupon) return

      const reward = payment?.referralReward ?? {}
      const referralUserId = toStringSafe(reward?.referralUserId)
      if (!referralUserId) return

      const referrerId =
        toStringSafe(reward?.referrerId) ?? toStringSafe(payment?.userId) ?? 'null'

      const key = `${referrerId}|${referralUserId}`

      const detail = {
        sum: typeof payment?.sum === 'number' ? payment.sum : null,
        payAt: payment?.payAt ?? null,
        comment: payment?.comment ?? '',
        eventId: toStringSafe(reward?.eventId),
        usageEventId: toStringSafe(payment?.eventId),
      }

      const entry =
        couponsByPair.get(key) ?? {
          referrer: { issued: null, used: null },
          referral: { issued: null, used: null },
        }

      const rewardFor = reward?.rewardFor
      if (rewardFor === 'referrer') {
        if (detail.usageEventId) {
          entry.referrer.used = pickLatestByDate(entry.referrer.used, detail)
        } else {
          entry.referrer.issued = pickLatestByDate(entry.referrer.issued, detail)
        }
      } else if (rewardFor === 'referral') {
        if (detail.usageEventId) {
          entry.referral.used = pickLatestByDate(entry.referral.used, detail)
        } else {
          entry.referral.issued = pickLatestByDate(entry.referral.issued, detail)
        }
      } else {
        if (detail.usageEventId) {
          entry.referrer.used = pickLatestByDate(entry.referrer.used, detail)
        } else {
          entry.referrer.issued = pickLatestByDate(entry.referrer.issued, detail)
        }
      }

      couponsByPair.set(key, entry)
    })

    const referralsByReferrer = new Map()

    referrals.forEach((referral) => {
      const referrerId = toStringSafe(referral?.referrerId)
      if (!referrerId) return

      if (!referralsByReferrer.has(referrerId)) {
        referralsByReferrer.set(referrerId, [])
      }
      referralsByReferrer.get(referrerId).push(referral)
    })

    const referrerEntries = []

    referralsByReferrer.forEach((referralsList, referrerId) => {
      const referrer = referrersMap.get(referrerId) ?? null

      const formattedReferrals = referralsList
        .slice()
        .sort((a, b) => {
          const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0
          return dateB - dateA
        })
        .map((referral) => {
          const referralId = toStringSafe(referral?._id)
          const condition =
            referralId && conditionStatusByUser.has(referralId)
              ? conditionStatusByUser.get(referralId)
              : null

          const couponsKey = `${referrerId}|${referralId}`
          const coupons = couponsByPair.get(couponsKey) ?? null

          return {
            user: formatUserSummary(referral),
            createdAt: referral?.createdAt ?? null,
            condition: {
              met: condition?.met === true,
              event: condition?.event ?? null,
            },
            coupons: {
              referrer: {
                issued: formatCouponDetail(
                  coupons?.referrer?.issued ?? null,
                  eventsSummaryMap
                ),
                used: formatCouponDetail(
                  coupons?.referrer?.used ?? null,
                  eventsSummaryMap
                ),
              },
              referral: {
                issued: formatCouponDetail(
                  coupons?.referral?.issued ?? null,
                  eventsSummaryMap
                ),
                used: formatCouponDetail(
                  coupons?.referral?.used ?? null,
                  eventsSummaryMap
                ),
              },
            },
          }
        })

      referrerEntries.push({
        referrerId,
        referrer: formatUserSummary(referrer),
        referrals: formattedReferrals,
      })
    })

    referrerEntries.sort((a, b) => {
      if (b.referrals.length !== a.referrals.length) {
        return b.referrals.length - a.referrals.length
      }

      const nameA = a?.referrer?.firstName ?? ''
      const nameB = b?.referrer?.firstName ?? ''
      return nameA.localeCompare(nameB, 'ru')
    })

    const totals = referrerEntries.reduce(
      (
        acc,
        entry
      ) => {
        acc.referrerCount += 1
        acc.referralsCount += entry.referrals.length
        entry.referrals.forEach((referral) => {
          if (referral?.condition?.met) {
            acc.conditionMetCount += 1
          }
        })
        return acc
      },
      { referrerCount: 0, referralsCount: 0, conditionMetCount: 0 }
    )

    const eventsSummaries = Array.from(eventsSummaryMap.values())

    return res?.status(200).json({
      success: true,
      data: {
        referralProgram,
        referrers: referrerEntries,
        totals,
        events: eventsSummaries,
      },
    })
  } catch (error) {
    console.error('Failed to fetch referrals admin summary', error)
    return res
      ?.status(500)
      .json({ success: false, error: 'Failed to load referrals summary' })
  }
}
