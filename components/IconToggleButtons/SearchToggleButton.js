import Search from '@mui/icons-material/Search'
import IconToggleButton from './IconToggleButton'

const SearchToggleButton = ({ value, onChange }) => {
  return (
    <IconToggleButton value={value} selected={value} onChange={onChange}>
      <Search />
    </IconToggleButton>
  )
}

export default SearchToggleButton
