import { PRODUCT_USER_STATUSES } from '@helpers/constants'
import ValuePicker from './ValuePicker'

const ProductUserStatusPicker = ({
  status,
  onChange = null,
  required = false,
  disabledValues,
  error = false,
}) => (
  <ValuePicker
    value={status}
    valuesArray={PRODUCT_USER_STATUSES}
    label="Статус"
    onChange={onChange}
    name="status"
    required={required}
    error={error}
    disabledValues={disabledValues}
  />
)

export default ProductUserStatusPicker
