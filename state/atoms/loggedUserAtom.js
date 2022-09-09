// import { DEFAULT_USER } from '@helpers/constants'
import { atom } from 'recoil'

const loggedUserAtom = atom({
  key: 'loggedUser',
  default: null,
})

export default loggedUserAtom
