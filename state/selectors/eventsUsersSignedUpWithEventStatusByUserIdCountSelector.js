'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import isEventExpired from '@helpers/isEventExpired'
import eventsUsersSignedUpByUserIdSelector from './eventsUsersSignedUpByUserIdSelector'

const eventsUsersSignedUpWithEventStatusByUserIdCountSelector = atomFamily(
  (id) =>
    atom(async (get) => {
      if (!id) return []
      const eventsUsers = await get(eventsUsersSignedUpByUserIdSelector(id))
      const result = { signUp: 0, finished: 0 }
      eventsUsers.forEach((eventUser) => {
        if (isEventExpired(eventUser.event)) ++result.finished
        else ++result.signUp
      })

      return result
    })
)

export default eventsUsersSignedUpWithEventStatusByUserIdCountSelector
