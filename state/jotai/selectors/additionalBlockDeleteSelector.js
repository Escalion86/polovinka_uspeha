import { atom } from 'jotai'

import { DEFAULT_ADDITIONAL_BLOCK } from '@helpers/constants'
import additionalBlocksAtom from '@state/jotai/atoms/additionalBlocksAtom'

const additionalBlockDeleteSelector = atom(
  () => DEFAULT_ADDITIONAL_BLOCK,
  (get, set, itemId) => {
    const items = get(additionalBlocksAtom)
    const newItemsList = items.filter((item) => item._id !== itemId)
    set(additionalBlocksAtom, newItemsList)
  }
)

export default additionalBlockDeleteSelector
