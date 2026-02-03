'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import eventsUsersSignedUpByUserIdSelector from './eventsUsersSignedUpByUserIdSelector'
import isEventClosed from '@helpers/isEventClosed'

const eventsUsersSignedUpWithEventStatusByUserIdCountSelector = atomFamily(
  (id) =>
    atom(async (get) => {
      if (!id) return []
      const eventsUsers = await get(eventsUsersSignedUpByUserIdSelector(id))

      const result = { signUp: 0, finished: 0 }
      eventsUsers.forEach((eventUser) => {
        if (isEventClosed(eventUser.event)) ++result.finished
        else ++result.signUp
      })

      return result
    })
)

export default eventsUsersSignedUpWithEventStatusByUserIdCountSelector

