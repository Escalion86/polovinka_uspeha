import store from '@state/store'

const setJotaiFunc = (atom) => (value) => store.set(atom, value)

export default setJotaiFunc
