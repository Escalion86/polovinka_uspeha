import { atom } from 'recoil'

const questionnairesAtom = atom({
  key: 'questionnaires',
  default: [],
})

export default questionnairesAtom
