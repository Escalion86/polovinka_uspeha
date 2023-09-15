import cn from 'classnames'
import InputWrapper from './InputWrapper'

const TimePicker = ({
  label = '',
  name,
  value,
  onChange,
  required = false,
  labelClassName,
  className,
  // className,
  disabled = false,
  // inLine = false,
  fullWidth,
  defaultValue,
  error,
}) => {
  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      onChange={onChange}
      copyPasteButtons={false}
      value={value}
      className={cn(fullWidth ? '' : 'w-48', className)}
      required={required}
      fullWidth={fullWidth}
      paddingY="small"
      disabled={disabled}
      error={error}
    >
      <input
        className={cn('text-input max-w-40 outline-none', {
          'text-disabled': disabled,
        })}
        type="time"
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => onChange(e.target.value)}
      />
    </InputWrapper>
  )
}

export default TimePicker
