import React from 'react'
import { useRecoilValue } from 'recoil'
import totalIncomeOfEventSelector from '@state/selectors/totalIncomeOfEventSelector'

import cn from 'classnames'

const EventProfit = ({ eventId, className }) => {
  const totalIncome = useRecoilValue(totalIncomeOfEventSelector(eventId))

  return (
    <div
      className={cn(
        'flex w-28 justify-center items-center text-base tablet:text-lg font-bold uppercase text-white px-3',
        totalIncome === 0
          ? 'bg-gray-600'
          : totalIncome > 0
          ? 'bg-success'
          : 'bg-danger',
        className
      )}
    >
      {`${totalIncome} ₽`}
    </div>
  )
}

export default EventProfit
