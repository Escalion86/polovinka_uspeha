import { atom } from 'recoil'

const isSiteLoadingAtom = atom({
  key: 'isSiteLoading',
  default: true,
})

export default isSiteLoadingAtom
