import Add from '@mui/icons-material/Add'
import IconToggleButton from './IconToggleButton'

const AddButton = ({ onClick }) => {
  return (
    <IconToggleButton onClick={onClick}>
      <Add />
    </IconToggleButton>
  )
}

export default AddButton
