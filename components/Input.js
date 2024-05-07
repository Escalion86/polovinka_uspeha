import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp'
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
      showArrows = true,
      autoComplete,
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
        {showArrows && type === 'number' && !disabled && (
          <div
            className={cn(
              'p-1 duration-300',
              typeof min === 'number' && value <= min
                ? 'text-disabled cursor-not-allowed'
                : 'cursor-pointer text-general hover:text-success'
            )}
            onClick={() => {
              if (typeof min !== 'number')
                onChange(Number(value) - Number(step))
              else onChange(Math.max(Number(value) - Number(step), min))
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
            if (type === 'number') {
              if (
                (typeof min !== 'number' || value >= min) &&
                (typeof max !== 'number' || value <= max)
              ) {
                if (value === '') onChange(0)
                else onChange(parseInt(value))
              } else if (typeof min === 'number' && value < min) onChange(min)
              else if (typeof max === 'number' && value > max) onChange(max)
            } else {
              if (maxLength && value?.length > maxLength)
                onChange(value.substring(0, maxLength))
              else onChange(value)
            }
          }}
          placeholder={label}
          autoComplete={autoComplete}
          list={dataList?.name}
        />
        {dataList?.list && (
          <datalist id={dataList?.name}>
            {dataList.list.map((item) => (
              <option key={'list' + item}>{item}</option>
            ))}
          </datalist>
        )}
        {showArrows && type === 'number' && !disabled && (
          <div
            className={cn(
              'p-1 duration-300',
              typeof max === 'number' && value >= max
                ? 'text-disabled cursor-not-allowed'
                : 'cursor-pointer text-general hover:text-success'
            )}
            onClick={() => {
              if (typeof max !== 'number')
                onChange(Number(value) + Number(step))
              else onChange(Math.min(Number(value) + Number(step), max))
            }}
          >
            <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
          </div>
        )}
      </InputWrapper>
    )
  }
)

export default Input
