'use client'

import { atom } from 'jotai'

import achievementsUsersAtom from '@state/atoms/achievementsUsersAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'

const badgeUnviewedAchievementsSelector = atom((get) => {
  const loggedUser = get(loggedUserActiveAtom)
  const assignments = get(achievementsUsersAtom)

  if (!loggedUser?._id || !Array.isArray(assignments)) return 0

  const loggedUserId = String(loggedUser._id)

  return assignments.reduce((total, assignment) => {
    if (String(assignment.userId) !== loggedUserId) return total

    if (assignment.viewedAt) return total

    return total + 1
  }, 0)
})

export default badgeUnviewedAchievementsSelector
