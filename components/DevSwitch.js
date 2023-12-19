import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import loggedUserActiveRoleNameAtom from '@state/atoms/loggedUserActiveRoleNameAtom'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import showDeviceAtom from '@state/atoms/showDeviceAtom'
import { useRecoilState, useRecoilValue } from 'recoil'
import CheckBox from './CheckBox'
import loggedUserRealRoleSelector from '@state/selectors/loggedUserRealRoleSelector'

const DevSwitch = () => {
  const loggedUserRealRole = useRecoilValue(loggedUserRealRoleSelector)

  const [loggedUserActiveRoleName, setLoggedUserActiveRoleName] =
    useRecoilState(loggedUserActiveRoleNameAtom)
  const [loggedUserActiveStatus, setLoggedUserActiveStatus] = useRecoilState(
    loggedUserActiveStatusAtom
  )

  const [showDevice, setShowDevice] = useRecoilState(showDeviceAtom)

  if (!loggedUserRealRole.dev) return null

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
        className="flex bg-gray-100 rounded-none"
        color="primary"
        value={loggedUserActiveRoleName}
        exclusive
        onChange={(event, newRole) => {
          if (newRole !== null) setLoggedUserActiveRoleName(newRole)
        }}
      >
        <ToggleButton className="flex-1 leading-3 rounded-none" value="client">
          Клиент
        </ToggleButton>
        <ToggleButton className="flex-1 leading-3 rounded-none" value="moder">
          Модер
        </ToggleButton>
        <ToggleButton className="flex-1 leading-3 rounded-none" value="admin">
          Админ
        </ToggleButton>
        <ToggleButton
          className="flex-1 leading-3 rounded-none"
          value="supervisor"
        >
          Рук.
        </ToggleButton>
        <ToggleButton className="flex-1 leading-3 rounded-none" value="dev">
          DEV
        </ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup
        size="small"
        className="flex bg-gray-100 rounded-none"
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
    </>
    // </div>
  )
}

export default DevSwitch
