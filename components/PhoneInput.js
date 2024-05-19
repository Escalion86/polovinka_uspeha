import cn from 'classnames'
import MaskedInput from 'react-text-mask'
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
    <MaskedInput
      disabled={disabled}
      placeholder={label}
      className={cn(
        'w-full px-1 focus:outline-none bg-transparent peer placeholder-transparent',
        required && (!value || value.toString().length !== 11)
          ? 'border-red-700'
          : 'border-gray-400',
        disabled ? 'text-disabled cursor-not-allowed' : 'text-input '
      )}
      guide={false}
      // showMask={false}
      // onFocus={(e) => {
      //   setShowMask(true)
      // }}
      // onBlur={() => setShowMask(false)}
      onChange={(e) => {
        const value = e.target.value.replace(/[^0-9]/g, '')
        onChange(!value ? null : Number('7' + value))
        // onChange(Number('7' + value))
      }}
      // keepCharPositions
      mask={[
        // '+',
        // '7',
        // ' ',
        '(',
        /[1-9]/,
        /\d/,
        /\d/,
        ')',
        ' ',
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ]}
      value={
        value
          ? value.toString().substr(0, 1) == '7'
            ? value.toString().substring(1)
            : value.toString()
          : ''
      }
    />
  </InputWrapper>
)

export default PhoneInput
