import cn from 'classnames'
import InputWrapper from './InputWrapper'

const ComboBox = ({
  label,
  defaultValue,
  onChange,
  placeholder,
  items,
  disabled = false,
  labelClassName,
  selectClassName,
  wrapperClassName,
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
    >
      <select
        className={cn(
          'flex-1 px-1 rounded border cursor-pointer outline-none',
          disabled ? 'bg-gray-200' : 'bg-white border-gray-400',
          selectClassName
        )}
        onChange={(e) => !disabled && onChange && onChange(e.target.value)}
        defaultValue={defaultItem ? defaultValue : ''}
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
