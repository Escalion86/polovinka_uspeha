import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

const isLoadedAtom = atomFamily((param) => atom(false))

export default isLoadedAtom
