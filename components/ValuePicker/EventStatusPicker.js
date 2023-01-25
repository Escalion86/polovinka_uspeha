import { EVENT_STATUSES } from '@helpers/constants'
import ValuePicker from './ValuePicker'

const EventStatusPicker = ({
  status,
  onChange = null,
  required = false,
  disabledValues,
  error = false,
}) => (
  <ValuePicker
    value={status}
    valuesArray={EVENT_STATUSES}
    label="Статус"
    onChange={onChange}
    name="status"
    required={required}
    error={error}
    disabledValues={disabledValues}
  />
)

export default EventStatusPicker
