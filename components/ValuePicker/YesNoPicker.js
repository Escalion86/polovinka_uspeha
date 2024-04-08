import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faBan } from '@fortawesome/free-solid-svg-icons/faBan'
import ValuePicker from './ValuePicker'

export const YES_NO = [
  { value: true, name: 'Да', color: 'green-400', icon: faCheck },
  { value: false, name: 'Нет', color: 'red-400', icon: faBan },
]

const YesNoPicker = ({
  label,
  value,
  onChange = null,
  required = false,
  error = false,
  inLine,
  readOnly,
}) => (
  <ValuePicker
    value={value}
    valuesArray={YES_NO}
    label={label}
    onChange={onChange}
    name="yes_no"
    required={required}
    error={error}
    inLine={inLine}
    readOnly={readOnly}
  />
)

export default YesNoPicker
