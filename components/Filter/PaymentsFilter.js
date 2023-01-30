import PaymentsPayTypeToggleButtons from '@components/IconToggleButtons/PaymentsPayTypeToggleButtons'
import PaymentsPayDirectionToggleButtons from '@components/IconToggleButtons/PaymentsPayDirectionToggleButtons'
import React from 'react'

const PaymentsFilter = ({ value, onChange, payDirectionValues }) => {
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
    </>
  )
}

export default PaymentsFilter
