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
      classOutlineColor = 'border-general',
      classTextColor = 'text-white',
      classOutlineTextColor = 'text-general',
      classHoverOutlineColor = 'hover:border-green-600',
      classHoverOutlineTextColor = 'hover:text-green-600',
      loading = false,
      stopPropagation,
      preventDefault,
      thin = false,
      big = false,
      icon,
      collapsing,
      rounded = true,
      iconRight = false,
      outline = false,
      loadingText,
      ...props
    },
    ref
  ) => {
    return loading ? (
      <button
        {...props}
        ref={ref}
        className={cn(
          'relative px-4 bg-gray-300/90 cursor-not-allowed',
          'flex gap-x-2 justify-center items-center whitespace-nowrap duration-300 text-transparent font-normal prevent-select-text overflow-hidden',
          big ? 'text-xl py-2' : thin ? 'h-8 py-0.5' : 'h-9 py-1',
          rounded ? (big ? 'rounded-lg' : 'rounded-sm') : '',
          className
        )}
        onClick={undefined}
      >
        {icon && (
          <FontAwesomeIcon icon={icon} className="w-5 h-5 min-w-5 min-h-5" />
        )}
        {name}
        <div className="absolute flex items-center justify-center w-full px-2 -translate-x-1/2 -translate-y-1/2 gap-x-1 top-1/2 left-1/2">
          <LoadingSpinner size="xxs" />
          {loadingText && (
            <div className="flex-1 text-gray-600/80">{loadingText}</div>
          )}
        </div>
      </button>
    ) : (
      <button
        {...props}
        ref={ref}
        onClick={
          onClick && !disabled
            ? (e) => {
                stopPropagation && e.stopPropagation()
                preventDefault && e.preventDefault()
                onClick()
              }
            : undefined
        }
        className={cn(
          'flex gap-x-2 justify-center items-center whitespace-nowrap duration-300 text-base font-normal prevent-select-text overflow-hidden',

          rounded ? (big ? 'rounded-lg' : 'rounded-sm') : '',
          iconRight ? 'flex-row-reverse' : '',
          big ? 'text-xl py-2' : thin ? 'h-8 py-0.5' : 'h-9 py-1',
          className,
          disabled
            ? 'bg-gray-300 text-white cursor-not-allowed'
            : outline
              ? cn(
                  'bg-white border cursor-pointer',
                  classOutlineColor,
                  classOutlineTextColor,
                  classHoverOutlineColor,
                  classHoverOutlineTextColor
                )
              : cn(
                  'cursor-pointer',
                  classTextColor,
                  classHoverBgColor,
                  classBgColor
                ),
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

Button.displayName = 'Button'

export default Button
