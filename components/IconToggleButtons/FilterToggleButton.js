import React from 'react'
import { FilterAlt } from '@mui/icons-material'
import IconToggleButton from './IconToggleButton'

const FilterToggleButton = ({ value, onChange }) => {
  return (
    <IconToggleButton
      selected={value}
      onChange={onChange}
      IconComponent={FilterAlt}
    />
  )
}

export default FilterToggleButton
