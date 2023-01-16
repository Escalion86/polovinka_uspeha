import { PAY_TYPES } from '@helpers/constants'
import ValuePicker from './ValuePicker'

const PayTypePicker = ({
  payType,
  onChange = null,
  required = false,
  error,
}) => (
  <ValuePicker
    value={payType}
    valuesArray={PAY_TYPES}
    label="Тип оплаты"
    onChange={onChange}
    name="paytype"
    required={required}
    error={error}
  />
)

export default PayTypePicker
