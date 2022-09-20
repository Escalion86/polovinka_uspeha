import cn from 'classnames'
import InputWrapper from './InputWrapper'
import MaskedInput from 'react-text-mask'

const PhoneInput = ({
  value,
  label,
  onChange,
  required = false,
  disabled,
  labelClassName,
  copyPasteButtons,
}) => {
  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      onChange={onChange}
      copyPasteButtons={copyPasteButtons}
      copyButton={copyPasteButtons}
      pasteButton={!disabled && copyPasteButtons}
      value={value}
      required={required}
    >
      {/* <>
      <label
        className="flex items-center justify-end leading-4 "
        htmlFor={name}
      >
        {label}
        {required && <span className="text-red-700">*</span>}
      </label> */}
      <MaskedInput
        disabled={disabled}
        className={cn(
          'text-input w-36 px-1 border rounded outline-none focus:shadow-active',
          required && (!value || value.toString().length !== 11)
            ? 'border-red-700'
            : 'border-gray-400',
          { 'bg-gray-300  text-disabled': disabled }
        )}
        showMask
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9]/g, '')

          onChange(value === '7' ? null : Number(value))
        }}
        // keepCharPositions
        mask={[
          '+',
          '7',
          ' ',
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
      {/* <InputMask
        className={cn(
          'text-input w-36 px-1 border rounded outline-none focus:shadow-active',
          required && (!value || value.toString().length !== 11)
            ? 'border-red-700'
            : 'border-gray-400',
          { 'bg-gray-300  text-disabled': disabled }
        )}
        // name={name}
        mask="+7 999-999-9999"
        maskChar="_"
        // maskChar={null}
        alwaysShowMask
        value={value || ''}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9]/g, '')
          onChange(value === '7' ? null : Number(value))
        }}
      /> */}
    </InputWrapper>
  )
}

export default PhoneInput
