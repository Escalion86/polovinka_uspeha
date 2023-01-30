import { selectorFamily } from 'recoil'
import expectedIncomeOfEventSelector from './expectedIncomeOfEventSelector'
import totalIncomeOfEventSelector from './totalIncomeOfEventSelector'

const isEventCanBeClosedSelector = selectorFamily({
  key: 'isEventCanBeClosedSelector',
  get:
    (id) =>
    ({ get }) => {
      const totalIncome = get(totalIncomeOfEventSelector(id))
      const expectedIncome = get(expectedIncomeOfEventSelector(id))

      return totalIncome >= expectedIncome
    },
})

export default isEventCanBeClosedSelector
