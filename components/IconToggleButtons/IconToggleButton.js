import React from 'react'
import { ToggleButton } from '@mui/material'

const IconToggleButton = ({
  selected,
  onChange,
  color = 'warning',
  value,
  children,
}) => {
  return (
    <ToggleButton
      size="small"
      value={value}
      selected={selected}
      onChange={onChange}
      color={color}
    >
      {children}
    </ToggleButton>
  )
}

export default IconToggleButton
