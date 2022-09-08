import { faCheck, faBan } from '@fortawesome/free-solid-svg-icons'
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
  />
)

export default YesNoPicker
