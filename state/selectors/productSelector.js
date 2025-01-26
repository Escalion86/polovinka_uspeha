import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import productsAtom from '@state/atoms/servicesAtom'

const productSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return
    return get(productsAtom).find((item) => item._id === id)
  })
)

export default productSelector
