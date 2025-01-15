import { getData } from '@helpers/CRUD'
import { atomWithDefault } from 'jotai/utils'
import locationAtom from './locationAtom'

const additionalBlocksAtom = atomWithDefault(async (get) => {
  const location = get(locationAtom)
  return await getData(
    `/api/${location}/additionalblocks`,
    null,
    null,
    null,
    false
  )
})

export default additionalBlocksAtom
