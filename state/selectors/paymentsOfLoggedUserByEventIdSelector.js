'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import paymentsOfLoggedUserSelector from './paymentsOfLoggedUserSelector'

const paymentsOfLoggedUserByEventIdSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const loggedUserActive = get(loggedUserActiveAtom)
    if (!loggedUserActive) return []
    const payments = await get(paymentsOfLoggedUserSelector)
    return payments.filter(({ eventId }) => eventId === id)
    // return get(paymentsByEventIdSelector(id)).filter(
    //   (item) => item.userId === loggedUserActive._id
    // )
  })
)

export default paymentsOfLoggedUserByEventIdSelector

