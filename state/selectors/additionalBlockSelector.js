import { DEFAULT_ADDITIONAL_BLOCK } from '@helpers/constants'
import additionalBlocksAtom from '@state/atoms/additionalBlocksAtom'
import { selectorFamily } from 'recoil'

export const additionalBlockSelector = selectorFamily({
  key: 'additionalBlockSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return DEFAULT_ADDITIONAL_BLOCK
      return get(additionalBlocksAtom).find((item) => item._id === id)
    },
})

export default additionalBlockSelector
