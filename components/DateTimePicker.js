import formatDateTime from '@helpers/formatDateTime'
import cn from 'classnames'
import InputWrapper from './InputWrapper'

const DateTimePicker = ({
  label = '',
  name,
  value,
  onChange,
  required = false,
  labelClassName,
  // wrapperClassName,
  className,
  disabled = false,
  error = false,
  postfix,
  postfixClassName,
}) => {
  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      onChange={onChange}
      copyPasteButtons={false}
      value={value}
      className={cn('', className)}
      // paddingY={false}
      required={required}
      fullWidth={false}
      postfix={postfix}
      postfixClassName={postfixClassName}
      paddingY="small"
    >
      <input
        className={cn(
          'text-input px-1 focus:outline-none',
          // required && !value ? ' border-red-700' : ' border-gray-400',
          // error ? 'border-red-500' : 'border-gray-400',
          { 'bg-gray-200  text-disabled cursor-not-allowed': disabled }
        )}
        type="datetime-local"
        step="1800"
        name={name}
        value={formatDateTime(value, false, true, false)}
        onChange={(e) => {
          const value = e.target.value
          var year = value.substring(0, 4)
          var month = value.substring(5, 7)
          var day = value.substring(8, 10)
          var day = value.substring(8, 10)
          var hours = value.substring(11, 13)
          var minutes = value.substring(14, 16)

          onChange(new Date(year, month - 1, day, hours, minutes).toISOString())
        }}
        // pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
        min="2021-01-01T00:00"
        max="2030-12-31T00:00"
        disabled={disabled}
      />
    </InputWrapper>
  )
}

export default DateTimePicker
