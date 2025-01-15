import { atom } from 'jotai'

import errorAtom from '@state/atoms/errorAtom'

const setNotErrorSelector = atom(false, (get, set, itemNameId) => {
  set(errorAtom(itemNameId), false)
})

export default setNotErrorSelector
