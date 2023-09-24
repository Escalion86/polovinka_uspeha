import { GENDERS, GENDERS_WITH_NO_GENDER } from '@helpers/constants'
import ToggleButtons from './ToggleButtons'

const GenderToggleButtons = ({ value, onChange, hideNullGender }) => {
  return (
    <ToggleButtons
      value={value}
      onChange={onChange}
      buttonsConfig={hideNullGender ? GENDERS : GENDERS_WITH_NO_GENDER}
      iconsOnly
    />
  )
}

export default GenderToggleButtons
