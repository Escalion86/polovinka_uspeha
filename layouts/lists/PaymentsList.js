import React from 'react'

import PaymentCard from '@layouts/cards/PaymentCard'
import ListWrapper from './ListWrapper'
import { useRecoilValue } from 'recoil'
import windowDimensionsNumSelector from '@state/selectors/windowDimensionsNumSelector'

const PaymentsList = ({ payments }) => {
  const widthNum = useRecoilValue(windowDimensionsNumSelector)
  return (
    <ListWrapper
      itemCount={payments.length}
      itemSize={widthNum > 2 ? 68 : 60}
      className="bg-opacity-15 bg-general"
    >
      {({ index, style }) => (
        <PaymentCard
          style={style}
          key={payments[index]._id}
          paymentId={payments[index]._id}
        />
      )}
    </ListWrapper>
  )
}

export default PaymentsList
