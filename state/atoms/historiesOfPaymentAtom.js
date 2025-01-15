import { getData } from '@helpers/CRUD'
import { atomFamily } from 'jotai/utils'
import locationAtom from './locationAtom'

const historiesOfPaymentAtom = atomFamily((id) => async (get) => {
  const location = get(locationAtom)
  return await getData(`/api/${location}/histories`, {
    schema: 'payments',
    'data._id': id,
  })
})

export default historiesOfPaymentAtom
