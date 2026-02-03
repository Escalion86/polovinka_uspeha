'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import { getData } from '@helpers/CRUD'
import asyncServicesUsersAtom from '@state/async/asyncServicesUsersAtom'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import store from '../store'
import locationAtom from '@state/atoms/locationAtom'

const asyncServicesUsersByServiceIdSelector = atomFamily((serviceId) =>
  atom(async (get) => {
    if (!serviceId) return null
    if (get(isLoadedAtom('asyncServicesUsersAtom'))) {
      const allServicesUsers = await get(asyncServicesUsersAtom)
      store.set(
        isLoadedAtom('asyncServicesUsersByServiceIdSelector' + serviceId),
        true
      )

      return allServicesUsers.filter(
        (serviceUser) => serviceUser.serviceId === serviceId
      )
    }

    const location = get(locationAtom)

    const res = await getData(
      `/api/${location}/servicesusers`,
      { serviceId },
      null,
      null,
      false
    )
    store.set(
      isLoadedAtom('asyncServicesUsersByServiceIdSelector' + serviceId),
      true
    )

    return res
  })
)

export default asyncServicesUsersByServiceIdSelector

