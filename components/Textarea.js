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
  rows = 6,
  required,
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
      <textarea
        className={cn(
          'px-1 border rounded outline-none flex-1',
          error ? 'border-red-500' : 'border-gray-400',
          inputClassName
        )}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </InputWrapper>
  )
}

export default Textarea
