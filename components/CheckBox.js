import cn from 'classnames'

const CheckBox = ({
  checked = false,
  onClick = null,
  onChange = null,
  small = false,
  big = false,
  label = null,
  labelPos = 'right',
  labelClassName,
  name,
  readOnly = false,
  hidden = false,
  wrapperClassName,
  error,
  type = 'checkbox',
  noMargin,
}) => {
  if (readOnly && !checked) return null

  return (
    // <InputWrapper
    //   labelPos={labelPos}
    //   label={label}
    //   labelClassName={labelClassName}
    //   wrapperClassName={wrapperClassName}
    //   hidden={hidden}
    // >
    (!readOnly || checked) && (
      // <div className="flex items-center">
      <div
        className={cn(
          'flex gap-x-1 pl-1 items-center',
          noMargin ? '' : 'my-2',
          hidden ? 'hidden' : '',
          wrapperClassName
        )}
      >
        <input
          readOnly
          checked={checked}
          type={type}
          className={cn(
            'duration-300 transition-all',
            type === 'checkbox' ? 'bg-check' : 'bg-radio',
            readOnly ? 'bg-gray-500' : 'checked:bg-general cursor-pointer',
            'bg-white border appearance-none from-blue-900 checked:border-transparent focus:outline-none',
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
          name={name}
        />
        <label
          // for="exampleFormControlInput1"
          className={cn('leading-[0.875rem]', labelClassName)}
        >
          {label}
        </label>
      </div>
      // </div>
    )
    // </InputWrapper>
  )
}

export default CheckBox
