import { atom } from 'jotai'

import loadingAtom from '@state/jotai/atoms/loadingAtom'

const toggleLoadingSelector = atom(false, (get, set, itemNameId) => {
  set(loadingAtom(itemNameId), !get(loadingAtom(itemNameId)))
})

export default toggleLoadingSelector
