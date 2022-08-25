import loadingAtom from '@state/atoms/loadingAtom'
import { selector } from 'recoil'

const toggleLoadingSelector = selector({
  key: 'toggleLoadingSelector',
  get: ({ get }) => false,
  set: ({ set, get }, itemNameId) => {
    set(loadingAtom(itemNameId), !get(loadingAtom(itemNameId)))
  },
})

export default toggleLoadingSelector
