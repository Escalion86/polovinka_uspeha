'use client'

import { atom } from 'jotai'

import { getData } from '@helpers/CRUD'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import locationAtom from '@state/atoms/locationAtom'

const badgeLoggedUserLikesToSeeSelector = atom(async (get) => {
  const loggedUser = get(loggedUserActiveAtom)
  if (!loggedUser || loggedUser.relationship) return 0
  const location = get(locationAtom)
  if (!location || location === 'null' || location === 'undefined') return 0

  const response = await getData(
    `/api/${location}/likes/pending-count`,
    {},
    null,
    null,
    false
  )

  const count = Number(response?.count)
  return Number.isFinite(count) && count > 0 ? count : 0
})

export default badgeLoggedUserLikesToSeeSelector
