import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'
import { selector } from 'recoil'

const paymentsAddSelector = selector({
  key: 'paymentsAddSelector',
  get: () => get(asyncPaymentsAtom),
  set: ({ set, get }, items) => {
    if (typeof items !== 'object') return
    const payments = get(asyncPaymentsAtom)
    set(asyncPaymentsAtom, [...payments, ...items])
  },
})

export default paymentsAddSelector
