import RotateLeft from '@mui/icons-material/RotateLeft'
import RotateRight from '@mui/icons-material/RotateRight'
import IconToggleButton from './IconToggleButton'

const RotateButton = ({ onClick, direction = 'left' }) => {
  return (
    <IconToggleButton onClick={onClick}>
      {direction === 'left' ? <RotateLeft /> : <RotateRight />}
    </IconToggleButton>
  )
}

export default RotateButton
