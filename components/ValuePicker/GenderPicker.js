import { SECTORS } from '@helpers/constants'
import ValuePicker from './ValuePicker'

const SectorPicker = ({
  sector,
  onChange = null,
  required = false,
  error = false,
  readOnly,
  disabledValues,
}) => (
  <ValuePicker
    value={sector}
    valuesArray={SECTORS}
    label="Продукт"
    onChange={onChange}
    name="gender"
    required={required}
    error={error}
    disabledValues={disabledValues}
    readOnly={readOnly}
  />
)

export default SectorPicker
