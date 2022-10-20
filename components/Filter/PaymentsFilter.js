import PaymentsPayTypeToggleButtons from '@components/IconToggleButtons/PaymentsPayTypeToggleButtons'
import React from 'react'

const PaymentsFilter = ({ value, onChange }) => {
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
    </>
  )
}

export default PaymentsFilter
