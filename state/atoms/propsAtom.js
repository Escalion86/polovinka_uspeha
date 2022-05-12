import { atom } from 'recoil'

const propsAtom = atom({
  key: 'propsAtom', // unique ID (with respect to other atoms/selectors)
  default: {
    users: [],
    events: [],
    directions: [],
    reviews: [],
    additionalBlocks: [],
    eventsUsers: [],
    page: '',
    loggedUser: null,
  }, // default value (aka initial value)
})

export default propsAtom
