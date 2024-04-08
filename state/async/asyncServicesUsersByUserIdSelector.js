import { getData } from '@helpers/CRUD'
import asyncServicesUsersAtom from '@state/async/asyncServicesUsersAtom'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import { selectorFamily } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export const asyncServicesUsersByUserIdSelector = selectorFamily({
  key: 'asyncServicesUsersByUserIdSelector',
  get:
    (userId) =>
    async ({ get }) => {
      if (!userId) return null
      if (get(isLoadedAtom('asyncServicesUsersAtom'))) {
        const allServicesUsers = await get(asyncServicesUsersAtom)
        setRecoil(
          isLoadedAtom('asyncServicesUsersByUserIdSelector' + userId),
          true
        )

        return allServicesUsers.filter(
          (serviceUser) => serviceUser.userId === userId
        )
      }

      const res = await getData(
        '/api/servicesusers',
        { userId },
        null,
        null,
        false
      )
      setRecoil(
        isLoadedAtom('asyncServicesUsersByUserIdSelector' + userId),
        true
      )

      return res
      // return get(asyncServicesUsersAtom).filter((item) => item.userId === id)
    },
})

export default asyncServicesUsersByUserIdSelector
