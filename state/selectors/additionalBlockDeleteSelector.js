'use client'

import { atom } from 'jotai'

import { DEFAULT_ADDITIONAL_BLOCK } from '@helpers/constants'
import additionalBlocksAtom from '@state/atoms/additionalBlocksAtom'

const additionalBlockDeleteSelector = atom(
  () => DEFAULT_ADDITIONAL_BLOCK,
  async (get, set, itemId) => {
    const items = await get(additionalBlocksAtom)
    const newItemsList = items.filter((item) => item._id !== itemId)
    set(additionalBlocksAtom, newItemsList)
  }
)

export default additionalBlockDeleteSelector
