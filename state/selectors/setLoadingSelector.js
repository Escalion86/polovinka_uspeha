import loadingAtom from '@state/atoms/loadingAtom'
import { selector } from 'recoil'

const setLoadingSelector = selector({
  key: 'setLoadingSelector',
  get: ({ get }) => get(loadingAtom(itemNameId)),
  set: ({ set }, itemNameId) => {
    set(loadingAtom(itemNameId), true)
  },
})

export default setLoadingSelector
