import InputWrapper from '@components/InputWrapper'
import cn from 'classnames'
import ValueItem from './ValueItem'

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
          <div className="z-0 top-0 bottom-0 right-0 left-0 absolute -m-0.5 border border-red-500 rounded" />
        )}
        {valuesArray.map((item) => (
          <ValueItem
            key={name + item.value}
            className="z-10"
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
