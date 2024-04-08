import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'

const IconCheckBox = ({
  checked = false,
  onClick = null,
  small = false,
  big = false,
  label = null,
  labelClassName,
  readOnly = false,
  hidden = false,
  wrapperClassName,
  iconClassName,
  error,
  noMargin,
  disabled,
  checkedIcon = faCheck,
  uncheckedIcon,
  checkedIconColor = '#7a5151',
  uncheckedIconColor = '#9ca3af',
}) => {
  if (readOnly && !checked) return null

  return (
    (!readOnly || checked) && (
      <div
        className={cn(
          'flex gap-x-1.5 pl-1 items-center',
          noMargin ? '' : 'my-2',
          hidden ? 'hidden' : '',
          wrapperClassName
        )}
      >
        <FontAwesomeIcon
          className={cn(
            'duration-300',
            !readOnly && !disabled ? 'cursor-pointer' : '',
            big
              ? 'min-w-6 min-h-6 w-6 h-6'
              : small
                ? 'min-w-4 min-h-4 w-4 h-4'
                : 'min-w-5 min-h-5 w-5 h-5',
            iconClassName
          )}
          icon={checked || !uncheckedIcon ? checkedIcon : uncheckedIcon}
          color={
            disabled
              ? '#9ca3af'
              : checked
                ? checkedIconColor
                : uncheckedIconColor
          }
          onClick={!readOnly || disabled ? onClick : null}
        />
        {/* <input
          disabled={disabled}
          readOnly
          checked={checked}
          type={type}
          className={cn(
            'duration-300 transition-all',
            type === 'checkbox'
              ? checked
                ? 'bg-check'
                : ''
              : checked
              ? 'bg-radio'
              : '',
            disabled ? 'cursor-not-allowed bg-gray-400' : 'bg-white',
            readOnly
              ? 'bg-gray-500'
              : !disabled
              ? 'checked:bg-general cursor-pointer'
              : '',
            'border appearance-none from-blue-900 checked:border-transparent focus:outline-none',
            big
              ? 'min-w-6 min-h-6 w-6 h-6'
              : small
              ? 'min-w-4 min-h-4 w-4 h-4'
              : 'min-w-5 min-h-5 w-5 h-5',
            type === 'checkbox'
              ? big
                ? 'rounded-lg'
                : small
                ? 'rounded-sm'
                : 'rounded-md'
              : 'rounded-full',
            error ? 'border-danger' : ' border-gray-400'
          )}
          onClick={!readOnly ? onClick : null}
          onChange={!readOnly ? onChange : null}
        /> */}
        <div
          className={cn(
            'leading-[0.875rem]',
            error ? 'text-danger' : '',
            labelClassName
          )}
        >
          {label}
        </div>
      </div>
    )
  )
}

export default IconCheckBox
