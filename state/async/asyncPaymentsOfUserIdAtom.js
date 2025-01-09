import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { getData } from '@helpers/CRUD'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import store from '../store'
import asyncPaymentsAtom from './asyncPaymentsAtom'

const asyncPaymentsOfUserIdAtom = atomFamily((userId) =>
  atom(async (get) => {
    // console.log('!!! asyncEventsUsersAllSelector ')
    if (!userId) return []

    if (get(isLoadedAtom('asyncPaymentsAtom'))) {
      const allPayments = await get(asyncPaymentsAtom)
      store.set(isLoadedAtom('asyncPaymentsOfUserIdAtom' + userId), true)
      return allPayments.filter((payment) => payment.userId === userId)
    }

    const res = await getData('/api/payments', { userId }, null, null, false)
    store.set(isLoadedAtom('asyncPaymentsOfUserIdAtom' + userId), true)
    // // Throw error with status code in case Fetch API req failed
    // if (!res.ok) {
    //   throw new Error(res.status)
    // }

    // const json = await res.json()
    // const { data } = json

    return res
  })
)

export default asyncPaymentsOfUserIdAtom
