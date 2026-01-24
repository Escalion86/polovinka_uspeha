'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import asyncEventsUsersByUserIdAtom from '@state/async/asyncEventsUsersByUserIdAtom'

const isUserHaveActionsSelector = atomFamily((id) =>
  atom(async (get) => {
    const eventsOfUser = await get(asyncEventsUsersByUserIdAtom(id))
    return eventsOfUser.length > 0
  })
)

export default isUserHaveActionsSelector

