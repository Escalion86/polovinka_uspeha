import { DEFAULT_ADDITIONAL_BLOCK } from '@helpers/constants'
import additionalBlocksAtom from '@state/atoms/additionalBlocksAtom'
import { selector } from 'recoil'

const additionalBlockDeleteSelector = selector({
  key: 'additionalBlockDeleteSelector',
  get: () => DEFAULT_ADDITIONAL_BLOCK,
  set: ({ set, get }, itemId) => {
    const items = get(additionalBlocksAtom)
    const newItemsList = items.filter((item) => item._id !== itemId)
    set(additionalBlocksAtom, newItemsList)
  },
})

export default additionalBlockDeleteSelector
