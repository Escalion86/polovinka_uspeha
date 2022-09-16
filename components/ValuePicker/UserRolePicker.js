import { USERS_ROLES } from '@helpers/constants'
import ValuePicker from './ValuePicker'

const UserRolePicker = ({
  role,
  onChange = null,
  required = false,
  error = false,
}) => (
  <ValuePicker
    value={role}
    valuesArray={USERS_ROLES}
    label="Роль"
    onChange={onChange}
    name="role"
    required={required}
    error={error}
  />
)

export default UserRolePicker
