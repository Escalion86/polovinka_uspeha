'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import { getData } from '@helpers/CRUD'
import asyncServicesUsersAtom from '@state/async/asyncServicesUsersAtom'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import store from '../store'
import locationAtom from '@state/atoms/locationAtom'

const asyncServicesUsersByUserIdSelector = atomFamily((userId) =>
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

    const location = get(locationAtom)

    const res = await getData(
      `/api/${location}/servicesusers`,
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

