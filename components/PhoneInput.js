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
  copyPasteButtons,
  className,
  noMargin,
  error,
}) => (
  <InputWrapper
    label={label}
    labelClassName={labelClassName}
    onChange={onChange}
    copyPasteButtons={copyPasteButtons}
    copyButton={copyPasteButtons}
    pasteButton={!disabled && copyPasteButtons}
    value={value}
    required={required}
    className={cn('w-48', className)}
    disabled={disabled}
    noMargin={noMargin}
    error={error}
  >
    <div>+7</div>
    <MaskedInput
      disabled={disabled}
      placeholder={label}
      className={cn(
        'text-input w-full px-1 focus:outline-none bg-transparent peer placeholder-transparent',
        required && (!value || value.toString().length !== 11)
          ? 'border-red-700'
          : 'border-gray-400',
        { 'text-disabled cursor-not-allowed': disabled }
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
