import { atom } from 'jotai'

import asyncServicesUsersAtom from '@state/async/asyncServicesUsersAtom'

const servicesUsersDeleteSelector = atom(null, async (get, set, itemId) => {
  const items = await get(asyncServicesUsersAtom)
  const newItemsList = items.filter((item) => item._id !== itemId)
  set(asyncServicesUsersAtom, newItemsList)
})

export default servicesUsersDeleteSelector
