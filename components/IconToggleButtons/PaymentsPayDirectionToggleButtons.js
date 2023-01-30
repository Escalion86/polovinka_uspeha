import { PAY_DIRECTIONS } from '@helpers/constants'
import React from 'react'
import ToggleButtons from './ToggleButtons'

const PaymentsPayDirectionToggleButtons = ({
  value,
  onChange,
  acceptedValues,
}) => {
  return (
    <ToggleButtons
      value={value}
      onChange={onChange}
      buttonsConfig={
        acceptedValues
          ? PAY_DIRECTIONS.filter((payDirection) =>
              acceptedValues.includes(payDirection.value)
            )
          : PAY_DIRECTIONS
      }
      iconsOnly
    />
  )
}

export default PaymentsPayDirectionToggleButtons
