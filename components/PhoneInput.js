import cn from 'classnames'
import { InputMask, format, unformat } from '@react-input/mask'
import InputWrapper from './InputWrapper'

const PhoneInput = ({
  value,
  label,
  onChange,
  required = false,
  disabled,
  labelClassName,
  className,
  noMargin,
  error,
  showErrorText,
}) => (
  <InputWrapper
    label={label}
    labelClassName={labelClassName}
    value={value}
    required={required}
    className={cn('w-48', className)}
    disabled={disabled}
    noMargin={noMargin}
    error={error}
    showErrorText={showErrorText}
    wrapperClassName={
      disabled ? 'text-disabled cursor-not-allowed' : 'text-input '
    }
  >
    <div>+7</div>
    <InputMask
      disabled={disabled}
      mask="(A__) ___-____"
      replacement={{ A: /[1-9]/, _: /\d/ }}
      showMask={false}
      onChange={(e) => {
        const rawValue = unformat(e.target.value, {
          mask: '(A__) ___-____',
          replacement: { A: /[1-9]/, _: /\d/ },
        })
        if (!rawValue) return onChange(null)
        const normalized =
          rawValue.length === 10
            ? `7${rawValue}`
            : rawValue.length === 11 && rawValue[0] === '8'
              ? `7${rawValue.slice(1)}`
              : rawValue
        onChange(Number(normalized))
      }}
      value={
        value
          ? format(
              value.toString().substr(0, 1) == '7'
                ? value.toString().substring(1)
                : value.toString(),
              { mask: '(A__) ___-____', replacement: { A: /[1-9]/, _: /\d/ } }
            )
          : ''
      }
      placeholder={label}
      className={cn(
        'w-full px-1 focus:outline-hidden bg-transparent peer placeholder-transparent',
        required && (!value || value.toString().length !== 11)
          ? 'border-red-700'
          : 'border-gray-400',
        disabled ? 'text-disabled cursor-not-allowed' : 'text-input '
      )}
    />
  </InputWrapper>
)

export default PhoneInput
