import { PAY_DIRECTIONS } from '@helpers/constants'
import React from 'react'
import ToggleButtons from './ToggleButtons'

const PaymentsPayDirectionToggleButtons = ({ value, onChange }) => {
  return (
    <ToggleButtons
      value={value}
      onChange={onChange}
      buttonsConfig={PAY_DIRECTIONS}
      iconsOnly
    />
  )
}

export default PaymentsPayDirectionToggleButtons
