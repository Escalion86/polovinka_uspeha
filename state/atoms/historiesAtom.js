// import { getData } from '@helpers/CRUD'
import {
  atom,
  //  selector
} from 'recoil'

// export const historiesSelector = selector({
//   key: 'historiesSelector',
//   get: async ({ get }) => {
//     // const res = await fetchingHistories('http://localhost:3000')
//     const res = await getData(`/api/histories`, {})
//     console.log('res :>> ', res)
//     return res
//   },
// })

const historiesAtom = atom({
  key: 'histories',
  default: [],
})

export default historiesAtom
