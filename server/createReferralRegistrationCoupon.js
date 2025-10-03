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

export default async function createReferralRegistrationCoupon({ db, user }) {
  if (!db) return

  const userId = toStringOrNull(user?._id)
  const referrerId = toStringOrNull(user?.referrerId)

  if (!userId || !referrerId || referrerId === userId) return

  const referrerUser = await db.model('Users').findById(referrerId).lean()

  try {
    const siteSettings = await db.model('SiteSettings').findOne({}).lean()
    const referralProgram = siteSettings?.referralProgram ?? {}
    const referralProgramFlags = getReferralProgramFlags(referralProgram)
    if (!referralProgramFlags.enabled) return

    const referralCouponAmount = referralProgram.referralCouponAmount ?? 0
    if (!(referralCouponAmount > 0)) return

    const referralCouponExists = await db.model('Payments').findOne({
      userId,
      'referralReward.referralUserId': userId,
      'referralReward.referrerId': referrerId,
      'referralReward.rewardFor': 'referral',
      'referralReward.eventId': null,
      isReferralCoupon: true,
    })

    if (referralCouponExists) return

    const referrerUserName = getUserName(referrerUser)
    const referrerNameSuffix = referrerUserName
      ? ` (по приглашению от ${referrerUserName})`
      : ''

    await db.model('Payments').create({
      sector: 'event',
      payDirection: 'fromUser',
      userId,
      payType: 'coupon',
      sum: referralCouponAmount,
      payAt: new Date(),
      comment: `Реферальный купон за регистрацию${referrerNameSuffix}`,
      isReferralCoupon: true,
      referralReward: {
        eventId: null,
        referralUserId: userId,
        referrerId,
        rewardFor: 'referral',
      },
    })
  } catch (error) {
    console.log('createReferralRegistrationCoupon error :>> ', error)
    throw error
  }
}
