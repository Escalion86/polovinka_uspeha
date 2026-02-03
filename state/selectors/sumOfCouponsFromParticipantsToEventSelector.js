'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import couponsOfEventFromUsersSelector from './couponsOfEventFromUsersSelector'
import eventParticipantsIdsSelector from './eventParticipantsIdsSelector'

const sumOfCouponsFromParticipantsToEventSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return 0
    const coupons = await get(couponsOfEventFromUsersSelector(id))
    const participantsIds = await get(eventParticipantsIdsSelector(id))

    const result = coupons.reduce((p, payment) => {
      const isUserParticipant = participantsIds.includes(payment.userId)
      if (isUserParticipant)
        return (
          p + (payment.sum ?? 0) * (payment.payDirection === 'toUser' ? -1 : 1)
        )

      return p
    }, 0)
    return result / 100
  })
)

export default sumOfCouponsFromParticipantsToEventSelector

