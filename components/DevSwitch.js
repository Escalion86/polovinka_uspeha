import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import loggedUserActiveRoleNameAtom from '@state/atoms/loggedUserActiveRoleNameAtom'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import showDeviceAtom from '@state/atoms/showDeviceAtom'
import { useRecoilState, useRecoilValue } from 'recoil'
import CheckBox from './CheckBox'
import loggedUserRealRoleSelector from '@state/selectors/loggedUserRealRoleSelector'
import rolesAtom from '@state/atoms/rolesAtom'

const DevSwitch = () => {
  const roles = useRecoilValue(rolesAtom)
  const loggedUserRealRole = useRecoilValue(loggedUserRealRoleSelector)

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
    </>
    // </div>
  )
}

export default DevSwitch
