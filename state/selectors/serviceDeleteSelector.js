import { atom } from 'jotai'

import servicesAtom from '@state/atoms/servicesAtom'

const serviceDeleteSelector = atom(null, (get, set, itemId) => {
  const items = get(servicesAtom)
  const newItemsList = items.filter((item) => item._id !== itemId)
  set(servicesAtom, newItemsList)
})

export default serviceDeleteSelector
