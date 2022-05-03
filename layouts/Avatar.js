import cn from 'classnames'

const Avatar = ({ user, className }) => (
  <img
    // onClick={() => closeMenu()}
    className={cn(
      'border border-opacity-50 rounded-full cursor-pointer border-whiteobject-cover h-11 w-11 min-w-9',
      className
    )}
    src={user?.image ?? `/img/users/${user?.gender ? user.gender : 'male'}.jpg`}
    alt="Avatar"
  />
)

export default Avatar
