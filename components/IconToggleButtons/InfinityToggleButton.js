import AllInclusive from '@mui/icons-material/AllInclusive'
import IconToggleButton from './IconToggleButton'

const InfinityToggleButton = ({ value, onChange, size }) => {
  return (
    <IconToggleButton
      value={value}
      selected={value}
      onChange={onChange}
      size={size}
      aria-label="Infinity"
    >
      <AllInclusive />
    </IconToggleButton>
  )
}

export default InfinityToggleButton
