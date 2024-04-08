import { getData } from '@helpers/CRUD'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import { selector } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export const asyncServicesUsersSelector = selector({
  key: 'asyncServicesUsersSelector',
  get: async ({ get }) => {
    const res = await getData('/api/servicesusers', null, null, null, false)
    setRecoil(isLoadedAtom('asyncServicesUsersAtom'), true)

    return res
  },
})

export default asyncServicesUsersSelector
