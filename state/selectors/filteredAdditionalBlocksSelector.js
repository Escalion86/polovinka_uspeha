import { atom } from 'jotai'

import additionalBlocksAtom from '@state/atoms/additionalBlocksAtom'

const filteredAdditionalBlocksSelector = atom(async (get) => {
  const additionalBlocks = await get(additionalBlocksAtom)

  return additionalBlocks?.length > 0
    ? additionalBlocks.filter((additionalBlock) => additionalBlock.showOnSite)
    : []
})

export default filteredAdditionalBlocksSelector
