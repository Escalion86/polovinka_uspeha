import { USERS_STATUSES } from '@helpers/constants'
import ValuePicker from './ValuePicker'

const UserStatusPicker = ({
  status,
  onChange = null,
  required = false,
  error = false,
}) => (
  <ValuePicker
    value={status}
    valuesArray={USERS_STATUSES}
    label="Статус"
    onChange={onChange}
    name="status"
    required={required}
    error={error}
  />
)

export default UserStatusPicker
