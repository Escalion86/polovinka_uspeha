import PaymentsPayTypeToggleButtons from '@components/IconToggleButtons/PaymentsPayTypeToggleButtons'
import PaymentsPayDirectionToggleButtons from '@components/IconToggleButtons/PaymentsPayDirectionToggleButtons'
import React from 'react'
import PaymentsSectorToggleButtons from '@components/IconToggleButtons/PaymentsSectorToggleButtons'

const PaymentsFilter = ({
  value,
  onChange,
  payDirectionValues,
  paySectorValues,
}) => {
  return (
    <>
      {value?.payType && (
        <PaymentsPayTypeToggleButtons
          value={value.payType}
          onChange={(value) =>
            onChange((state) => ({ ...state, payType: value }))
          }
        />
      )}
      {value?.payDirection && (
        <PaymentsPayDirectionToggleButtons
          value={value.payDirection}
          onChange={(value) =>
            onChange((state) => ({ ...state, payDirection: value }))
          }
          acceptedValues={payDirectionValues}
        />
      )}
      {value?.sector && (
        <PaymentsSectorToggleButtons
          value={value.sector}
          onChange={(value) =>
            onChange((state) => ({ ...state, sector: value }))
          }
          acceptedValues={paySectorValues}
        />
      )}
    </>
  )
}

export default PaymentsFilter
