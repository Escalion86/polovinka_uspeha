import { getData } from '@helpers/CRUD'
import { atom } from 'jotai'
import locationAtom from './locationAtom'

const historiesAtom = atom(async (get) => {
  const location = get(locationAtom)
  return await getData(`/api/${location}/histories`, {})
})

export default historiesAtom
