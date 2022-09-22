import React from 'react'
import { ToggleButton } from '@mui/material'

const IconToggleButton = ({
  selected,
  onChange,
  color = 'warning',
  value,
  IconComponent,
}) => {
  return (
    <ToggleButton
      size="small"
      value={value}
      selected={selected}
      onChange={onChange}
      color={color}
    >
      {IconComponent && <IconComponent />}
    </ToggleButton>
  )
}

export default IconToggleButton
