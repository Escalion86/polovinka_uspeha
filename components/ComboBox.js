import cn from 'classnames'
import InputWrapper from './InputWrapper'

const ComboBox = ({
  label,
  defaultValue,
  value,
  onChange,
  placeholder,
  items,
  disabled = false,
  labelClassName,
  selectClassName,
  wrapperClassName,
  className,
  hidden,
}) => {
  const defaultItem = defaultValue
    ? items.find((item) => item.value === defaultValue)
    : null

  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      wrapperClassName={wrapperClassName}
      hidden={hidden}
      className={className}
      disabled={disabled}
      paddingX="small"
      paddingY="small"
    >
      <select
        className={cn(
          'flex-1 cursor-pointer outline-none bg-transparent p-1',
          selectClassName
        )}
        onChange={(e) => !disabled && onChange && onChange(e.target.value)}
        defaultValue={defaultItem ? defaultValue : ''}
        value={defaultValue ? undefined : value}
      >
        {placeholder && (
          <option disabled value="">
            {placeholder}
          </option>
        )}
        {items.map((item, index) => (
          <option className="cursor-pointer" key={item.name} value={item.value}>
            {item.name}
          </option>
        ))}
      </select>
    </InputWrapper>
  )
}

export default ComboBox
