import { getData } from '@helpers/CRUD'
import { atomFamily, selectorFamily } from 'recoil'

export const historiesOfUserSelector = selectorFamily({
  key: 'historiesOfUserSelector',
  get:
    (id) =>
    async ({ get }) =>
      await getData(`/api/histories`, {
        schema: 'users',
        'data._id': id,
      }),
})

const historiesOfUserAtom = atomFamily({
  key: 'historiesOfUserAtom',
  default: [],
})

export default historiesOfUserAtom
