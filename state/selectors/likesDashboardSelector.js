'use client'

import { atom } from 'jotai'

import { getData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'

const EMPTY_DASHBOARD = Object.freeze({
  eventsWithWaitingLikes: [],
  eventsWithSettedLikes: [],
  usersWithLikesCoincidences: [],
})

const likesDashboardSelector = atom(async (get) => {
  const loggedUser = get(loggedUserActiveAtom)
  if (!loggedUser || loggedUser.relationship) return EMPTY_DASHBOARD

  const location = get(locationAtom)
  if (!location || location === 'null' || location === 'undefined') {
    return EMPTY_DASHBOARD
  }

  const data = await getData(
    `/api/${location}/likes/dashboard`,
    {},
    null,
    null,
    false
  )

  return data || EMPTY_DASHBOARD
})

export default likesDashboardSelector

