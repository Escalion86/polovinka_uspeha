import upperCaseFirst from '@helpers/upperCaseFirst'
import cn from 'classnames'
import { useAtomValue } from 'jotai'
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
  leadingClass = 'leading-[14px] phoneH:leading-[18px]',
}) => {
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  if (!user || typeof user !== 'object') return null
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
          className={cn('flex-1', leadingClass)}
          textCenter={false}
          lines={typeof trunc === 'number' ? trunc : 1}
        >
          {`${upperCaseFirst(user.firstName.trim())}${
            user.thirdName
              ? ` ${
                  seeFullNames || user.security?.fullThirdName
                    ? upperCaseFirst(user.thirdName.trim())
                    : user.thirdName[0].trim().toUpperCase() + '.'
                }`
              : ''
          }${
            user.secondName
              ? ` ${
                  seeFullNames || user.security?.fullSecondName
                    ? upperCaseFirst(user.secondName.trim())
                    : user.secondName[0].trim().toUpperCase() + '.'
                }`
              : ''
          }`}
          {children}
        </TextLinesLimiter>
      ) : (
        <div
          className={cn(
            'flex gap-x-1 flex-1',
            noWrap ? 'flex-nowrap' : 'flex-wrap',
            leadingClass
          )}
        >
          {user?.firstName && (
            <span className={cn(thin ? 'overflow-visible max-h-3' : '')}>
              {upperCaseFirst(user.firstName.trim())}
            </span>
          )}
          {user?.thirdName && (
            <span className={cn(thin ? 'overflow-visible max-h-3' : '')}>
              {seeFullNames || user.security?.fullThirdName
                ? upperCaseFirst(user.thirdName.trim())
                : user.thirdName[0].trim().toUpperCase() + '.'}
            </span>
          )}
          {user?.secondName && (
            <span className={cn(thin ? 'overflow-visible max-h-3' : '')}>
              {seeFullNames || user.security?.fullSecondName
                ? upperCaseFirst(user.secondName.trim())
                : user.secondName[0].trim().toUpperCase() + '.'}
            </span>
          )}
          {children}
        </div>
      )}
    </div>
  )
}

export default UserName
