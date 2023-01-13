import React from 'react'

// import { useWindowDimensionsTailwindNum } from '@helpers/useWindowDimensions'
import PaymentCard from '@layouts/cards/PaymentCard'
import ListWrapper from './ListWrapper'

const PaymentsList = ({ payments }) => {
  // const windowWidthNum = useWindowDimensionsTailwindNum()
  return (
    <ListWrapper itemCount={payments.length} itemSize={44}>
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
