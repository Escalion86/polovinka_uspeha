import { getData } from '@helpers/CRUD'
import { atomFamily, selectorFamily } from 'recoil'

export const historiesOfEventSelector = selectorFamily({
  key: 'historiesOfEventSelector',
  get:
    (id) =>
    async ({ get }) =>
      await getData(`/api/histories`, {
        schema: 'events',
        'data._id': id,
      }),
})

const historiesOfEventAtom = atomFamily({
  key: 'historiesOfEventAtom',
  default: [],
})

export default historiesOfEventAtom
