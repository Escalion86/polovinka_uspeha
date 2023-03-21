import React from 'react'
import { FormControl, ToggleButton } from '@mui/material'
import cn from 'classnames'

const IconToggleButton = ({
  selected,
  onChange,
  onClick,
  color = 'warning',
  value = 'default',
  size = 'm',
  children,
}) => {
  return (
    <FormControl size="small">
      <ToggleButton
        className={cn(
          'flex gap-x-1',
          size === 's' ? 'h-9 min-w-9' : 'h-10 min-w-10'
        )}
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
