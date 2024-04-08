import { atom } from 'recoil'
import asyncServicesUsersSelector from './asyncServicesUsersSelector'

const asyncServicesUsersAtom = atom({
  key: 'asyncServicesUsersAtom',
  default: asyncServicesUsersSelector,
})

export default asyncServicesUsersAtom
