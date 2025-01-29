'use client'

import { atom } from 'jotai'

import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'

const paymentsAddSelector = atom(
  () => get(asyncPaymentsAtom),
  async (get, set, items) => {
    if (typeof items !== 'object') return
    const payments = await get(asyncPaymentsAtom)
    set(asyncPaymentsAtom, [...payments, ...items])
  }
)

export default paymentsAddSelector
