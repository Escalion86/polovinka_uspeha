import React from 'react'
import { FilterAlt } from '@mui/icons-material'
import IconToggleButton from './IconToggleButton'

const FilterToggleButton = ({ value, onChange }) => {
  return (
    <IconToggleButton value={value} selected={value} onChange={onChange}>
      <FilterAlt />
    </IconToggleButton>
  )
}

export default FilterToggleButton
