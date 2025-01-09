import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { DEFAULT_ADDITIONAL_BLOCK } from '@helpers/constants'
import additionalBlocksAtom from '@state/atoms/additionalBlocksAtom'

export const additionalBlockSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return DEFAULT_ADDITIONAL_BLOCK
    return get(additionalBlocksAtom).find((item) => item._id === id)
  })
)

export default additionalBlockSelector
