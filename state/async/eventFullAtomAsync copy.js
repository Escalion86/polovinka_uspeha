import { getData } from '@helpers/CRUD'
import { DEFAULT_EVENT } from '@helpers/constants'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
// import eventsAtom from '@state/atoms/eventsAtom'
import { atomFamily, selectorFamily } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export const eventFullSelectorAsync = selectorFamily({
  key: 'eventFullSelectorAsync',
  get:
    (id) =>
    async ({ get }) => {
      if (!id) return DEFAULT_EVENT
      const res = await getData('/api/events/' + id, {}, null, null, false)
      setRecoil(isLoadedAtom('eventFullAtomAsync' + id), true)
      return res
      // return get(eventsAtom).find((item) => item._id === id)
    },
})

const eventFullAtomAsync = atomFamily({
  key: 'eventFullAtomAsync',
  default: eventFullSelectorAsync,
})

export default eventFullAtomAsync
