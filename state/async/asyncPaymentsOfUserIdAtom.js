import { atomFamily } from 'recoil'
import asyncPaymentsOfUserIdSelector from './asyncPaymentsOfUserIdSelector'

const asyncPaymentsOfUserIdAtom = atomFamily({
  key: 'asyncPaymentsOfUserIdAtom',
  default: asyncPaymentsOfUserIdSelector,
})

export default asyncPaymentsOfUserIdAtom
