'use client'

import { atom } from 'jotai'
import { RESET } from 'jotai/utils'
// import { atomWithDefault } from 'jotai/utils'

const atomWithRefreshAndDefault = (func) => {
  const overwrittenAtom = atom(RESET)
  // const refreshAtom = atom(func)
  return atom(
    async (get) => {
      const lastState = get(overwrittenAtom)
      // if (lastState && lastState.refresh === get(refreshAtom)) {
      //   return lastState.value
      // }
      if (lastState === RESET) return await func(get)
      else return lastState
    },
    async (get, set, update) => {
      set(overwrittenAtom, update === RESET ? await func(get) : update)
    }
  )
}

// const atomWithRefreshAndDefault = (func) => {
//   const storage = atomWithDefault(func)

//   return atomWithDefault(
//     async (get) => get(storage),
//     async (get, set, update) => {
//       console.log('Updating async atom')
//       console.log('update :>> ', update)
//       if (update === 'RESET') {
//         console.log('RESET ATOM')
//         const result = await func(get)
//         console.log('result :>> ', result)
//         return set(storage, result)
//       }
//       return set(storage, update)
//     }
//   )
// }

export default atomWithRefreshAndDefault
