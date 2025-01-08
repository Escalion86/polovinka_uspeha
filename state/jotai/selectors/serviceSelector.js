import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { DEFAULT_SERVICE } from '@helpers/constants'
import servicesAtom from '@state/jotai/atoms/servicesAtom'

export const serviceSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return DEFAULT_SERVICE
    return get(servicesAtom).find((item) => item._id === id)
  })
)

export default serviceSelector
