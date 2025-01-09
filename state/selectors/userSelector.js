import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { DEFAULT_USER } from '@helpers/constants'
import { getData } from '@helpers/CRUD'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import usersAtomAsync from '@state/async/usersAtomAsync'
// import usersAtomAsync from '@state/async/usersAtomAsync'

export const userSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return DEFAULT_USER

    if (get(isLoadedAtom('usersAtomAsync'))) {
      const allUsers = await get(usersAtomAsync)
      const user = allUsers.find((item) => item._id === id)
      return user
    }

    const res = await getData('/api/users/' + id, {}, null, null, false)
    return res
    // return get(usersAtomAsync).find((item) => item._id === id)
  })
)

export default userSelector
