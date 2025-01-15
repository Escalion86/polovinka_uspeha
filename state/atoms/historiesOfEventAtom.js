import { getData } from '@helpers/CRUD'
import { atomFamily } from 'jotai/utils'
import locationAtom from './locationAtom'

const historiesOfEventAtom = atomFamily((id) => async (get) => {
  const location = get(locationAtom)
  return await getData(`/api/${location}/histories`, {
    schema: 'events',
    'data._id': id,
  })
})

export default historiesOfEventAtom
