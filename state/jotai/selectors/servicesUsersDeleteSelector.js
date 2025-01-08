import { atom } from 'jotai'

import asyncServicesUsersAtom from '@state/jotai/async/asyncServicesUsersAtom'

const servicesUsersDeleteSelector = atom(null, (get, set, itemId) => {
  const items = get(asyncServicesUsersAtom)
  const newItemsList = items.filter((item) => item._id !== itemId)
  set(asyncServicesUsersAtom, newItemsList)
})

export default servicesUsersDeleteSelector
