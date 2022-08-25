import errorAtom from '@state/atoms/errorAtom'
import { selector } from 'recoil'

const setErrorSelector = selector({
  key: 'setErrorSelector',
  get: ({ get }) => false,
  set: ({ set }, itemNameId) => {
    set(errorAtom(itemNameId), true)
  },
})

export default setErrorSelector
