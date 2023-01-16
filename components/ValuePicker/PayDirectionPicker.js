import { PAY_DIRECTIONS } from '@helpers/constants'
import ValuePicker from './ValuePicker'

const PayDirectionPicker = ({
  payDirection,
  onChange = null,
  required = false,
  error,
}) => (
  <ValuePicker
    value={payDirection}
    valuesArray={PAY_DIRECTIONS}
    label="Направление"
    onChange={onChange}
    name="payDirection"
    required={required}
    error={error}
  />
)

export default PayDirectionPicker
