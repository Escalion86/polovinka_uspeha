// import { DEFAULT_ROLES } from '@helpers/constants'
import { atom } from 'recoil'

const rolesAtom = atom({
  key: 'rolesSettings',
  default: [],
})

export default rolesAtom
