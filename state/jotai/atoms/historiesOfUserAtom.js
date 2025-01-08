import { getData } from '@helpers/CRUD'
import { atomFamily } from 'jotai/utils'

const historiesOfUserAtom = atomFamily(
  (id) => async (get) =>
    await getData(`/api/histories`, {
      schema: 'users',
      'data._id': id,
    })
)

export default historiesOfUserAtom
