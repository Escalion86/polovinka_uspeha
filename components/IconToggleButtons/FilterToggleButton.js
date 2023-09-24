import FilterAlt from '@mui/icons-material/FilterAlt'
import IconToggleButton from './IconToggleButton'

const FilterToggleButton = ({ value, onChange }) => {
  return (
    <IconToggleButton value={value} selected={value} onChange={onChange}>
      <FilterAlt />
    </IconToggleButton>
  )
}

export default FilterToggleButton
