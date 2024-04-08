import upperCaseFirst from '@helpers/upperCaseFirst'
import cn from 'classnames'
import { useRecoilValue } from 'recoil'
import TextLinesLimiter from './TextLinesLimiter'
import UserStatusIcon from './UserStatusIcon'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'

const UserName = ({
  user,
  className,
  noWrap,
  thin,
  showStatus,
  trunc,
  children,
}) => {
  const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)
  if (!user) return null

  const seeFullNames = loggedUserActiveRole?.users?.seeFullNames

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
        <TextLinesLimiter
          className="flex-1 leading-[14px]"
          textCenter={false}
          lines={typeof trunc === 'number' ? trunc : 1}
        >
          {`${upperCaseFirst(user.firstName)}${
            user.thirdName
              ? ` ${
                  seeFullNames || user.security?.fullThirdName
                    ? upperCaseFirst(user.thirdName)
                    : user.thirdName[0].toUpperCase() + '.'
                }`
              : ''
          }${
            user.secondName
              ? ` ${
                  seeFullNames || user.security?.fullSecondName
                    ? upperCaseFirst(user.secondName)
                    : user.secondName[0].toUpperCase() + '.'
                }`
              : ''
          }`}
          {children}
        </TextLinesLimiter>
      ) : (
        <div
          className={cn(
            'flex gap-x-1 leading-[14px] flex-1',
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
              {seeFullNames || user.security?.fullThirdName
                ? upperCaseFirst(user.thirdName)
                : user.thirdName[0].toUpperCase() + '.'}
            </span>
          )}
          {user?.secondName && (
            <span className={cn(thin ? 'overflow-visible max-h-3' : '')}>
              {seeFullNames || user.security?.fullSecondName
                ? upperCaseFirst(user.secondName)
                : user.secondName[0].toUpperCase() + '.'}
            </span>
          )}
          {children}
        </div>
      )}
    </div>
  )
}

export default UserName
