import InputWrapper from '@components/InputWrapper'
import Label from '@components/Label'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'

export const ValueItem = ({
  active = false,
  value = 0,
  name = '',
  color = 'gray',
  icon = null,
  onClick = null,
}) => (
  <button
    className={cn(
      `h-[30px] flex min-w-22 duration-300 outline-none items-center justify-center border px-2 py-0.5 rounded cursor-pointer gap-x-2 flex-nowrap border-${color}`,
      active ? `text-white bg-${color}` : `text-${color} bg-white`
    )}
    onClick={() => onClick && onClick(value)}
  >
    {icon && <FontAwesomeIcon icon={icon} className="h-5" />}
    <div
      className={cn(
        'whitespace-nowrap duration-300 select-none',
        active ? 'text-white' : `text-input`
      )}
    >
      {name}
    </div>
  </button>
)

const ValuePicker = ({
  value = null,
  valuesArray = [],
  label = null,
  onChange = null,
  name = 'prop',
  required = false,
  disselectOnSameClick = false,
  error = false,
  labelClassName,
  className,
}) => {
  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      onChange={onChange}
      value={value}
      className={cn('flex-1', className)}
      required={required}
    >
      {/* {label && (
        <label
          className="flex items-center justify-end text-right"
          htmlFor={name}
        >
          {label}
          {required && <span className="text-red-700">*</span>}
        </label>
      )} */}
      {/* <Label text={label} className={labelClassName} required={required} /> */}
      <div
        className={cn(
          'relative flex flex-wrap items-center gap-x-2 gap-y-1 max-w-fit'
          // error ? 'border border-red-500 rounded -m-0.5 p-0.5' : ''
        )}
      >
        {error && (
          <div className="top-0 bottom-0 right-0 left-0 absolute -m-0.5 border border-red-500 rounded" />
        )}
        {valuesArray.map((item) => (
          <ValueItem
            key={name + item.value}
            active={item.value === value}
            value={item.value}
            name={item.name}
            icon={item.icon}
            color={item.color}
            onClick={() =>
              item.value === value
                ? disselectOnSameClick && onChange(null)
                : onChange(item.value)
            }
          />
        ))}
      </div>
    </InputWrapper>
  )
}

export default ValuePicker
