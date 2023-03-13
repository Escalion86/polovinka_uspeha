import errorFunc from '@layouts/modals/modalsFunc/errorFunc'
import { modalsAtom } from '@state/atoms'
import { selector } from 'recoil'
import addModalSelector from './addModalSelector'

const addErrorModalSelector = selector({
  key: 'addErrorModalSelector',
  get: () => get(modalsAtom),
  set: ({ set, get }, data) => set(addModalSelector, errorFunc(data)),
})

export default addErrorModalSelector
