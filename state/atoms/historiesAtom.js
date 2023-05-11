import { getData } from '@helpers/CRUD'
import { atom, selector } from 'recoil'

export const historiesSelector = selector({
  key: 'historiesSelector',
  get: async ({ get }) => await getData(`/api/histories`, {}),
})

const historiesAtom = atom({
  key: 'histories',
  default: [],
})

export default historiesAtom
