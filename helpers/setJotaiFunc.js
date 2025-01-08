import store from '@state/jotai/store'

const setJotaiFunc = (atom) => (value) => store.set(atom, value)

export default setJotaiFunc
