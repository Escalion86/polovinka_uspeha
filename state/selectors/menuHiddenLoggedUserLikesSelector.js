import { atom } from 'jotai'

import eventsLoggedUserWithLikesSelector from './eventsLoggedUserWithLikesSelector'

export const menuHiddenLoggedUserLikesSelector = atom(async (get) => {
  const eventsWithLikes = await get(eventsLoggedUserWithLikesSelector)

  return !eventsWithLikes || eventsWithLikes.length === 0
})

export default menuHiddenLoggedUserLikesSelector
