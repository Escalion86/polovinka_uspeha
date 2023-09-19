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
  paddingX = true,
  paddingY = 'small',
  fullWidth,
  activePlaceholder,
  noMargin,
  smallMargin,
  error,
  required,
}) => {
  const defaultItem = defaultValue
    ? items.find((item) => item.value === defaultValue)
    : undefined

  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      wrapperClassName={wrapperClassName}
      hidden={hidden}
      className={className}
      disabled={disabled}
      paddingX={paddingX}
      paddingY={paddingY}
      fullWidth={fullWidth}
      noMargin={noMargin}
      smallMargin={smallMargin}
      error={error}
      required={required}
      value={value}
    >
      <select
        className={cn(
          'flex-1 cursor-pointer outline-none bg-transparent px-1',
          !value ? 'text-gray-400' : '',
          selectClassName
        )}
        onChange={(e) =>
          !disabled &&
          onChange &&
          onChange(e.target.value === '' ? null : e.target.value)
        }
        defaultValue={defaultItem ? defaultValue : undefined}
        value={defaultValue ? undefined : value ?? ''}
        style={{
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
        }}
      >
        {placeholder && (
          <option
            className="text-gray-400"
            disabled={!activePlaceholder}
            value=""
          >
            {placeholder}
          </option>
        )}
        {items.map((item, index) => (
          <option
            className="text-black cursor-pointer"
            key={item.name}
            value={item.value}
          >
            {item.name}
          </option>
        ))}
      </select>
    </InputWrapper>
  )
}

export default ComboBox
