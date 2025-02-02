'use client'

import { atomFamily } from 'jotai/utils'

import { getData } from '@helpers/CRUD'
// import isLoadedAtom from '@state/atoms/isLoadedAtom'
// import usersAtomAsync from '@state/async/usersAtomAsync'
import locationAtom from '@state/atoms/locationAtom'
import atomWithRefreshAndDefault from '@state/atomWithRefreshAndDefault'

const userSelector = atomFamily(
  (id) => {
    // const userSelectorAtomWithReset = atomWithReset(
    //   async (get) => await userSelectorFunc(get, id)
    // )
    const userSelectorAtom = atomWithRefreshAndDefault(async (get) => {
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
    })

    return userSelectorAtom
  }

  // if (process.env.NODE_ENV !== 'production') {
  //   userSelectorAtom.debugLabel = `userSelectorAtom(${id})`
  // }
)

export default userSelector
