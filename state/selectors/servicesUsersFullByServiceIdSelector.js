'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import userSelector from './userSelector'
import serviceSelector from './serviceSelector'
import asyncServicesUsersByServiceIdSelector from '@state/async/asyncServicesUsersByServiceIdSelector'

const servicesUsersFullByServiceIdSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []

    const servicesUsers = await get(asyncServicesUsersByServiceIdSelector(id))

    if (!servicesUsers) return []

    const servicesUsersFull = await Promise.all(
      servicesUsers.map(async (item) => {
        const user = await get(userSelector(item.userId))
        const service = await get(serviceSelector(item.serviceId))
        return {
          ...item,
          user,
          service,
        }
      })
    )

    return servicesUsersFull
  })
)

export default servicesUsersFullByServiceIdSelector

