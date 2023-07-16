import { atom } from 'recoil'

const serverSettingsAtom = atom({
  key: 'serverSettings',
  default: {},
})

export default serverSettingsAtom
