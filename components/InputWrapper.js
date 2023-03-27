import cn from 'classnames'
import { faCopy } from '@fortawesome/free-regular-svg-icons'
import { faBan, faClose, faPaste } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tooltip from '@components/Tooltip'
import Label from './Label'
import copyToClipboard from '@helpers/copyToClipboard'
import pasteFromClipboard from '@helpers/pasteFromClipboard'
import useSnackbar from '@helpers/useSnackbar'
import { forwardRef } from 'react'

const SmallIconButton = ({ onClick, icon, tooltip, disabled }) => {
  return (
    <Tooltip title={tooltip}>
      <div className="relative" onClick={disabled ? null : onClick}>
        <div
          className={cn(
            'flex items-center justify-center p-1 border border-gray-400 rounded group',
            disabled
              ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
              : 'text-general bg-gray-100 cursor-pointer'
          )}
        >
          <FontAwesomeIcon
            className={cn(
              'w-4 h-4 duration-200',
              disabled ? '' : 'group-hover:scale-125'
            )}
            icon={icon}
            size="1x"
          />
        </div>
      </div>
    </Tooltip>
  )
}

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
      onChange,
      copyPasteButtons,
      copyButton = true,
      pasteButton = true,
      labelPos,
      labelContentWidth,
      wrapperClassName,
      hidden = false,
      fullWidth = true,
      noBorder = false,
      disabled = false,
      noMargin = false,
      centerLabel = false,
    },
    ref
  ) => {
    // const { info } = useSnackbar()
    return (
      <div
        className={cn(
          'relative flex items-center',
          paddingX === 'small' ? 'px-1' : paddingX ? 'px-2' : '',
          noMargin ? '' : 'mt-3 mb-1',
          noBorder
            ? ''
            : `border-2 rounded focus-within:border-general hover:border-general [&:not(:focus-within)]:hover:border-opacity-50 ${
                error ? 'border-danger' : 'border-gray-300'
              }`,
          fullWidth ? 'w-full' : '',
          paddingY === 'small'
            ? 'pt-1 pb-0.5'
            : paddingY === 'big'
            ? 'pt-2.5 pb-2'
            : paddingY
            ? 'pt-2 pb-1.5'
            : '',
          disabled ? 'cursor-not-allowed' : '',
          hidden ? 'hidden' : '',
          className
        )}
        ref={ref}
      >
        <div
          className={cn(
            'relative flex w-full',
            wrapperClassName,
            disabled ? 'cursor-not-allowed' : ''
          )}
        >
          {prefix && (
            <div
              className={cn(
                'text-gray-400 pl-1 flex items-center',
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
                'text-gray-400 pr-1 flex items-center',
                postfixClassName
              )}
            >
              {postfix}
              {disabled && (
                <FontAwesomeIcon
                  className="w-4 h-4 text-gray-400"
                  icon={faBan}
                  size="1x"
                />
              )}
            </div>
          )}
          <label
            // for="exampleFormControlInput1"
            className={cn(
              'pointer-events-none absolute rounded px-1 text-sm peer-focus:text-general transition-all bg-white text-general',
              centerLabel
                ? 'left-1/2 -translate-x-1/2'
                : paddingX === 'small'
                ? 'left-1'
                : paddingX
                ? 'left-0'
                : 'left-2',
              paddingY === 'small'
                ? '-top-4'
                : paddingY === 'big'
                ? '-top-6'
                : paddingY
                ? '-top-5'
                : '-top-3',
              floatingLabel
                ? `${
                    paddingY === 'small'
                      ? '-top-4 peer-focus:-top-4'
                      : paddingY === 'big'
                      ? '-top-6 peer-focus:-top-6'
                      : paddingY
                      ? '-top-5 peer-focus:-top-5'
                      : '-top-3 peer-focus:-top-3'
                  } text-general peer-focus:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-0.5`
                : '',
              // error
              //   ? 'peer-placeholder-shown:text-danger'
              //   : 'peer-placeholder-shown:text-gray-400',
              disabled ? 'cursor-not-allowed' : '',
              labelClassName
            )}
          >
            {label}
          </label>
        </div>
        {required && (
          <div
            className={cn(
              'absolute px-1 text-xs bg-white right-1 -top-2.5',
              error
                ? // ||
                  //   value === undefined ||
                  //   value === null ||
                  //   (typeof value === 'object' && value.length === 0)
                  'text-danger'
                : 'text-gray-400'
            )}
          >
            Обязательное
          </div>
        )}
        {error && showErrorText && (
          <div
            className={cn(
              'absolute px-1 text-xs bg-white left-1 top-7 text-danger'
            )}
          >
            {error}
          </div>
        )}
      </div>
    )
  }
)

export default InputWrapper
