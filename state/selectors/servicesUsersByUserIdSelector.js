import servicesUsersAtom from '@state/atoms/servicesUsersAtom'
import { selectorFamily } from 'recoil'

export const servicesUsersByUserIdSelector = selectorFamily({
  key: 'servicesUsersByUserIdSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return null
      return get(servicesUsersAtom).filter((item) => item.userId === id)
    },
})

export default servicesUsersByUserIdSelector
