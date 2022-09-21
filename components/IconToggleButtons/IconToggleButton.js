import React from 'react'
import { ToggleButton } from '@mui/material'

const IconToggleButton = ({
  selected,
  onChange,
  color = 'warning',
  IconComponent,
}) => {
  return (
    <ToggleButton
      size="small"
      // value="filter"
      selected={selected}
      onChange={onChange}
      color={color}
    >
      {IconComponent && <IconComponent />}
    </ToggleButton>
  )
}

export default IconToggleButton
