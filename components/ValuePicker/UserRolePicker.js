import { USERS_ROLES } from '@helpers/constants'
import ValuePicker from './ValuePicker'

const UserRolePicker = ({
  role,
  onChange = null,
  required = false,
  error = false,
  noDev = true,
}) => (
  <ValuePicker
    value={role}
    valuesArray={
      noDev ? USERS_ROLES.filter(({ value }) => value !== 'dev') : USERS_ROLES
    }
    label="Роль"
    onChange={onChange}
    name="role"
    required={required}
    error={error}
  />
)

export default UserRolePicker
