'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventPricesWithStatus from '@helpers/eventPricesWithStatus'
import eventParticipantsFullByEventIdSelector from './eventParticipantsFullByEventIdSelector'
import sumOfCouponsFromParticipantsToEventSelector from './sumOfCouponsFromParticipantsToEventSelector'
import eventSelector from './eventSelector'

const sumOfExpectingPaymentsFromParticipantsToEventSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const event = await get(eventSelector(id))
    const eventParticipantsFull = await get(
      eventParticipantsFullByEventIdSelector(id)
    )

    const sumOfCouponsOfEventFromParticipants = await get(
      sumOfCouponsFromParticipantsToEventSelector(id)
    )

    var sumOfExpectingPayments = 0
    event.subEvents.forEach((subEvent) => {
      const subEventPrices = eventPricesWithStatus(subEvent)
      eventParticipantsFull.forEach(({ userStatus, subEventId }) => {
        if (subEvent.id === subEventId && userStatus !== 'ban')
          sumOfExpectingPayments +=
            userStatus === 'member'
              ? subEventPrices.member
              : subEventPrices.novice
      })
    })

    // const eventPrices = eventPricesWithStatus(event)
    // event.price * eventParticipantsFull.length -
    // membersOfEventCount * (event.usersStatusDiscount?.member ?? 0) -
    // noviceOfEventCount * (event.usersStatusDiscount?.novice ?? 0))
    return sumOfExpectingPayments / 100 - sumOfCouponsOfEventFromParticipants
  })
)

export default sumOfExpectingPaymentsFromParticipantsToEventSelector
