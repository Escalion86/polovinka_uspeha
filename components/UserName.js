import upperCaseFirst from '@helpers/upperCaseFirst'
import isLoggedUserModerSelector from '@state/selectors/isLoggedUserModerSelector'
import cn from 'classnames'
import { useRecoilValue } from 'recoil'

const UserName = ({ user, className, noWrap, thin }) => {
  const isLoggedUserModer = useRecoilValue(isLoggedUserModerSelector)

  return (
    <div
      className={cn(
        'flex gap-x-1 leading-4 overflow-visible items-center',
        noWrap ? 'flex-nowrap' : 'flex-wrap',
        thin ? '-mt-0.5' : '',
        className
      )}
    >
      {user?.firstName && (
        <span className={cn(thin ? 'overflow-visible max-h-3' : '')}>
          {upperCaseFirst(user.firstName)}
        </span>
      )}
      {user?.thirdName && (
        <span className={cn(thin ? 'overflow-visible max-h-3' : '')}>
          {isLoggedUserModer || user.security?.fullThirdName
            ? upperCaseFirst(user.thirdName)
            : user.thirdName[0].toUpperCase() + '.'}
        </span>
      )}
      {user?.secondName && (
        <span className={cn(thin ? 'overflow-visible max-h-3' : '')}>
          {isLoggedUserModer || user.security?.fullSecondName
            ? upperCaseFirst(user.secondName)
            : user.secondName[0].toUpperCase() + '.'}
        </span>
      )}
    </div>
  )
}

export default UserName
