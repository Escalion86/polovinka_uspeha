import loadingAtom from '@state/atoms/loadingAtom'
import { selector } from 'recoil'

const setNotLoadingSelector = selector({
  key: 'setNotLoadingSelector',
  get: ({ get }) => get(loadingAtom(itemNameId)),
  set: ({ set }, itemNameId) => {
    set(loadingAtom(itemNameId), false)
  },
})

export default setNotLoadingSelector
