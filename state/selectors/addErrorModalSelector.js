'use client'

import { atom } from 'jotai'

import errorFunc from '@layouts/modals/modalsFunc/errorFunc'
import modalsAtom from '@state/atoms/modalsAtom'
import addModalSelector from './addModalSelector'

const addErrorModalSelector = atom(
  () => get(modalsAtom),
  (get, set, data) => set(addModalSelector, errorFunc(data))
)

export default addErrorModalSelector
