import { DEFAULT_EVENT } from '@helpers/constants'
import eventFullAtomAsync from '@state/async/eventFullAtomAsync'
import eventsAtom from '@state/atoms/eventsAtom'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import { selectorFamily } from 'recoil'
// import { getRecoil } from 'recoil-nexus'

export const eventSelector = selectorFamily({
  key: 'eventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return DEFAULT_EVENT
      if (get(isLoadedAtom('eventFullAtomAsync' + id))) {
        return get(eventFullAtomAsync(id))
      }
      return get(eventsAtom).find((item) => item._id === id)
    },
})

export default eventSelector
