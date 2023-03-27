import servicesUsersAtom from '@state/atoms/servicesUsersAtom'
import { selector } from 'recoil'

const servicesUsersDeleteSelector = selector({
  key: 'servicesUsersDeleteSelector',
  get: () => {
    return null
  },
  set: ({ set, get }, itemId) => {
    const items = get(servicesUsersAtom)
    const newItemsList = items.filter((item) => item._id !== itemId)
    set(servicesUsersAtom, newItemsList)
  },
})

export default servicesUsersDeleteSelector
