import { atom } from 'jotai'

const atomWithRefreshAndDefault = (func) => {
  const overwrittenAtom = atom(null)
  const refreshAtom = atom(func)
  return atom(
    async (get) => {
      const lastState = get(overwrittenAtom)
      if (lastState && lastState.refresh === get(refreshAtom)) {
        return lastState.value
      }
      return await func(get)
    },
    async (get, set, update) => {
      set(overwrittenAtom, { refresh: await get(refreshAtom), value: update })
    }
  )
}

export default atomWithRefreshAndDefault
