import upperCaseFirst from '@helpers/upperCaseFirst'
import isLoggedUserModerSelector from '@state/selectors/isLoggedUserModerSelector'
import cn from 'classnames'
import { useRecoilValue } from 'recoil'
import TextLinesLimiter from './TextLinesLimiter'
import UserStatusIcon from './UserStatusIcon'

const UserName = ({ user, className, noWrap, thin, showStatus, trunc }) => {
  const isLoggedUserModer = useRecoilValue(isLoggedUserModerSelector)

  return (
    <div
      className={cn(
        'flex gap-x-1 overflow-visible items-center',
        thin ? '-mt-0.5' : '',
        className
      )}
    >
      {showStatus && <UserStatusIcon status={user.status} size="xs" />}
      {trunc ? (
        <TextLinesLimiter className="flex-1" lines={1}>{`${upperCaseFirst(
          user.firstName
        )} ${
          isLoggedUserModer || user.security?.fullThirdName
            ? upperCaseFirst(user.thirdName)
            : user.thirdName[0].toUpperCase() + '.'
        } ${
          isLoggedUserModer || user.security?.fullSecondName
            ? upperCaseFirst(user.secondName)
            : user.secondName[0].toUpperCase() + '.'
        }`}</TextLinesLimiter>
      ) : (
        <div
          className={cn(
            'flex gap-x-1 leading-[12px] flex-1',
            noWrap ? 'flex-nowrap' : 'flex-wrap'
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
      )}
    </div>
  )
}

export default UserName
