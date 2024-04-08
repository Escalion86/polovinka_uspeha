import { selectorFamily } from 'recoil'
import expectedIncomeOfEventSelector from './expectedIncomeOfEventSelector'
import totalIncomeOfEventSelector from './totalIncomeOfEventSelector'
import isEventExpiredFunc from '@helpers/isEventExpired'
// import eventFullAtomAsync from '@state/async/eventFullAtomAsync'
import eventSelector from './eventSelector'

const isEventCanBeClosedSelector = selectorFamily({
  key: 'isEventCanBeClosedSelector',
  get:
    (id) =>
    ({ get }) => {
      const totalIncome = get(totalIncomeOfEventSelector(id))
      const expectedIncome = get(expectedIncomeOfEventSelector(id))
      const isEventExpired = isEventExpiredFunc(get(eventSelector(id)))

      return totalIncome >= expectedIncome && isEventExpired
    },
})

export default isEventCanBeClosedSelector
