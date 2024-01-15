import { getData } from '@helpers/CRUD'
import { atomFamily, selectorFamily } from 'recoil'

export const historiesOfPaymentSelector = selectorFamily({
  key: 'historiesOfPaymentSelector',
  get:
    (id) =>
    async ({ get }) =>
      await getData(`/api/histories`, {
        schema: 'payments',
        'data._id': id,
      }),
})

const historiesOfPaymentAtom = atomFamily({
  key: 'historiesOfPaymentAtom',
  default: [],
})

export default historiesOfPaymentAtom
