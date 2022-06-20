import cn from 'classnames'

const Button = ({
  name = '',
  onClick,
  className,
  disabled = false,
  classBgColor = 'bg-general',
  classHoverBgColor = 'hover:bg-green-600',
}) => (
  <button
    onClick={() => onClick && !disabled && onClick()}
    className={cn(
      'px-4 h-9 py-1 rounded text-white bg-opacity-90',
      className,
      disabled
        ? 'bg-gray-300 text-white cursor-not-allowed'
        : cn(classHoverBgColor, classBgColor)
    )}
  >
    {name}
  </button>
)

export default Button
