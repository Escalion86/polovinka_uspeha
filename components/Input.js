import cn from 'classnames'
import { forwardRef } from 'react'
import InputWrapper from './InputWrapper'

const Input = forwardRef(
  (
    {
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
      wrapperClassName,
      noBorder = false,
      placeholder,
      disabled = false,
      min,
      max,
      required,
      step,
      labelPos,
      onFocus,
      defaultValue,
    },
    ref
  ) => {
    return (
      <InputWrapper
        label={label}
        labelClassName={labelClassName}
        onChange={onChange}
        copyPasteButtons={copyPasteButtons}
        value={value}
        className={wrapperClassName}
        required={required}
        labelPos={labelPos}
      >
        <div
          className={cn(
            'flex rounded overflow-hidden bg-white',
            error ? 'border-red-500' : 'border-gray-400',
            inputClassName ? inputClassName : 'w-full',
            noBorder ? '' : 'border'
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
            ref={ref}
            step={step}
            className={cn(
              'outline-none px-1 flex-1 min-w-10',
              disabled
                ? 'cursor-not-allowed bg-gray-200 text-gray-200'
                : 'bg-transparent'
            )}
            type={type}
            value={defaultValue !== undefined ? undefined : value ?? ''}
            onChange={(e) => {
              const { value } = e.target
              if (type === 'number') {
                if (
                  (typeof min !== 'number' || value >= min) &&
                  (typeof max !== 'number' || value <= max)
                ) {
                  // onChange(Number(value))
                  onChange(String(parseInt(value)))
                }
              } else {
                onChange(value)
              }
            }}
            placeholder={placeholder}
            disabled={disabled}
            onFocus={onFocus}
            defaultValue={defaultValue}
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
)

export default Input
