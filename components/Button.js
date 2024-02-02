import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'
import { forwardRef } from 'react'
import LoadingSpinner from './LoadingSpinner'

const Button = forwardRef(
  (
    {
      name = '',
      onClick,
      className,
      disabled = false,
      classBgColor = 'bg-general',
      classHoverBgColor = 'hover:bg-green-600',
      loading = false,
      stopPropagation,
      thin = false,
      big = false,
      icon,
      collapsing,
      rounded = true,
      iconRight = false,
      ...props
    },
    ref
  ) => {
    return loading ? (
      <div
        {...props}
        ref={ref}
        className={cn(
          'px-4 text-white bg-opacity-90 bg-gray-300 cursor-not-allowed',
          big ? 'text-xl py-2' : thin ? 'h-8 py-0.5' : 'h-9 py-1',
          rounded ? (big ? 'rounded-lg' : 'rounded') : '',
          className
        )}
        onClick={onClick}
      >
        <LoadingSpinner size="xxs" />
      </div>
    ) : (
      <button
        {...props}
        ref={ref}
        onClick={
          onClick && !disabled
            ? (e) => {
                stopPropagation && e.stopPropagation()
                onClick()
              }
            : undefined
        }
        className={cn(
          'flex gap-x-2 justify-center items-center whitespace-nowrap duration-300 text-white text-base font-normal bg-opacity-90 prevent-select-text overflow-hidden',
          rounded ? (big ? 'rounded-lg' : 'rounded') : '',
          iconRight ? 'flex-row-reverse' : '',
          big ? 'text-xl py-2' : thin ? 'h-8 py-0.5' : 'h-9 py-1',
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
)

export default Button
