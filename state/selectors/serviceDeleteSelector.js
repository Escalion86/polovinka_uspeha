import { atom } from 'jotai'

import { DEFAULT_SERVICE } from '@helpers/constants'
import servicesAtom from '@state/atoms/servicesAtom'

const serviceDeleteSelector = atom(DEFAULT_SERVICE, (get, set, itemId) => {
  const items = get(servicesAtom)
  const newItemsList = items.filter((item) => item._id !== itemId)
  set(servicesAtom, newItemsList)
})

export default serviceDeleteSelector
