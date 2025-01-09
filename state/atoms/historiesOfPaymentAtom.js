import { getData } from '@helpers/CRUD'
import { atomFamily } from 'jotai/utils'

const historiesOfPaymentAtom = atomFamily(
  (id) => async (get) =>
    await getData(`/api/histories`, {
      schema: 'payments',
      'data._id': id,
    })
)

export default historiesOfPaymentAtom
