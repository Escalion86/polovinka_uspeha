import { getData } from '@helpers/CRUD'
import { atom, selector } from 'recoil'

export const historiesOfEventUsersSelector = selector({
  key: 'historiesOfEventUsersSelector',
  get: async ({ get }) =>
    await getData(`/api/histories`, { schema: 'eventsusers' }),
})

const historiesOfEventUsersAtom = atom({
  key: 'historiesOfEventUsers',
  default: [],
})

export default historiesOfEventUsersAtom
