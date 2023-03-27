import { SERVICE_USER_STATUSES } from '@helpers/constants'
import ValuePicker from './ValuePicker'

const ServiceUserStatusPicker = ({
  status,
  onChange = null,
  required = false,
  disabledValues,
  error = false,
}) => (
  <ValuePicker
    value={status}
    valuesArray={SERVICE_USER_STATUSES}
    label="Статус"
    onChange={onChange}
    name="status"
    required={required}
    error={error}
    disabledValues={disabledValues}
  />
)

export default ServiceUserStatusPicker
