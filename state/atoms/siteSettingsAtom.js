import { DEFAULT_SITE_SETTINGS } from '@helpers/constants'
import { atom } from 'recoil'

const siteSettingsAtom = atom({
  key: 'siteSettings',
  default: {
    email: null,
    phone: null,
    whatsapp: null,
    viber: null,
    telegram: null,
    instagram: null,
    vk: null,
  },
})

export default siteSettingsAtom
