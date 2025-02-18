import { GENDERS, GENDERS_WITH_NO_GENDER } from '@helpers/constants'
import ToggleButtons from './ToggleButtons'

const GenderToggleButtons = ({ value, onChange, hideNullGender, names }) => {
  return (
    <ToggleButtons
      value={value}
      onChange={onChange}
      buttonsConfig={hideNullGender ? GENDERS : GENDERS_WITH_NO_GENDER}
      iconsOnly
      names={names}
    />
  )
}

export default GenderToggleButtons
