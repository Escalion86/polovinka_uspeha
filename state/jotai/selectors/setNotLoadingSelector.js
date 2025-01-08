import { atom } from 'jotai'

import loadingAtom from '@state/jotai/atoms/loadingAtom'

const setNotLoadingSelector = atom(false, (get, set, itemNameId) => {
  set(loadingAtom(itemNameId), false)
})

export default setNotLoadingSelector
