const QUALIFYING_STATUSES = ['participant', 'assistant']
const EXCLUDED_STATUSES = ['reserve', 'ban']

const isPaidEvent = (event) =>
  Array.isArray(event?.subEvents) &&
  event.subEvents.some((subEvent) => Number(subEvent?.price ?? 0) > 0)

const getReferralProgramFlags = (referralProgram = {}) => {
  const hasExplicitEnabled = typeof referralProgram?.enabled === 'boolean'
  const fallbackEnabled =
    referralProgram?.enabledForCenter === true ||
    referralProgram?.enabledForClub === true
  const enabled = hasExplicitEnabled
    ? referralProgram.enabled === true
    : fallbackEnabled
  const enabledForCenter =
    typeof referralProgram?.enabledForCenter === 'boolean'
      ? referralProgram.enabledForCenter
      : enabled
  const enabledForClub =
    typeof referralProgram?.enabledForClub === 'boolean'
      ? referralProgram.enabledForClub
      : enabled

  return {
    enabled,
    enabledForCenter,
    enabledForClub,
  }
}

const getUserName = (user) =>
  [user?.firstName, user?.secondName].filter(Boolean).join(' ').trim()

const toStringOrNull = (value) => (value ? String(value) : null)

export default async function processReferralRewards({ db, event }) {
  if (!db || !event?._id) return

  const eventId = String(event._id)

  try {
    const siteSettings = await db.model('SiteSettings').findOne({}).lean()
    const referralProgram = siteSettings?.referralProgram ?? {}
    const referralProgramFlags = getReferralProgramFlags(referralProgram)
    if (!referralProgramFlags.enabled) return
    const referrerCouponAmount = referralProgram.referrerCouponAmount ?? 0
    const referralCouponAmount = referralProgram.referralCouponAmount ?? 0
    const requirePaidEvent = referralProgram.requirePaidEvent ?? false

    if (!referrerCouponAmount && !referralCouponAmount) return

    if (requirePaidEvent && !isPaidEvent(event)) return

    const eventParticipants = await db
      .model('EventsUsers')
      .find({
        eventId,
        status: { $in: QUALIFYING_STATUSES },
      })
      .lean()

    if (!eventParticipants.length) return

    const closedEvents = await db
      .model('Events')
      .find({ status: 'closed' }, { _id: 1 })
      .lean()

    const otherClosedEventIds = closedEvents
      .map(({ _id }) => String(_id))
      .filter((id) => id && id !== eventId)

    const referrerCache = new Map()

    for (const participant of eventParticipants) {
      const userId = toStringOrNull(participant?.userId)
      if (!userId) continue

      if (otherClosedEventIds.length) {
        const hasPreviousClosedEvent = await db.model('EventsUsers').exists({
          userId,
          eventId: { $in: otherClosedEventIds },
          status: { $nin: EXCLUDED_STATUSES },
        })

        if (hasPreviousClosedEvent) continue
      }

      const user = await db.model('Users').findById(userId).lean()
      if (!user) continue

      const referrerId = toStringOrNull(user.referrerId)
      if (!referrerId) {
        continue
      }

      if (referrerId === userId) {
        continue
      }

      const referralUserName = getUserName(user)
      const referralNameSuffix = referralUserName
        ? ` (${referralUserName})`
        : ''

      let referrerExists = false
      if (referrerId) {
        let referrer = referrerCache.get(referrerId)
        if (!referrer) {
          referrer = await db.model('Users').findById(referrerId).lean()
          if (referrer) {
            referrerCache.set(referrerId, referrer)
          }
        }

        if (referrer) {
          referrerExists = true
        }
      }

      if (!referrerExists) {
        continue
      }

      const referrerEligible = referralProgramFlags.enabled

      const shouldCreateReferralCoupon = referralCouponAmount > 0
      const shouldCreateReferrerCoupon =
        referrerCouponAmount > 0 && referrerEligible

      if (!shouldCreateReferralCoupon && !shouldCreateReferrerCoupon) {
        continue
      }

      if (shouldCreateReferralCoupon) {
        const referralCouponExists = await db.model('Payments').findOne({
          userId,
          'referralReward.referralUserId': userId,
          'referralReward.rewardFor': 'referral',
          isReferralCoupon: true,
        })

        if (!referralCouponExists) {
          await db.model('Payments').create({
            sector: 'event',
            payDirection: 'toEvent',
            userId,
            payType: 'coupon',
            sum: referralCouponAmount,
            payAt: new Date(),
            comment: `Реферальный купон за первое посещение мероприятия "${
              event.title ?? ''
            }"${referralNameSuffix}`,
            isReferralCoupon: true,
            referralReward: {
              eventId,
              referralUserId: userId,
              referrerId,
              rewardFor: 'referral',
            },
          })
        }
      }

      if (shouldCreateReferrerCoupon) {
        const referrerCouponExists = await db.model('Payments').findOne({
          userId: referrerId,
          'referralReward.eventId': eventId,
          'referralReward.referralUserId': userId,
          'referralReward.rewardFor': 'referrer',
          isReferralCoupon: true,
        })

        if (!referrerCouponExists) {
          await db.model('Payments').create({
            sector: 'event',
            payDirection: 'toEvent',
            userId: referrerId,
            payType: 'coupon',
            sum: referrerCouponAmount,
            payAt: new Date(),
            comment: `Купон за приглашённого участника${referralNameSuffix} на мероприятие "${
              event.title ?? ''
            }"`,
            isReferralCoupon: true,
            referralReward: {
              eventId,
              referralUserId: userId,
              referrerId,
              rewardFor: 'referrer',
            },
          })
        }
      }
    }
  } catch (error) {
    console.log('processReferralRewards error :>> ', error)
    throw error
  }
}
