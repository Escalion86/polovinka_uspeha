import upperCaseFirst from '@helpers/upperCaseFirst'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import cn from 'classnames'
import { useRecoilValue } from 'recoil'

const UserName = ({ user, className, noWrap }) => {
  const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)

  return (
    <div
      className={cn(
        'flex gap-x-1 leading-4 overflow-visible',
        noWrap ? 'flex-nowrap' : 'flex-wrap',
        className
      )}
    >
      {user?.firstName && (
        <span className="overflow-visible max-h-3">
          {upperCaseFirst(user.firstName)}
        </span>
      )}
      {user?.thirdName && (
        <span className="overflow-visible max-h-3">
          {isLoggedUserAdmin || user.security?.fullThirdName
            ? upperCaseFirst(user.thirdName)
            : user.thirdName[0].toUpperCase() + '.'}
        </span>
      )}
      {user?.secondName && (
        <span className="overflow-visible max-h-3">
          {isLoggedUserAdmin || user.security?.fullSecondName
            ? upperCaseFirst(user.secondName)
            : user.secondName[0].toUpperCase() + '.'}
        </span>
      )}
    </div>
  )
}

export default UserName
