import cn from 'classnames'
import InputWrapper from './InputWrapper'

const TimePicker = ({
  label = '',
  name,
  value,
  onChange,
  required = false,
  labelClassName,
  wrapperClassName,
  // className,
  disabled = false,
  // inLine = false,
}) => {
  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      onChange={onChange}
      copyPasteButtons={false}
      value={value}
      className={wrapperClassName}
      required={required}
    >
      <input
        className={cn(
          'text-input px-1 border max-w-40 rounded outline-none focus:shadow-active',
          { 'bg-gray-200  text-disabled': disabled }
        )}
        type="time"
        name={name}
        defaultValue={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </InputWrapper>
  )
}

export default TimePicker
