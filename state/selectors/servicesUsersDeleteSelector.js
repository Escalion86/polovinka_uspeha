import asyncServicesUsersAtom from '@state/async/asyncServicesUsersAtom'
import { selector } from 'recoil'

const servicesUsersDeleteSelector = selector({
  key: 'servicesUsersDeleteSelector',
  get: () => {
    return null
  },
  set: ({ set, get }, itemId) => {
    const items = get(asyncServicesUsersAtom)
    const newItemsList = items.filter((item) => item._id !== itemId)
    set(asyncServicesUsersAtom, newItemsList)
  },
})

export default servicesUsersDeleteSelector
