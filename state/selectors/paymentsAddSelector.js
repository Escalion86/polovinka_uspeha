import paymentsAtom from '@state/atoms/paymentsAtom'
import { selector } from 'recoil'

const paymentsAddSelector = selector({
  key: 'paymentsAddSelector',
  get: () => get(paymentsAtom),
  set: ({ set, get }, items) => {
    if (typeof items !== 'object') return
    const payments = get(paymentsAtom)
    set(paymentsAtom, [...payments, ...items])
    // if (!newItem?._id) return
    // const findedItem = items.find((event) => event._id === newItem._id)
    // Если мы обновляем существующий атом
    // if (findedItem) {
    //   const newItemsList = items.map((event) => {
    //     if (event._id === newItem._id) return newItem
    //     return event
    //   })
    //   set(paymentsAtom, newItemsList)
    // } else {
    //   // Если такого атома нет и мы добавляем новый, то просто добавляем атом в список
    //   set(paymentsAtom, [...items, newItem])
    // }
  },
})

export default paymentsAddSelector
