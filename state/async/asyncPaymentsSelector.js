import { getData } from '@helpers/CRUD'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import { selector } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export const asyncPaymentsSelector = selector({
  key: 'asyncPaymentsSelector',
  get: async ({ get }) => {
    const res = await getData('/api/payments', null, null, null, false)
    setRecoil(isLoadedAtom('asyncPaymentsAtom'), true)

    return res
  },
})

export default asyncPaymentsSelector
