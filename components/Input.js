import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'
import { forwardRef } from 'react'
import InputWrapper from './InputWrapper'

const Input = forwardRef(
  (
    {
      label,
      onChange,
      value,
      className,
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
      showDisabledIcon = true,
      min,
      max,
      required,
      step = 1,
      labelPos,
      onFocus,
      defaultValue,
      floatingLabel = true,
      showErrorText = false,
      fullWidth = false,
      paddingY = 'small',
      paddingX = true,
      noMargin = false,
      showArrows = true,
      autoComplete,
    },
    ref
  ) => {
    return (
      <InputWrapper
        label={label}
        labelClassName={labelClassName}
        value={value ?? defaultValue}
        className={className}
        required={required}
        floatingLabel={floatingLabel}
        error={error}
        showErrorText={showErrorText}
        paddingY={paddingY}
        paddingX={paddingX}
        postfix={postfix}
        prefix={prefix}
        ref={ref}
        disabled={disabled}
        fullWidth={fullWidth}
        noBorder={noBorder}
        noMargin={noMargin}
        showDisabledIcon={showDisabledIcon}
      >
        {/* <div
        className={cn(
          'relative flex items-center w-full px-2 py-2 mt-1.5 border-2 rounded focus-within:border-general hover:border-general [&:not(:focus-within)]:hover:border-opacity-50',
          error ? 'border-danger' : 'border-gray-300',
          inputClassName
        )}
      >
        <div className="relative flex w-full"> */}
        {showArrows && type === 'number' && !disabled && (
          // typeof value === 'number' &&
          <div
            className={cn(
              'p-1 duration-300',
              typeof min === 'number' && value <= min
                ? 'text-disabled cursor-not-allowed'
                : 'cursor-pointer text-general hover:text-success'
            )}
            onClick={() => {
              if (typeof min !== 'number' || value > min)
                onChange(Number(value) - Number(step))
            }}
          >
            <FontAwesomeIcon icon={faArrowDown} className="w-5 h-5" />
          </div>
        )}

        <input
          type={type}
          step={step}
          className={cn(
            'flex-1 px-1 text-black placeholder-transparent h-7 peer focus:outline-none bg-transparent',
            disabled ? 'text-disabled cursor-not-allowed' : '',
            // type === 'number' ? 'max-w-20' : '',
            inputClassName
          )}
          onWheel={(e) => e.target.blur()}
          min={min}
          max={max}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={(e) => {
            const { value } = e.target
            if (type === 'number') {
              if (
                (typeof min !== 'number' || value >= min) &&
                (typeof max !== 'number' || value <= max)
              ) {
                if (value === '') onChange(parseInt(value))
                else onChange(parseInt(value))
              }
            } else {
              onChange(value)
            }
          }}
          // id="exampleFormControlInput1"
          placeholder={label}
          autoComplete={autoComplete}
        />
        {showArrows && type === 'number' && !disabled && (
          // typeof value === 'number' &&
          <div
            className={cn(
              'p-1 duration-300',
              typeof max === 'number' && value >= max
                ? 'text-disabled cursor-not-allowed'
                : 'cursor-pointer text-general hover:text-success'
            )}
            onClick={() => {
              if (typeof max !== 'number' || value < max)
                onChange(Number(value) + Number(step))
            }}
          >
            <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
          </div>
        )}
      </InputWrapper>
    )
    // return (
    //   <TextField
    //     sx={{ padding: 0, margin: 0 }}
    //     label={label}
    //     value={value}
    //     onChange={(e) => {
    //       onChange(e.target.value)
    //     }}
    //     size="small"
    //     InputProps={{
    //       startAdornment: prefix && (
    //         <InputAdornment sx={{ marginRight: 0.5 }} position="start">
    //           {prefix}
    //         </InputAdornment>
    //       ),
    //       endAdornment: postfix && (
    //         <InputAdornment sx={{ marginLeft: 0.5 }} position="end">
    //           {postfix}
    //         </InputAdornment>
    //       ),
    //     }}
    //   />
    // )
    // return (
    //   <InputWrapper
    //     label={label}
    //     labelClassName={labelClassName}
    //     onChange={onChange}
    //     copyPasteButtons={copyPasteButtons}
    //     value={value}
    //     className={wrapperClassName}
    //     required={required}
    //     labelPos={labelPos}
    //   >
    //     <div
    //       className={cn(
    //         'flex rounded overflow-hidden bg-white',
    //         error ? 'border-red-500' : 'border-gray-400',
    //         inputClassName ? inputClassName : 'w-full',
    //         noBorder ? '' : 'border'
    //       )}
    //     >
    //       {prefix && (
    //         <div
    //           className={cn(
    //             'px-1 bg-gray-200 border-r border-gray-400',
    //             prefixClassName
    //           )}
    //         >
    //           {prefix}
    //         </div>
    //       )}
    //       <input
    //         ref={ref}
    //         step={step}
    //         className={cn(
    //           'outline-none px-1 flex-1 min-w-10',
    //           disabled
    //             ? 'cursor-not-allowed bg-gray-100 text-disabled'
    //             : 'bg-transparent'
    //         )}
    //         type={type}
    //         value={defaultValue !== undefined ? undefined : value ?? ''}
    //         onChange={(e) => {
    //           const { value } = e.target
    //           if (type === 'number') {
    //             if (
    //               (typeof min !== 'number' || value >= min) &&
    //               (typeof max !== 'number' || value <= max)
    //             ) {
    //               // onChange(Number(value))
    //               onChange(String(parseInt(value)))
    //             }
    //           } else {
    //             onChange(value)
    //           }
    //         }}
    //         placeholder={placeholder}
    //         disabled={disabled}
    //         onFocus={onFocus}
    //         defaultValue={defaultValue}
    //       />
    //       {postfix && (
    //         <div
    //           className={cn(
    //             'px-1 bg-gray-200 border-l border-gray-400',
    //             postfixClassName
    //           )}
    //         >
    //           {postfix}
    //         </div>
    //       )}
    //     </div>
    //   </InputWrapper>
    // )
  }
)

export default Input
