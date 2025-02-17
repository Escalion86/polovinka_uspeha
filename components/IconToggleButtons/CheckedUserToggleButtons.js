import { CHECKED_BUTTONS } from '@helpers/constants'
import ToggleButtons from './ToggleButtons'

const CheckedUserToggleButtons = ({ value, onChange }) => (
  <ToggleButtons
    value={value}
    onChange={onChange}
    buttonsConfig={CHECKED_BUTTONS}
    iconsOnly
  />
)

export default CheckedUserToggleButtons
