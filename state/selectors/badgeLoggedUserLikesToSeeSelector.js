'use client'

import { atom } from 'jotai'

import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import eventsLoggedUserWithLikesSelector from './eventsLoggedUserWithLikesSelector'

const badgeLoggedUserLikesToSeeSelector = atom(async (get) => {
  const loggedUser = get(loggedUserActiveAtom)
  if (!loggedUser || loggedUser.relationship) return 0
  const eventsWithLikes = await get(eventsLoggedUserWithLikesSelector)
  if (!eventsWithLikes || eventsWithLikes.length === 0) return 0

  return eventsWithLikes.reduce((sum, { likesProcessActive, eventUsers }) => {
    if (!likesProcessActive) return sum
    const loggedUserLikes = eventUsers.find(
      ({ userId }) => userId === loggedUser?._id
    )?.likes

    if (loggedUserLikes === undefined || loggedUserLikes === null) return sum + 1
    return sum
  }, 0)
})

export default badgeLoggedUserLikesToSeeSelector
