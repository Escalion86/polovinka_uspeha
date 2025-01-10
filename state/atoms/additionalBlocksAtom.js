import { getData } from '@helpers/CRUD'
import { atomWithDefault } from 'jotai/utils'

const additionalBlocksAtom = atomWithDefault(async (get) => {
  console.log('additionalBlocks leaded :>> ')
  return await getData(`/api/additionalblocks`, null, null, null, false)
})

export default additionalBlocksAtom
