import React from 'react'
import { RotateLeft, RotateRight } from '@mui/icons-material'
import IconToggleButton from './IconToggleButton'

const RotateButton = ({ onClick, direction = 'left' }) => {
  return (
    <IconToggleButton onClick={onClick}>
      {direction === 'left' ? <RotateLeft /> : <RotateRight />}
    </IconToggleButton>
  )
}

export default RotateButton
