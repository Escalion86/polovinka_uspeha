import React from 'react'
import { Tooltip as MuiTooltip } from '@mui/material'

const Tooltip = ({
  children,
  title,
  onClose,
  onOpen,
  open,
  disableFocusListener,
  disableHoverListener,
  disableTouchListener,
  PopperProps,
  disableInteractive = true,
}) => {
  if (!title) return children
  return (
    <MuiTooltip
      title={title}
      onClose={onClose}
      onOpen={onOpen}
      open={open}
      disableFocusListener={disableFocusListener}
      disableHoverListener={disableHoverListener}
      disableTouchListener={disableTouchListener}
      PopperProps={PopperProps}
      placement="top"
      arrow
      disableInteractive={disableInteractive}
    >
      {children}
    </MuiTooltip>
  )
}

export default Tooltip
