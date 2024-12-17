import getUserAvatarSrc from '@helpers/getUserAvatarSrc'
import cn from 'classnames'
import Image from 'next/image'

const Avatar = ({ user, className }) => (
  <Image
    // onClick={() => closeMenu()}
    className={cn(
      'border rounded-full cursor-pointer border-white/50 object-cover min-w-9 w-11 h-11',
      className
    )}
    width={44}
    height={44}
    src={getUserAvatarSrc(user)}
    alt="Avatar"
  />
)

export default Avatar
