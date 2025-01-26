import { atomFamily, atomWithDefault } from 'jotai/utils'

import { getData } from '@helpers/CRUD'
// import isLoadedAtom from '@state/atoms/isLoadedAtom'
// import usersAtomAsync from '@state/async/usersAtomAsync'
import locationAtom from '@state/atoms/locationAtom'

const userSelector = atomFamily((id) =>
  atomWithDefault(async (get) => {
    if (!id) return

    // const allUsers = await get(usersAtomAsync)

    // const isUsersAtomLoaded = get(isLoadedAtom('usersAtomAsync'))

    // if (isUsersAtomLoaded) {
    //   // const allUsers = await get(usersAtomAsync)
    //   const user = allUsers.find((item) => item._id === id)
    //   return user
    // }

    const location = get(locationAtom)
    if (!location) return

    const res = await getData(
      `/api/${location}/users/${id}`,
      {},
      null,
      null,
      false
    )
    return res
    // return get(usersAtomAsync).find((item) => item._id === id)
  })
)

export default userSelector
