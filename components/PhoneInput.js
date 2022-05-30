import InputMask from 'node_modules/react-input-mask'
import cn from 'classnames'
import InputWrapper from './InputWrapper'

const PhoneInput = ({
  value,
  label,
  name,
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
      value={value}
    >
      {/* <>
      <label
        className="flex items-center justify-end leading-4 "
        htmlFor={name}
      >
        {label}
        {required && <span className="text-red-700">*</span>}
      </label> */}

      <InputMask
        className={cn(
          'text-input w-36 px-1 border rounded outline-none focus:shadow-active',
          required && (!value || value.toString().length !== 11)
            ? 'border-red-700'
            : 'border-gray-400',
          { 'bg-gray-300  text-disabled': disabled }
        )}
        name={name}
        mask="+7 999-999-9999"
        maskChar="_"
        alwaysShowMask
        value={value || ''}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9]/g, '')
          onChange(value === '7' ? null : Number(value))
        }}
      />
    </InputWrapper>
  )
}

export default PhoneInput
