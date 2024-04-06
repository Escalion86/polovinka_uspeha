import { getData } from '@helpers/CRUD'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
// import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import { selectorFamily } from 'recoil'
import { setRecoil } from 'recoil-nexus'
import asyncPaymentsAtom from './asyncPaymentsAtom'

export const asyncPaymentsOfUserIdSelector = selectorFamily({
  key: 'asyncPaymentsOfUserIdSelector',
  get:
    (userId) =>
    async ({ get }) => {
      // console.log('!!! asyncEventsUsersAllSelector ')
      if (!userId) return []

      if (get(isLoadedAtom('asyncPaymentsAtom'))) {
        const allPayments = await get(asyncPaymentsAtom)
        setRecoil(isLoadedAtom('asyncPaymentsOfUserIdAtom' + userId), true)
        return allPayments.filter((payment) => payment.userId === userId)
      }

      const res = await getData('/api/payments', { userId }, null, null, false)
      setRecoil(isLoadedAtom('asyncPaymentsOfUserIdAtom' + userId), true)
      // setRecoil(isLoadedAtom('asyncEventsUsersAllAtom'), true)
      // setRecoil(isLoadedAtom('asyncEventsUsersAllSelector'), true)
      // // Throw error with status code in case Fetch API req failed
      // if (!res.ok) {
      //   throw new Error(res.status)
      // }

      // const json = await res.json()
      // const { data } = json

      return res
    },
})

export default asyncPaymentsOfUserIdSelector
