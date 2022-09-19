import React from 'react'
import { Popper as MuiPopper } from '@mui/material'

const Popover = ({ text, children }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popper' : undefined

  return (
    <>
      {children(handleClick)}
      <MuiPopper id={id} open={open} anchorEl={anchorEl}>
        <div>{text}</div>
      </MuiPopper>
    </>
  )
}

export default Popover
