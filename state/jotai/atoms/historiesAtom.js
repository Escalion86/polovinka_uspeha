import { getData } from '@helpers/CRUD'
import { atom } from 'jotai'

const historiesAtom = atom(async (get) => await getData(`/api/histories`, {}))

export default historiesAtom
