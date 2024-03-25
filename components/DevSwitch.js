import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import loggedUserActiveRoleNameAtom from '@state/atoms/loggedUserActiveRoleNameAtom'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import showDeviceAtom from '@state/atoms/showDeviceAtom'
import { useRecoilState, useRecoilValue } from 'recoil'
import CheckBox from './CheckBox'
import loggedUserRealRoleSelector from '@state/selectors/loggedUserRealRoleSelector'
import rolesAtom from '@state/atoms/rolesAtom'
import Button from './Button'
import { modalsFuncAtom } from '@state/atoms'
import usersAtom from '@state/atoms/usersAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'

const DevSwitch = () => {
  const roles = useRecoilValue(rolesAtom)
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const users = useRecoilValue(usersAtom)
  const loggedUserRealRole = useRecoilValue(loggedUserRealRoleSelector)
  const loggedUser = useRecoilValue(loggedUserAtom)
  const [loggedUserActive, setLoggedUserActive] =
    useRecoilState(loggedUserActiveAtom)

  const [loggedUserActiveRoleName, setLoggedUserActiveRoleName] =
    useRecoilState(loggedUserActiveRoleNameAtom)
  const [loggedUserActiveStatus, setLoggedUserActiveStatus] = useRecoilState(
    loggedUserActiveStatusAtom
  )

  const [showDevice, setShowDevice] = useRecoilState(showDeviceAtom)

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
            [loggedUserActive._id],
            {},
            (ids) => {
              const selectedUser = users.find(({ _id }) => _id === ids[0])
              setLoggedUserActive(selectedUser)
              setLoggedUserActiveRoleName(selectedUser.role)
              setLoggedUserActiveStatus(selectedUser.status)
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
