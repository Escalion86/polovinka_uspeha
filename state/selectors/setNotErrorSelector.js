import errorAtom from '@state/atoms/errorAtom'
import { selector } from 'recoil'

const setNotErrorSelector = selector({
  key: 'setNotErrorSelector',
  get: ({ get }) => false,
  set: ({ set }, itemNameId) => {
    set(errorAtom(itemNameId), false)
  },
})

export default setNotErrorSelector
