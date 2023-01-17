import { DEFAULT_SERVICE } from '@helpers/constants'
import servicesAtom from '@state/atoms/servicesAtom'
import { selector } from 'recoil'

const serviceDeleteSelector = selector({
  key: 'serviceDeleteSelector',
  get: () => DEFAULT_SERVICE,
  set: ({ set, get }, itemId) => {
    const items = get(servicesAtom)
    const newItemsList = items.filter((item) => item._id !== itemId)
    set(servicesAtom, newItemsList)
  },
})

export default serviceDeleteSelector
