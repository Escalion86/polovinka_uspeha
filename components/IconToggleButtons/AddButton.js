import Add from '@mui/icons-material/Add'
import IconToggleButton from './IconToggleButton'

const AddButton = ({ onClick }) => {
  return (
    <IconToggleButton onClick={onClick} aria-label="Add">
      <Add />
    </IconToggleButton>
  )
}

export default AddButton
