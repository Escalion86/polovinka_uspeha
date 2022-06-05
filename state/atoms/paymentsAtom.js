import { atom } from 'recoil'

const paymentsAtom = atom({
  key: 'paymentsAtom',
  default: [],
})

export default paymentsAtom
