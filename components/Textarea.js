import cn from 'classnames'
import InputWrapper from './InputWrapper'

const Textarea = ({
  label,
  onChange,
  value,
  inputClassName,
  labelClassName,
  wrapperClassName,
  error = false,
  rows = 3,
  required,
  defaultValue,
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
      error={error}
    >
      <textarea
        className={cn(
          'px-1 outline-none flex-1',
          // error ? 'border-red-500' : 'border-gray-400',
          inputClassName
        )}
        rows={rows}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => onChange(e.target.value)}
      />
    </InputWrapper>
  )
}

export default Textarea
