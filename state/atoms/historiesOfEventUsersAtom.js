import { getData } from '@helpers/CRUD'
import { atom } from 'jotai'

const historiesOfEventUsersAtom = atom(
  async (get) => await getData(`/api/histories`, { schema: 'eventsusers' })
)

export default historiesOfEventUsersAtom
