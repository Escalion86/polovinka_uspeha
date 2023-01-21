import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import loggedUserActiveRoleAtom from '@state/atoms/loggedUserActiveRoleAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import CheckBox from './CheckBox'
import showDeviceAtom from '@state/atoms/showDeviceAtom'

const DevSwitch = () => {
  const loggedUser = useRecoilValue(loggedUserAtom)
  const [loggedUserActiveRole, setLoggedUserActiveRole] = useRecoilState(
    loggedUserActiveRoleAtom
  )
  const [loggedUserActiveStatus, setLoggedUserActiveStatus] = useRecoilState(
    loggedUserActiveStatusAtom
  )

  const [showDevice, setShowDevice] = useRecoilState(showDeviceAtom)

  if (loggedUser.role !== 'dev') return null

  return (
    // <div className="flex items-center text-black bg-gray-200 gap-x-1">
    // {/* <Switch
    //   // defaultChecked
    //   checked={loggedUserActiveRole === 'dev'}
    //   onChange={() =>
    //     setLoggedUserActiveRole(
    //       loggedUserActiveRole === 'dev' ? 'client' : 'dev'
    //     )
    //   }
    // /> */}
    // {/* <div className="prevent-select-text">{'Режим разработчика'}</div> */}
    <>
      <div className="p-1 bg-white">
        <CheckBox
          label="Тип устройства"
          checked={showDevice}
          onChange={() => setShowDevice((checked) => !checked)}
        />
      </div>
      <ToggleButtonGroup
        className="flex bg-gray-200 rounded-none"
        color="primary"
        value={loggedUserActiveRole}
        exclusive
        onChange={(event, newRole) => {
          if (newRole !== null) setLoggedUserActiveRole(newRole)
        }}
      >
        <ToggleButton className="flex-1 leading-3 rounded-none" value="client">
          Клиент
        </ToggleButton>
        <ToggleButton className="flex-1 leading-3 rounded-none" value="admin">
          Админ
        </ToggleButton>
        <ToggleButton className="flex-1 leading-3 rounded-none" value="dev">
          DEV
        </ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup
        size="small"
        className="flex bg-gray-200 rounded-none"
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
