import { atomFamily } from 'jotai/utils'

const stateAtom = atomFamily({ loading: false, error: false })

export default stateAtom
