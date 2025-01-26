import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { DEFAULT_ADDITIONAL_BLOCK } from '@helpers/constants'
import additionalBlocksAtom from '@state/atoms/additionalBlocksAtom'

const additionalBlockSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return DEFAULT_ADDITIONAL_BLOCK
    const additionalBlocks = await get(additionalBlocksAtom)

    return additionalBlocks.find((item) => item._id === id)
  })
)

export default additionalBlockSelector
