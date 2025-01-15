import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import expectedIncomeOfEventSelector from './expectedIncomeOfEventSelector'
import totalIncomeOfEventSelector from './totalIncomeOfEventSelector'
import isEventExpiredFunc from '@helpers/isEventExpired'
// import eventFullAtomAsync from '@state/async/eventFullAtomAsync'
import eventSelector from './eventSelector'

const isEventCanBeClosedSelector = atomFamily((id) =>
  atom(async (get) => {
    const totalIncome = await get(totalIncomeOfEventSelector(id))
    const expectedIncome = await get(expectedIncomeOfEventSelector(id))
    const event = await get(eventSelector(id))
    const isEventExpired = isEventExpiredFunc(event)

    return totalIncome >= expectedIncome && isEventExpired
  })
)

export default isEventCanBeClosedSelector
