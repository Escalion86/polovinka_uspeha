import React from 'react'
import { AllInclusive } from '@mui/icons-material'
import IconToggleButton from './IconToggleButton'

const InfinityToggleButton = ({ value, onChange, size }) => {
  return (
    <IconToggleButton
      value={value}
      selected={value}
      onChange={onChange}
      size={size}
    >
      <AllInclusive />
    </IconToggleButton>
  )
}

export default InfinityToggleButton
