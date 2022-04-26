import cn from 'classnames'

const Input = ({
  label,
  onChange,
  value,
  type = 'text',
  inputClassName,
  labelClassName,
  error = false,
  prefix,
  prefixClassName,
  postfix,
  postfixClassName,
}) => {
  return (
    <>
      <label
        className={cn(
          'flex items-center justify-end text-text leading-4 text-right',
          labelClassName
        )}
      >
        {label}
      </label>
      <div
        className={cn(
          'flex rounded overflow-hidden border bg-white',
          error ? 'border-red-500' : 'border-gray-400',
          inputClassName
        )}
      >
        {prefix && (
          <div
            className={cn(
              'px-1 bg-gray-200 border-r border-gray-400',
              prefixClassName
            )}
          >
            {prefix}
          </div>
        )}
        <input
          className={cn('outline-none px-1 flex-1 bg-transparent min-w-10')}
          type={type}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
        {postfix && (
          <div
            className={cn(
              'px-1 bg-gray-200 border-l border-gray-400',
              postfixClassName
            )}
          >
            {postfix}
          </div>
        )}
      </div>
    </>
  )
}

export default Input
