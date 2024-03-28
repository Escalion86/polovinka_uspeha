// import { getData } from '@helpers/CRUD'
import { DEFAULT_USER } from '@helpers/constants'
import usersAtom from '@state/atoms/usersAtom'
import { selectorFamily } from 'recoil'

export const userSelector = selectorFamily({
  key: 'userSelector',
  get:
    (id) =>
    async ({ get }) => {
      if (!id) return DEFAULT_USER
      // const res = await getData('/api/users/' + id, {}, null, null, false)
      // return res
      return get(usersAtom).find((item) => item._id === id)
    },
})

export default userSelector
