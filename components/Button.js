import cn from 'classnames'
import LoadingSpinner from './LoadingSpinner'

const Button = ({
  name = '',
  onClick,
  className,
  disabled = false,
  classBgColor = 'bg-general',
  classHoverBgColor = 'hover:bg-green-600',
  loading = false,
}) => {
  return loading ? (
    <div
      className={cn(
        'px-4 h-9 py-1 rounded text-white bg-opacity-90 bg-gray-300 cursor-not-allowed',
        className
      )}
    >
      <LoadingSpinner size="xxs" />
    </div>
  ) : (
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
}

export default Button
