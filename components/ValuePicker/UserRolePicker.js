import { TAILWIND_COLORS } from '@helpers/constants'
import ValuePicker from './ValuePicker'
import { useRecoilValue } from 'recoil'
import rolesAtom from '@state/atoms/rolesAtom'

const UserRolePicker = ({
  roleId,
  onChange = null,
  required = false,
  error = false,
  noDev = true,
}) => {
  const roles = useRecoilValue(rolesAtom)

  const rolesValues = roles.map(({ _id, name }, index) => ({
    value: _id,
    name,
    color: TAILWIND_COLORS[index],
  }))
  return (
    <ValuePicker
      value={roleId}
      valuesArray={
        noDev ? rolesValues.filter(({ _id }) => _id !== 'dev') : rolesValues
      }
      label="Роль"
      onChange={onChange}
      name="role"
      required={required}
      error={error}
    />
  )
}

export default UserRolePicker
