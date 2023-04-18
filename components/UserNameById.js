import userSelector from '@state/selectors/userSelector'
import { useRecoilValue } from 'recoil'
import UserName from './UserName'

const UserNameById = ({ userId, className, noWrap, showStatus, trunc }) => {
  const user = useRecoilValue(userSelector(userId))
  return (
    <UserName
      user={user}
      className={className}
      noWrap={noWrap}
      showStatus={showStatus}
      trunc={trunc}
    />
  )
}

export default UserNameById
