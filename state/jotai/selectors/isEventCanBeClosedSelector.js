import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import expectedIncomeOfEventSelector from './expectedIncomeOfEventSelector'
import totalIncomeOfEventSelector from './totalIncomeOfEventSelector'
import isEventExpiredFunc from '@helpers/isEventExpired'
// import eventFullAtomAsync from '@state/async/eventFullAtomAsync'
import eventSelector from './eventSelector'

const isEventCanBeClosedSelector = atomFamily((id) =>
  atom((get) => {
    const totalIncome = get(totalIncomeOfEventSelector(id))
    const expectedIncome = get(expectedIncomeOfEventSelector(id))
    const isEventExpired = isEventExpiredFunc(get(eventSelector(id)))

    return totalIncome >= expectedIncome && isEventExpired
  })
)

export default isEventCanBeClosedSelector
