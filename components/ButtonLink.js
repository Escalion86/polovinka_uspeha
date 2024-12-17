import cn from 'classnames'
import Link from 'next/link'

const ButtonLink = ({
  name = '',
  href,
  className,
  disabled = false,
  classBgColor = 'bg-general',
}) => (
  <Link
    href={href}
    shallow
    className={cn(
      'flex justify-center items-center px-4 h-10 py-1 text-white border border-gray-200',
      className,
      disabled
        ? 'bg-gray-300/90 text-white cursor-not-allowed'
        : cn('hover:bg-green-600/90', classBgColor)
    )}
  >
    {name}
  </Link>
)

export default ButtonLink
