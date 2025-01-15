import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import asyncServicesUsersAtom from '@state/async/asyncServicesUsersAtom'

export const servicesUsersSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return null
    const servicesUsers = await get(asyncServicesUsersAtom)
    return servicesUsers?.find((item) => item._id === id)
  })
)

export default servicesUsersSelector
