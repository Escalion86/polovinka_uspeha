import { atomFamily } from 'recoil'

const loadingEventsAtom = atomFamily({
  key: 'loadingEventsAtom', // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
})

export default loadingEventsAtom
