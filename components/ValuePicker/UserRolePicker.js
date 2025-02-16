import { TAILWIND_COLORS } from '@helpers/constants'
import ValuePicker from './ValuePicker'
import { useAtomValue } from 'jotai'
import rolesAtom from '@state/atoms/rolesAtom'

const UserRolePicker = ({
  roleId,
  onChange = null,
  required = false,
  error = false,
  noDev = true,
  noPresident = true,
}) => {
  const roles = useAtomValue(rolesAtom)

  const filteredRoles =
    noDev || noPresident
      ? roles.filter(
          ({ _id }) =>
            (!noDev || _id !== 'dev') && (!noPresident || _id !== 'president')
        )
      : roles

  const rolesValues = filteredRoles.map(({ _id, name }, index) => ({
    value: _id,
    name,
    color: TAILWIND_COLORS[index],
  }))

  const valuesArray = noDev
    ? rolesValues.filter(({ _id }) => _id !== 'dev')
    : rolesValues

  console.log('valuesArray :>> ', valuesArray)

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
