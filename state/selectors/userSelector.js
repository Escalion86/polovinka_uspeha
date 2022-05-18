import { DEFAULT_USER } from '@helpers/constants'
import usersAtom from '@state/atoms/usersAtom'
import { selectorFamily } from 'recoil'

export const userSelector = selectorFamily({
  key: 'userSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return DEFAULT_USER
      return get(usersAtom).find((item) => item._id === id)
    },
})

export default userSelector
