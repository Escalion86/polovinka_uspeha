import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  useRecoilCallback,
} from 'recoil'

export const eventsIds = atom({
  key: 'eventsIds', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
})

export const eventsAtom = atomFamily({
  key: 'events', // unique ID (with respect to other atoms/selectors)
  default: {}, // default value (aka initial value)
})

export const eventSelector = selectorFamily({
  key: 'events-access',
  get:
    (id) =>
    ({ get }) => {
      const atom = get(eventsAtom(id))
      return atom
    },
  set:
    (id) =>
    ({ set }, event) => {
      set(eventsAtom(id), event)
      set(eventsIds(id), (prev) => [...prev, event._id])
    },
})

const eventsSelector = selector({
  key: 'allEvents',
  get: ({ get }) => {
    const eventsIdsState = get(eventsIds)
    return eventsIdsState.map((eventId) => get(eventsAtom(eventId)))
  },
  // set:
  //   (id) =>
  //   ({ set }, event) => {
  //     set(eventsAtom(id), event)
  //     set(eventsIds(id), (prev) => [...prev, event._id])
  //   },
})

// export const createEventAtom = useRecoilCallback(
//   ({ set }) =>
//     (event) => {
//       set(eventsIds, (prev) => [...prev, event._id])
//       set(eventsAtom(event._id), event)
//     },
//   []
// )

export default eventsSelector
