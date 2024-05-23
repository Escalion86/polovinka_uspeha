import { selector } from 'recoil'
import eventsLoggedUserWithLikesSelector from './eventsLoggedUserWithLikesSelector'

export const menuHiddenLoggedUserLikesSelector = selector({
  key: 'menuHiddenLoggedUserLikesSelector',
  get: ({ get }) => {
    const eventsWithLikes = get(eventsLoggedUserWithLikesSelector)

    return !eventsWithLikes || eventsWithLikes.length === 0
  },
})

export default menuHiddenLoggedUserLikesSelector
