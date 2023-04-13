import { SECTORS } from '@helpers/constants'
import React from 'react'
import ToggleButtons from './ToggleButtons'

const PaymentsSectorToggleButtons = ({ value, onChange, acceptedValues }) => {
  return (
    <ToggleButtons
      value={value}
      onChange={onChange}
      buttonsConfig={
        acceptedValues
          ? SECTORS.filter((sector) => acceptedValues.includes(sector.value))
          : SECTORS
      }
      iconsOnly
    />
  )
}

export default PaymentsSectorToggleButtons
