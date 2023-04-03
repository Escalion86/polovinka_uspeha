import { DEFAULT_PRODUCT } from '@helpers/constants'
import productsAtom from '@state/atoms/servicesAtom'
import { selectorFamily } from 'recoil'

export const productSelector = selectorFamily({
  key: 'productSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return DEFAULT_PRODUCT
      return get(productsAtom).find((item) => item._id === id)
    },
})

export default productSelector
