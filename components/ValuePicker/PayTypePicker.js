import { PAY_TYPES } from '@helpers/constants'
import ValuePicker from './ValuePicker'

const PayTypePicker = ({
  payType,
  onChange = null,
  required = false,
  error,
  readOnly,
  label = 'Тип оплаты',
}) => (
  <ValuePicker
    value={payType}
    valuesArray={PAY_TYPES}
    label={label}
    onChange={onChange}
    name="paytype"
    required={required}
    error={error}
    readOnly={readOnly}
  />
)

export default PayTypePicker
