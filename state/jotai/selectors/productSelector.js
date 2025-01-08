import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { DEFAULT_PRODUCT } from '@helpers/constants'
import productsAtom from '@state/jotai/atoms/servicesAtom'

export const productSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return DEFAULT_PRODUCT
    return get(productsAtom).find((item) => item._id === id)
  })
)

export default productSelector
