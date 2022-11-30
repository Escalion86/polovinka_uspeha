import React from 'react'
import { FormControl, ToggleButton } from '@mui/material'

const IconToggleButton = ({
  selected,
  onChange,
  onClick,
  color = 'warning',
  value = 'default',
  children,
}) => {
  return (
    <FormControl size="small">
      <ToggleButton
        className="flex h-10 min-w-10 gap-x-1"
        size="small"
        value={value}
        selected={selected}
        onChange={onChange}
        color={color}
        onClick={onClick}
      >
        {children}
      </ToggleButton>
    </FormControl>
  )
}

export default IconToggleButton
