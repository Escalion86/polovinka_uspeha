import userSelector from '@state/selectors/userSelector'
import { useRecoilValue } from 'recoil'
import UserName from './UserName'

const UserNameById = ({ userId, className, noWrap }) => {
  const user = useRecoilValue(userSelector(userId))
  return <UserName user={user} className={className} noWrap={noWrap} />
}

export default UserNameById
