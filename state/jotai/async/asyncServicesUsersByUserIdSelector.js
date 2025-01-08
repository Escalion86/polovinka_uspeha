import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { getData } from '@helpers/CRUD'
import asyncServicesUsersAtom from '@state/async/asyncServicesUsersAtom'
import isLoadedAtom from '@state/jotai/atoms/isLoadedAtom'
import store from '../store'

export const asyncServicesUsersByUserIdSelector = atomFamily((userId) =>
  atom(async (get) => {
    if (!userId) return null
    if (get(isLoadedAtom('asyncServicesUsersAtom'))) {
      const allServicesUsers = await get(asyncServicesUsersAtom)
      store.set(
        isLoadedAtom('asyncServicesUsersByUserIdSelector' + userId),
        true
      )

      return allServicesUsers.filter(
        (serviceUser) => serviceUser.userId === userId
      )
    }

    const res = await getData(
      '/api/servicesusers',
      { userId },
      null,
      null,
      false
    )
    store.set(isLoadedAtom('asyncServicesUsersByUserIdSelector' + userId), true)

    return res
  })
)

export default asyncServicesUsersByUserIdSelector
