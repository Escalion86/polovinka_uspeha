import cn from 'classnames'
import InputWrapper from './InputWrapper'

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
  copyPasteButtons = false,
}) => {
  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      onChange={onChange}
      copyPasteButtons={copyPasteButtons}
      value={value}
    >
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
    </InputWrapper>
  )
}

export default Input
