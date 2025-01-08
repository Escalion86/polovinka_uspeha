import { atom } from 'jotai'

import eventsLoggedUserWithLikesSelector from './eventsLoggedUserWithLikesSelector'

export const menuHiddenLoggedUserLikesSelector = atom((get) => {
  const eventsWithLikes = get(eventsLoggedUserWithLikesSelector)

  return !eventsWithLikes || eventsWithLikes.length === 0
})

export default menuHiddenLoggedUserLikesSelector
