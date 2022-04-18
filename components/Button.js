import cn from 'classnames'

const Button = ({
  name = '',
  onClick,
  className,
  disabled = false,
  classBgColor = 'bg-general',
}) => (
  <button
    onClick={() => onClick && !disabled && onClick()}
    className={cn(
      'px-4 h-10 py-1 text-white border border-gray-200 bg-opacity-90',
      className,
      disabled
        ? 'bg-gray-300 text-white cursor-not-allowed'
        : cn('hover:bg-green-600', classBgColor)
    )}
  >
    {name}
  </button>
)

export default Button
