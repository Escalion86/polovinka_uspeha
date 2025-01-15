import { getData } from '@helpers/CRUD'
import { atom } from 'jotai'
import locationAtom from './locationAtom'

const historiesOfEventUsersAtom = atom(async (get) => {
  const location = get(locationAtom)
  return await getData(`/api/${location}/histories`, { schema: 'eventsusers' })
})

export default historiesOfEventUsersAtom
