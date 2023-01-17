import { DEFAULT_SERVICE } from '@helpers/constants'
import servicesAtom from '@state/atoms/servicesAtom'
import { selectorFamily } from 'recoil'

export const serviceSelector = selectorFamily({
  key: 'serviceSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return DEFAULT_SERVICE
      return get(servicesAtom).find((item) => item._id === id)
    },
})

export default serviceSelector
