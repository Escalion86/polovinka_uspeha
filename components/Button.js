import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
  icon,
  collapsing,
  rounded = true,
  ...props
}) => {
  return loading ? (
    <div
      className={cn(
        'px-4 rounded text-white bg-opacity-90 bg-gray-300 cursor-not-allowed',
        thin ? 'h-8 py-0.5' : 'h-9 py-1',
        rounded ? 'rounded' : '',
        className
      )}
    >
      <LoadingSpinner size="xxs" />
    </div>
  ) : (
    <button
      {...props}
      onClick={(e) => {
        stopPropagation && e.stopPropagation()
        onClick && !disabled && onClick()
      }}
      className={cn(
        'flex gap-x-2 justify-start items-center whitespace-nowrap duration-300 text-white text-base font-normal bg-opacity-90 prevent-select-text overflow-hidden',
        rounded ? 'rounded' : '',
        thin ? 'h-8 py-0.5' : 'h-9 py-1',
        className,
        disabled
          ? 'bg-gray-300 text-white cursor-not-allowed'
          : cn(classHoverBgColor, classBgColor),
        collapsing ? 'px-2' : 'min-w-max px-3'
      )}
    >
      {icon && (
        <FontAwesomeIcon icon={icon} className="w-5 h-5 min-w-5 min-h-5" />
      )}
      {name}
    </button>
  )
}

export default Button
