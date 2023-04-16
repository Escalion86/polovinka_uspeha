import cn from 'classnames'
import InputWrapper from './InputWrapper'
import MaskedInput from 'react-text-mask'
import { forwardRef } from 'react'

// const NumericFormatCustom = forwardRef(function NumericFormatCustom(
//   props,
//   ref
// ) {
//   const { onChange, disabled, value, required, ...other } = props

//   return (
//     // <NumericFormat
//     //   {...other}
//     //   getInputRef={ref}
//     //   onValueChange={(values) => {
//     //     onChange({
//     //       target: {
//     //         name: props.name,
//     //         value: values.value,
//     //       },
//     //     });
//     //   }}
//     //   thousandSeparator
//     //   valueIsNumericString
//     //   prefix="$"
//     // />
//     <MaskedInput
//       {...other}
//       getInputRef={ref}
//       disabled={disabled}
//       // className={cn(
//       //   'text-input w-36 px-1 border rounded outline-none focus:shadow-active',
//       //   required && (!value || value.toString().length !== 11)
//       //     ? 'border-red-700'
//       //     : 'border-gray-400',
//       //   { 'bg-gray-300  text-disabled': disabled }
//       // )}
//       showMask
//       onChange={(e) => {
//         const value = e?.target?.value.replace(/[^0-9]/g, '')

//         onChange(value === '7' || value === '8' ? null : Number(value))
//       }}
//       // keepCharPositions
//       mask={[
//         '(',
//         /[1-9]/,
//         /\d/,
//         /\d/,
//         ')',
//         ' ',
//         /\d/,
//         /\d/,
//         /\d/,
//         '-',
//         /\d/,
//         /\d/,
//         /\d/,
//         /\d/,
//       ]}
//       value={
//         value
//           ? value.toString().substr(0, 1) == '7'
//             ? value.toString().substring(1)
//             : value.toString()
//           : ''
//       }
//     />
//   )
// })

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
}) => {
  // return (
  //   <TextField
  //     // sx={{ paddingX: 0 }}
  //     label={label}
  //     value={value}
  //     onChange={(e) => onChange(e.target.value)}
  //     size="small"
  //     InputProps={{
  //       startAdornment: (
  //         <InputAdornment sx={{ marginRight: 0.5 }} position="start">
  //           +7
  //         </InputAdornment>
  //       ),
  //       // inputComponent: NumericFormatCustom,
  //     }}
  //   />
  // )
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
      // prefix="+7"
      className={cn('w-48', className)}
      disabled={disabled}
      noMargin={noMargin}
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
          'text-input w-full px-1 focus:outline-none bg-transparent',
          required && (!value || value.toString().length !== 11)
            ? 'border-red-700'
            : 'border-gray-400',
          { 'text-disabled cursor-not-allowed': disabled }
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
