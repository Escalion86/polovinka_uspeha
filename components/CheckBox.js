import cn from 'classnames'

const CheckBox = ({
  checked = false,
  onClick = null,
  onChange = null,
  small = false,
  big = false,
  label = null,
  labelClassName,
  readOnly = false,
  hidden = false,
  wrapperClassName,
  error,
  type = 'checkbox',
  noMargin,
  disabled,
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
        <input
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
          aria-label="CheckBox"
        />
        <div
          // for="exampleFormControlInput1"
          className={cn('leading-[0.875rem]', labelClassName)}
        >
          {label}
        </div>
      </div>
    )
  )
}

export default CheckBox
