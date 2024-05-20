import IconToggleButton from './IconToggleButton'
import ArrowBack from '@mui/icons-material/ArrowBack'

const BackButton = ({ onClick, ...props }) => {
  return (
    <IconToggleButton onClick={onClick} aria-label="Back" {...props}>
      <ArrowBack />
    </IconToggleButton>
  )
}

export default BackButton
