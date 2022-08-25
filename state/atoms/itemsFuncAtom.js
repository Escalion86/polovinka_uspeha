import { DEFAULT_EVENT } from '@helpers/constants'
import { atom } from 'recoil'

const itemsFuncAtom = atom({
  key: 'items',
  default: null,
})

export default itemsFuncAtom
