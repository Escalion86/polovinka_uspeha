import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import asyncServicesUsersAtom from '@state/jotai/async/asyncServicesUsersAtom'

export const servicesUsersSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return null
    return get(asyncServicesUsersAtom).find((item) => item._id === id)
  })
)

export default servicesUsersSelector
