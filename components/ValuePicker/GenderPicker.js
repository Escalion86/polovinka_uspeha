import { GENDERS } from '@helpers/constants'
import ValuePicker from './ValuePicker'

const GenderPicker = ({ gender, onChange = null, required = false }) => (
  <ValuePicker
    value={gender}
    valuesArray={GENDERS}
    label="Пол"
    onChange={onChange}
    name="gender"
    required={required}
  />
)

export default GenderPicker
