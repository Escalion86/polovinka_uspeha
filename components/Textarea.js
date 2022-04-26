import cn from 'classnames'

const Textarea = ({
  label,
  onChange,
  value,
  inputClassName,
  labelClassName,
  error = false,
  rows = 6,
}) => {
  return (
    <>
      <label
        className={cn('text-text whitespace-nowrap text-right', labelClassName)}
      >
        {label}
      </label>
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
    </>
  )
}

export default Textarea
