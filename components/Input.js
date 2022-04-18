import cn from 'classnames'

const Input = ({
  label,
  className,
  onChange,
  value,
  type = 'text',
  inputClassName,
  labelClassName,
  inLine = true,
  error = false,
}) => {
  return (
    <div className={cn('flex gap-1', { 'flex-col': !inLine }, className)}>
      <label className={cn('text-text whitespace-nowrap', labelClassName)}>
        {label}
      </label>
      <input
        className={cn(
          'px-1 border rounded outline-none flex-1',
          error ? 'border-red-500' : 'border-gray-400',
          inputClassName
        )}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default Input
