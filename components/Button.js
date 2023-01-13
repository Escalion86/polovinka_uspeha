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
  stopPropagation,
  thin = false,
}) => {
  return loading ? (
    <div
      className={cn(
        'px-4 rounded text-white bg-opacity-90 bg-gray-300 cursor-not-allowed',
        thin ? 'h-8 py-0.5' : 'h-9 py-1',
        className
      )}
    >
      <LoadingSpinner size="xxs" />
    </div>
  ) : (
    <button
      onClick={(e) => {
        stopPropagation && e.stopPropagation()
        onClick && !disabled && onClick()
      }}
      className={cn(
        'duration-300 px-4 rounded text-white bg-opacity-90 min-w-max prevent-select-text',
        thin ? 'h-8 py-0.5' : 'h-9 py-1',
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
