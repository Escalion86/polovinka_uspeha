import { SECTORS2 } from '@helpers/constants'
import ValuePicker from './ValuePicker'

const LinkTypePicker = ({
  linkType,
  onChange = null,
  required = false,
  error = false,
  readOnly,
  disabledValues,
}) => (
  <ValuePicker
    value={linkType}
    valuesArray={SECTORS2}
    label="Сектор"
    onChange={onChange}
    name="sector"
    required={required}
    error={error}
    disabledValues={disabledValues}
    readOnly={readOnly}
  />
)

export default LinkTypePicker
