import React from 'react'

import PaymentCard from '@layouts/cards/PaymentCard'
import ListWrapper from './ListWrapper'

const PaymentsList = ({ payments }) => {
  return (
    <ListWrapper
      itemCount={payments.length}
      itemSize={52}
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
