import cn from 'classnames'
import { forwardRef, useEffect, useState } from 'react'
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
      postfix,
      noBorder = false,
      disabled = false,
      showDisabledIcon = true,
      min,
      max,
      required,
      step = 1,
      defaultValue,
      floatingLabel = true,
      showErrorText = false,
      fullWidth = false,
      paddingY = 'small',
      paddingX = true,
      noMargin = false,
      smallMargin = false,
      maxLength,
      dataList,
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
        smallMargin={smallMargin}
        showDisabledIcon={showDisabledIcon}
        comment={
          maxLength ? `${String(value)?.length} / ${maxLength}` : undefined
        }
        commentClassName={
          maxLength && String(value)?.length >= maxLength
            ? 'text-danger'
            : undefined
        }
      >
        <input
          type={type}
          step={type === 'number' ? step : undefined}
          className={cn(
            'flex-1 px-1 text-black placeholder-transparent h-7 peer bg-transparent',
            disabled ? 'text-disabled cursor-not-allowed' : '',
            inputClassName
          )}
          onWheel={(e) => e.target.blur()}
          min={min}
          max={max}
          disabled={disabled}
          value={
            value === null
              ? ''
              : typeof value === 'number'
                ? String(value)
                : value
          }
          defaultValue={defaultValue}
          onChange={(e) => {
            const { value } = e.target

            if (maxLength && value?.length > maxLength) {
              const newValue = value.substring(0, maxLength)
              onChange(newValue)
            } else {
              onChange(value)
            }
          }}
          placeholder={label}
          autoComplete="on"
          list={dataList?.name}
        />
        {dataList?.list && (
          <datalist id={dataList?.name}>
            {dataList.list.map((item) => (
              <option key={'list' + item}>{item}</option>
            ))}
          </datalist>
        )}
      </InputWrapper>
    )
  }
)

Input.displayName = 'Input'

export default Input
