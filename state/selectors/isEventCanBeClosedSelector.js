import { selectorFamily } from 'recoil'
import expectedIncomeOfEventSelector from './expectedIncomeOfEventSelector'
import totalIncomeOfEventSelector from './totalIncomeOfEventSelector'
import isEventExpiredFunc from '@helpers/isEventExpired'
import eventAtom from '@state/async/eventAtom'

const isEventCanBeClosedSelector = selectorFamily({
  key: 'isEventCanBeClosedSelector',
  get:
    (id) =>
    ({ get }) => {
      const totalIncome = get(totalIncomeOfEventSelector(id))
      const expectedIncome = get(expectedIncomeOfEventSelector(id))
      const isEventExpired = isEventExpiredFunc(get(eventAtom(id)))

      return totalIncome >= expectedIncome && isEventExpired
    },
})

export default isEventCanBeClosedSelector
