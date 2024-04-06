import { atom } from 'recoil'
import asyncPaymentsSelector from './asyncPaymentsSelector'

const asyncPaymentsAtom = atom({
  key: 'asyncPaymentsAtom',
  default: asyncPaymentsSelector,
})

export default asyncPaymentsAtom
