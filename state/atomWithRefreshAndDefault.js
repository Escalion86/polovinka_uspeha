'use client'

import { atom } from 'jotai'
import { RESET } from 'jotai/utils'
// import { atomWithDefault } from 'jotai/utils'

const atomWithRefreshAndDefault = (func) => {
  const overwrittenAtom = atom(RESET)
  const isDebug = process.env.NEXT_PUBLIC_DEBUG_NEWSLETTERS === 'true'

  const sortRecursively = (value) => {
    if (Array.isArray(value)) return value.map(sortRecursively)

    if (value && typeof value === 'object') {
      return Object.keys(value)
        .sort()
        .reduce((acc, key) => {
          acc[key] = sortRecursively(value[key])
          return acc
        }, {})
    }

    return value
  }

  const isEqual = (prev, next) => {
    if (prev === next) return true
    if (typeof prev !== 'object' || typeof next !== 'object') return false

    try {
      const prevStr = JSON.stringify(sortRecursively(prev))
      const nextStr = JSON.stringify(sortRecursively(next))
      return prevStr === nextStr
    } catch (error) {
      if (isDebug) {
        console.debug('[Newsletters][atom] ошибка сравнения', {
          time: new Date().toISOString(),
          error,
        })
      }
      return false
    }
  }
  // const refreshAtom = atom(func)
  return atom(
    async (get) => {
      const lastState = get(overwrittenAtom)
      // if (lastState && lastState.refresh === get(refreshAtom)) {
      //   return lastState.value
      // }
      if (lastState === RESET) {
        const value = await func(get)
        if (isDebug) {
          console.debug('[Newsletters][atom] первичная загрузка', {
            time: new Date().toISOString(),
          })
        }
        return value
      }
      return lastState
    },
    async (get, set, update) => {
      const nextValue = update === RESET ? await func(get) : update
      const prevValue = get(overwrittenAtom)

      if (isEqual(prevValue, nextValue)) {
        if (isDebug) {
          console.debug('[Newsletters][atom] пропуск одинаковых данных', {
            time: new Date().toISOString(),
          })
        }
        return
      }

      if (isDebug) {
        console.debug('[Newsletters][atom] обновление', {
          time: new Date().toISOString(),
          type: update === RESET ? 'refresh' : 'manual',
          hasValue: nextValue !== undefined,
        })
      }
      set(overwrittenAtom, nextValue)
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
