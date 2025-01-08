import { atom } from 'jotai'

import errorAtom from '@state/jotai/atoms/errorAtom'

const setNotErrorSelector = atom(false, (get, set, itemNameId) => {
  set(errorAtom(itemNameId), false)
})

export default setNotErrorSelector
