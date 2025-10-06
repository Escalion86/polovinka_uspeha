'use client'

import { atom } from 'jotai'

import achievementsUsersAtom from '@state/atoms/achievementsUsersAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'

const menuHiddenLoggedUserAchievementsSelector = atom((get) => {
  const loggedUser = get(loggedUserActiveAtom)
  const achievementsUsers = get(achievementsUsersAtom)

  if (!loggedUser?._id) return true

  return !achievementsUsers?.some(
    (achievement) => String(achievement.userId) === String(loggedUser._id)
  )
})

export default menuHiddenLoggedUserAchievementsSelector
