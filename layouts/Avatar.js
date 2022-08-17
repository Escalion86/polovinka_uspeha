import getUserAvatarSrc from '@helpers/getUserAvatarSrc'
import cn from 'classnames'

const Avatar = ({ user, className }) => (
  <img
    // onClick={() => closeMenu()}
    className={cn(
      'border border-opacity-50 rounded-full cursor-pointer border-whiteobject-cover h-11 w-11 min-w-9',
      className
    )}
    src={getUserAvatarSrc(user)}
    alt="Avatar"
  />
)

export default Avatar
