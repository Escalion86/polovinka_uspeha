'use client'

import { atom } from 'jotai'

const siteSettingsAtom = atom({
  email: null,
  phone: null,
  whatsapp: null,
  ok: null,
  telegram: null,
  instagram: null,
  vk: null,
  referralProgram: {
    enabled: false,
    enabledForCenter: false,
    enabledForClub: false,
    referrerCouponAmount: 0,
    referralCouponAmount: 0,
    requirePaidEvent: false,
  },
  closedSpace: {
    directionId: null,
    subtitle: 'ЗАКРЫТОЕ ПРОСТРАНСТВО ДЛЯ СВОИХ',
    description:
      'Это формат с камерными встречами, где мы собираем небольшие группы по ценностям. Здесь больше глубины, доверия и долгих разговоров. Доступ открывается после знакомства с командой и участия в открытых мероприятиях.',
  },
})

export default siteSettingsAtom
