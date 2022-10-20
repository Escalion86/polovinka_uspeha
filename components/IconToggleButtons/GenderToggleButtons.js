import React from 'react'
import ToggleButtons from './ToggleButtons'
import { GENDERS_WITH_NO_GENDER } from '@helpers/constants'

const GenderToggleButtons = ({ value, onChange }) => {
  return (
    <ToggleButtons
      value={value}
      onChange={onChange}
      buttonsConfig={GENDERS_WITH_NO_GENDER}
      iconsOnly
    />
  )
}

export default GenderToggleButtons
