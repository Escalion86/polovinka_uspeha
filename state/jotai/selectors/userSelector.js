import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { DEFAULT_USER } from '@helpers/constants'
import usersAtom from '@state/jotai/atoms/usersAtom'

export const userSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return DEFAULT_USER
    // const res = await getData('/api/users/' + id, {}, null, null, false)
    // return res
    return get(usersAtom).find((item) => item._id === id)
  })
)

export default userSelector
