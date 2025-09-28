'use client'

import { atom } from 'jotai'

const siteSettingsAtom = atom({
  email: null,
  phone: null,
  whatsapp: null,
  viber: null,
  telegram: null,
  instagram: null,
  vk: null,
  referralProgram: {
    enabled: false,
    referrerCouponAmount: 0,
    referralCouponAmount: 0,
    requirePaidEvent: false,
  },
})

export default siteSettingsAtom
