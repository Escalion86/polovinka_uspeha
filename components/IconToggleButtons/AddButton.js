import React from 'react'
import { Add, FilterAlt } from '@mui/icons-material'
import IconToggleButton from './IconToggleButton'

const AddButton = ({ onClick }) => {
  return (
    <IconToggleButton onClick={onClick}>
      <Add />
    </IconToggleButton>
  )
}

export default AddButton
