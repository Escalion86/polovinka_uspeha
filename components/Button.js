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
      ...props
    },
    ref
  ) => {
    return loading ? (
      <div
        {...props}
        ref={ref}
        className={cn(
          'px-4 text-white bg-gray-300/90 cursor-not-allowed',
          big ? 'text-xl py-2' : thin ? 'h-8 py-0.5' : 'h-9 py-1',
          rounded ? (big ? 'rounded-lg' : 'rounded-sm') : '',
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

export default Button
