import { atom } from 'recoil'

const questionnairesUsersAtom = atom({
  key: 'questionnairesUsers',
  default: [],
})

export default questionnairesUsersAtom
