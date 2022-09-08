import upperCaseFirst from '@helpers/upperCaseFirst'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import cn from 'classnames'
import { useRecoilValue } from 'recoil'

const UserName = ({ user, className, noWrap }) => {
  const loggedUser = useRecoilValue(loggedUserAtom)
  const isLoggedUserAdmin =
    loggedUser?.role === 'dev' || loggedUser?.role === 'admin'

  return (
    <div
      className={cn(
        'flex gap-x-1',
        noWrap ? 'flex-nowrap' : 'flex-wrap',
        className
      )}
    >
      {user?.firstName && <span>{upperCaseFirst(user.firstName)}</span>}
      {user?.thirdName && (
        <span>
          {isLoggedUserAdmin || user.security?.fullThirdName
            ? upperCaseFirst(user.thirdName)
            : user.thirdName[0].toUpperCase() + '.'}
        </span>
      )}
      {user?.secondName && (
        <span>
          {isLoggedUserAdmin || user.security?.fullSecondName
            ? upperCaseFirst(user.secondName)
            : user.secondName[0].toUpperCase() + '.'}
        </span>
      )}
    </div>
  )
}

export default UserName
