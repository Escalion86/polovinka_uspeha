import { atom } from 'jotai'

import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import eventsLoggedUserWithLikesSelector from './eventsLoggedUserWithLikesSelector'

export const badgeLoggedUserLikesToSeeSelector = atom(async (get) => {
  const loggedUser = get(loggedUserActiveAtom)
  const eventsWithLikes = await get(eventsLoggedUserWithLikesSelector)
  const eventsWithWaitingLikes = eventsWithLikes.filter(
    ({ likesProcessActive }) => likesProcessActive
  )
  const eventsWithWaitingLikesCount = eventsWithWaitingLikes.reduce(
    (sum, { eventUsers }) => {
      const loggedUserLikes = eventUsers.find(
        ({ userId }) => userId === loggedUser?._id
      )?.likes
      if (loggedUserLikes === undefined || loggedUserLikes === null)
        return sum + 1
      return sum
    },
    0
  )
  const eventsWithSettedLikes = eventsWithLikes.filter(
    ({ likesProcessActive }) => !likesProcessActive
  )

  const eventsWithSettedLikesCount = eventsWithSettedLikes.reduce(
    (sum, { eventUsers }) => {
      const loggedUserSeeLikesResult = eventUsers.find(
        ({ userId }) => userId === loggedUser?._id
      )?.seeLikesResult
      if (!loggedUserSeeLikesResult) return sum + 1
      return sum
    },
    0
  )
  return eventsWithWaitingLikesCount + eventsWithSettedLikesCount
})

export default badgeLoggedUserLikesToSeeSelector
