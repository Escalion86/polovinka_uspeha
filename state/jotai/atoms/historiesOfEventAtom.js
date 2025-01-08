import { getData } from '@helpers/CRUD'
import { atomFamily } from 'jotai/utils'

const historiesOfEventAtom = atomFamily(
  (id) => async (get) =>
    await getData(`/api/histories`, {
      schema: 'events',
      'data._id': id,
    })
)

export default historiesOfEventAtom
