import additionalBlocksAtom from '@state/atoms/additionalBlocksAtom'
import { selector } from 'recoil'

const filteredAdditionalBlocksSelector = selector({
  key: 'filteredAdditionalBlocksSelector',
  get: ({ get }) => {
    const additionalBlocks = get(additionalBlocksAtom)
    return additionalBlocks?.length > 0
      ? additionalBlocks.filter((additionalBlock) => additionalBlock.showOnSite)
      : []
  },
})

export default filteredAdditionalBlocksSelector
