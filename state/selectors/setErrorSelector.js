import { atom } from 'jotai'

import errorAtom from '@state/atoms/errorAtom'

const setErrorSelector = atom(false, (get, set, itemNameId) => {
  set(errorAtom(itemNameId), true)
})

export default setErrorSelector
