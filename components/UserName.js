import cn from 'classnames'

const UserName = ({ user, className, noWrap }) => (
  <div
    className={cn(
      'flex gap-x-1',
      noWrap ? 'flex-nowrap' : 'flex-wrap',
      className
    )}
  >
    {user?.secondName && <span>{user.secondName}</span>}
    {user?.firstName && <span>{user.firstName}</span>}
    {user?.thirdName && <span>{user.thirdName}</span>}
  </div>
)

export default UserName
