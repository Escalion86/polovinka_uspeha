import { atom } from 'jotai'

import additionalBlocksAtom from '@state/jotai/atoms/additionalBlocksAtom'

const filteredAdditionalBlocksSelector = atom((get) => {
  const additionalBlocks = get(additionalBlocksAtom)
  return additionalBlocks?.length > 0
    ? additionalBlocks.filter((additionalBlock) => additionalBlock.showOnSite)
    : []
})

export default filteredAdditionalBlocksSelector
