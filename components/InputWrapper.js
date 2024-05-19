import { faAsterisk } from '@fortawesome/free-solid-svg-icons/faAsterisk'
import { faBan } from '@fortawesome/free-solid-svg-icons/faBan'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'
import { forwardRef } from 'react'

const InputWrapper = forwardRef(
  (
    {
      label,
      labelClassName,
      value,
      className,
      required,
      children,
      floatingLabel = true,
      error,
      showErrorText,
      paddingY = true,
      paddingX = true,
      postfix,
      postfixClassName,
      prefix,
      prefixClassName,
      wrapperClassName,
      hidden = false,
      fullWidth = false,
      fitWidth = false,
      noBorder = false,
      disabled = false,
      noMargin = false,
      centerLabel = false,
      showDisabledIcon = true,
      smallMargin = false,
      comment,
      commentClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          'relative flex items-stretch h-fit',
          paddingX === 'small' ? 'px-1' : paddingX ? 'px-2' : 'px-0',
          noMargin ? '' : smallMargin ? 'mt-3' : 'mt-3.5 mb-1',
          noBorder
            ? 'min-h-[36px] tablet:min-h-[40px]'
            : `min-h-[40px] tablet:min-h-[44px] border-2 rounded focus-within:border-general hover:border-general [&:not(:focus-within)]:hover:border-opacity-50 ${
                error ? 'border-danger' : 'border-gray-300'
              }`,
          fullWidth ? 'w-full' : '',
          fitWidth ? 'w-fit' : '',
          paddingY === 'small'
            ? 'pt-1.5 pb-1'
            : paddingY === 'big'
              ? 'pt-2.5 pb-2'
              : paddingY
                ? 'pt-2 pb-1.5'
                : '',
          disabled ? 'cursor-not-allowed' : '',
          hidden ? 'hidden' : '',
          (error && showErrorText) || comment ? 'mb-4' : '',
          className
        )}
        ref={ref}
        {...props}
      >
        <div
          className={cn(
            'flex items-center w-full min-h-[24px] tablet:min-h-[28px]',
            wrapperClassName,
            disabled ? 'cursor-not-allowed' : ''
          )}
        >
          {prefix && (
            <div
              className={cn(
                'text-disabled pl-1 flex items-center',
                prefixClassName
              )}
            >
              {prefix}
            </div>
          )}
          {children}
          {(postfix || disabled) && (
            <div
              className={cn(
                'text-disabled pr-1 flex items-center gap-x-1',
                postfixClassName
              )}
            >
              {postfix}
              {disabled && showDisabledIcon && (
                <FontAwesomeIcon
                  className="w-4 h-4 text-disabled"
                  icon={faBan}
                  size="1x"
                />
              )}
            </div>
          )}
          {label && (
            <div
              className={cn(
                'pointer-events-none select-none absolute rounded px-1 text-sm peer-focus:text-general peer-focus:leading-[12px] transition-all bg-white text-general',
                'h-5 leading-[12px] peer-placeholder-shown:leading-[14px]',
                'flex items-center',
                required
                  ? 'max-w-[calc(100%-16px)] peer-focus:max-w-[calc(100%-16px)] peer-placeholder-shown:max-w-full'
                  : '',
                centerLabel ? 'left-1/2 -translate-x-1/2' : 'left-2',
                floatingLabel
                  ? `-top-[12px] peer-focus:-top-[12px] peer-focus:text-sm peer-placeholder-shown:text-disabled peer-placeholder-shown:text-base peer-placeholder-shown:top-[calc(50%-10px)]`
                  : '-top-[12px]',
                disabled ? 'cursor-not-allowed' : '',
                labelClassName
              )}
            >
              {label}
            </div>
          )}
        </div>
        {required && (
          <div
            className={cn(
              'flex h-4 items-center absolute px-1 text-xs bg-white right-1 -top-[9px]',
              (value !== null &&
                typeof value === 'object' &&
                value.length > 0) ||
                (typeof value !== 'object' && (value || value === false))
                ? 'text-disabled'
                : 'text-danger'
            )}
          >
            <FontAwesomeIcon
              className={cn('w-2.5 h-2.5')}
              icon={faAsterisk}
              size="1x"
            />
          </div>
        )}
        {error && showErrorText && (
          <div
            className={cn(
              'absolute px-1 leading-[12px] text-xs bg-white left-1 -bottom-[15px] text-danger whitespace-nowrap'
            )}
          >
            {error}
          </div>
        )}
        {comment && (
          <div
            className={cn(
              'absolute px-1 leading-[12px] text-xs bg-white right-1 -bottom-[15px] whitespace-nowrap',
              commentClassName
            )}
          >
            {comment}
          </div>
        )}
      </div>
    )
  }
)

export default InputWrapper
