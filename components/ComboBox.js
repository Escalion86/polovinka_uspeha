import cn from 'classnames'

const ComboBox = ({
  title,
  defaultValue,
  onChange,
  placeholder,
  items,
  inLine = true,
  disabled = false,
  className,
  labelClassName,
  selectClassName,
}) => {
  const defaultItem = defaultValue
    ? items.find((item) => item.value === defaultValue)
    : null

  return (
    <div className={cn('flex gap-1', { 'flex-col': !inLine }, className)}>
      <label className={cn('text-text whitespace-nowrap', labelClassName)}>
        {title}
      </label>
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
          <option
            className="cursor-pointer"
            key={'combo' + index}
            value={item.value}
          >
            {item.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ComboBox
