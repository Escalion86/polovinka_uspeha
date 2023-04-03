import cn from 'classnames'
import { forwardRef } from 'react'
import InputWrapper from './InputWrapper'
// import * as te from 'tw-elements'

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
      step,
      labelPos,
      onFocus,
      defaultValue,
      floatingLabel = true,
      showErrorText = false,
      fullWidth = true,
      paddingY = 'small',
      paddingX = true,
      noMargin = false,
    },
    ref
  ) => {
    return (
      // <div class="flex justify-center">
      //   <div class="relative mb-3 xl:w-96" data-te-input-wrapper-init>
      //     <input
      //       type={type}
      //       class="peer block min-h-[auto] w-full rounded border-0 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
      //       id="exampleFormControlInput1"
      //       placeholder="Example label"
      //     />
      //     <label
      //       for="exampleFormControlInput1"
      //       class="pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-neutral-200"
      //     >
      //       {label}
      //     </label>
      //   </div>
      // </div>
      // <div className="relative mt-3">
      //   <input
      //     type={type}
      //     className="w-full h-8 text-black placeholder-transparent border-b-2 border-gray-300 peer focus:outline-none focus:border-general"
      //     // id="exampleFormControlInput1"
      //     placeholder={label}
      //   />
      //   <label
      //     // for="exampleFormControlInput1"
      //     className="absolute left-0 text-sm text-general bg-white transition-all peer-focus:-top-3.5 peer-focus:text-general peer-focus:text-sm -top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1"
      //   >
      //     {label}
      //   </label>
      // </div>
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

        <input
          type={type}
          step={step}
          className={cn(
            'flex-1 px-1 text-black placeholder-transparent h-7 peer focus:outline-none bg-transparent',
            disabled ? 'cursor-not-allowed' : '',
            inputClassName
          )}
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
                if (value === '') onChange(value)
                else onChange(String(parseInt(value)))
              }
            } else {
              onChange(value)
            }
          }}
          // id="exampleFormControlInput1"
          placeholder={label}
        />
        {/* <label
            // for="exampleFormControlInput1"
            className={cn(
              'absolute px-1 text-sm peer-focus:text-general transition-all bg-white left-0 text-general -top-3',
              floatingLabel
                ? 'text-general peer-focus:-top-3 peer-focus:text-sm peer-placeholder-shown:text-base peer-placeholder-shown:top-1'
                : '',
              error
                ? 'peer-placeholder-shown:text-danger'
                : 'peer-placeholder-shown:text-gray-400',
              labelClassName
            )}
          >
            {label}
          </label>
        </div>
        {required && (
          <div
            className={cn(
              'absolute px-1 text-xs bg-white right-1 -top-2.5',
              error || !value ? 'text-danger' : 'text-gray-400'
            )}
          >
            Обязательное
          </div>
        )}
        {error && showErrorText && (
          <div
            className={cn(
              'absolute px-1 text-xs bg-white left-1 top-7 text-danger'
            )}
          >
            {error}
          </div>
        )}
      </div> */}
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
