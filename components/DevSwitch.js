import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import loggedUserActiveRoleNameAtom from '@state/atoms/loggedUserActiveRoleNameAtom'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import showDeviceAtom from '@state/atoms/showDeviceAtom'
import { useAtom, useAtomValue } from 'jotai'
import CheckBox from './CheckBox'
import loggedUserRealRoleSelector from '@state/selectors/loggedUserRealRoleSelector'
import rolesAtom from '@state/atoms/rolesAtom'
import Button from './Button'
import modalsFuncAtom from '@state/atoms/modalsFuncAtom'
// import usersAtomAsync from '@state/async/usersAtomAsync'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'

const DevSwitch = () => {
  const roles = useAtomValue(rolesAtom)
  const modalsFunc = useAtomValue(modalsFuncAtom)
  // const users = useAtomValue(usersAtomAsync)
  const loggedUserRealRole = useAtomValue(loggedUserRealRoleSelector)
  const loggedUser = useAtomValue(loggedUserAtom)
  const [loggedUserActive, setLoggedUserActive] = useAtom(loggedUserActiveAtom)

  const [loggedUserActiveRoleName, setLoggedUserActiveRoleName] = useAtom(
    loggedUserActiveRoleNameAtom
  )
  const [loggedUserActiveStatus, setLoggedUserActiveStatus] = useAtom(
    loggedUserActiveStatusAtom
  )

  const [showDevice, setShowDevice] = useAtom(showDeviceAtom)

  if (!loggedUserRealRole?.dev) return null

  return (
    <>
      <div className="p-1 text-black bg-gray-100">
        <CheckBox
          label="Тип устройства"
          checked={showDevice}
          onChange={() => setShowDevice((checked) => !checked)}
        />
      </div>
      <ToggleButtonGroup
        className="flex flex-col bg-gray-100 border-t border-black rounded-none"
        color="primary"
        value={loggedUserActiveRoleName}
        exclusive
        onChange={(event, newRole) => {
          if (newRole !== null) setLoggedUserActiveRoleName(newRole)
        }}
      >
        {roles.map(({ _id, name }) => (
          <ToggleButton
            key={_id}
            className="flex-1 leading-3 rounded-none"
            value={_id}
          >
            {name}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <ToggleButtonGroup
        size="small"
        className="flex bg-gray-100 border-t border-black rounded-none"
        color="primary"
        value={loggedUserActiveStatus}
        exclusive
        onChange={(event, newStatus) => {
          if (newStatus !== null) setLoggedUserActiveStatus(newStatus)
        }}
      >
        <ToggleButton className="flex-1 leading-3 rounded-none" value="novice">
          Новичок
        </ToggleButton>
        <ToggleButton className="flex-1 leading-3 rounded-none" value="member">
          Участник клуба
        </ToggleButton>
      </ToggleButtonGroup>
      <Button
        name="Выбрать аккаунт"
        onClick={() =>
          modalsFunc.selectUsers(
            [loggedUserActive],
            {},
            (users) => {
              const user = users[0]
              // const selectedUser = users.find(({ _id }) => _id === ids[0])
              setLoggedUserActive(user)
              setLoggedUserActiveRoleName(user.role)
              setLoggedUserActiveStatus(user.status)
            },
            [],
            undefined,
            1,
            false,
            'Выберите аккаунт под которым хотите зайти'
          )
        }
        className="w-full mt-0.5"
      />
      {loggedUser._id !== loggedUserActive._id && (
        <Button
          name="Вернуться в свой аккаунт"
          onClick={() => {
            setLoggedUserActive(loggedUser)
            setLoggedUserActiveRoleName(loggedUser.role)
            setLoggedUserActiveStatus(loggedUser.status)
          }}
          className="w-full mt-0.5"
        />
      )}
    </>
    // </div>
  )
}

export default DevSwitch
