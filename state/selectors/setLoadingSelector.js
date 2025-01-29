'use client'

import { atom } from 'jotai'

import loadingAtom from '@state/atoms/loadingAtom'

const setLoadingSelector = atom(false, (get, set, itemNameId) => {
  set(loadingAtom(itemNameId), true)
})

export default setLoadingSelector
