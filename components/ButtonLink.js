import cn from 'classnames'
import Link from 'next/link'

const ButtonLink = ({
  name = '',
  href,
  className,
  disabled = false,
  classBgColor = 'bg-general',
}) => (
  <Link href={href} shallow>
    <a
      className={cn(
        'flex justify-center items-center px-4 h-10 py-1 text-white border border-gray-200 bg-opacity-90',
        className,
        disabled
          ? 'bg-gray-300 text-white cursor-not-allowed'
          : cn('hover:bg-green-600', classBgColor)
      )}
    >
      {name}
    </a>
  </Link>
)

export default ButtonLink
