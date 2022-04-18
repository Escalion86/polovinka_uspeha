import { GENDERS } from '@helpers/constants'
import ValuePicker from './ValuePicker'

const GenderPicker = ({
  gender,
  onChange = null,
  inLine = false,
  className = null,
  labelStyle = null,
  required = false,
  readOnly = false,
}) => (
  <ValuePicker
    value={gender}
    valuesArray={GENDERS}
    label="Пол"
    onChange={onChange}
    inLine={inLine}
    className={className}
    labelStyle={labelStyle}
    name="gender"
    required={required}
    readOnly={readOnly}
  />
)

export default GenderPicker
