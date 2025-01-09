import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'
import { forwardRef, useState } from 'react'
import InputWrapper from './InputWrapper'
import useLongPress from '@helpers/useLongPress'

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
      maxLength,
      dataList,
    },
    ref
  ) => {
    const [stateValue, setStateValue] = useState(value)

    const longPressArrowDownEvent = useLongPress(
      () => {
        if (typeof min !== 'number')
          setStateValue((state) => {
            const newNumber = Number(state) - Number(step)
            return newNumber
          })
        else
          setStateValue((state) => {
            const newNumber = Math.max(Number(state) - Number(step), min)
            return newNumber
          })
      },
      () => {
        if (typeof min !== 'number')
          setStateValue((state) => {
            const newNumber = Number(state) - Number(step)
            return newNumber
          })
        else
          setStateValue((state) => {
            const newNumber = Math.max(Number(state) - Number(step), min)
            return newNumber
          })
      },
      () => onChange(stateValue),
      {
        shouldPreventDefault: true,
        repeatDelay: 50,
        delay: 500,
      }
    )

    const longPressArrowUpEvent = useLongPress(
      () => {
        if (typeof max !== 'number')
          setStateValue((state) => {
            const newNumber = Number(state) + Number(step)
            // onChange(newNumber)
            return newNumber
          })
        else
          setStateValue((state) => {
            const newNumber = Math.min(Number(state) + Number(step), max)
            // onChange(newNumber)
            return newNumber
          })
      },
      () => {
        if (typeof max !== 'number')
          setStateValue((state) => {
            const newNumber = Number(state) + Number(step)
            // onChange(newNumber)
            return newNumber
          })
        else
          setStateValue((state) => {
            const newNumber = Math.min(Number(state) + Number(step), max)
            // onChange(newNumber)
            return newNumber
          })
      },
      () => onChange(stateValue),
      {
        shouldPreventDefault: true,
        repeatDelay: 50,
        delay: 500,
      }
    )

    return (
      <InputWrapper
        label={label}
        labelClassName={labelClassName}
        value={stateValue ?? defaultValue}
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
          maxLength ? `${String(stateValue)?.length} / ${maxLength}` : undefined
        }
        commentClassName={
          maxLength && String(stateValue)?.length >= maxLength
            ? 'text-danger'
            : undefined
        }
      >
        {showArrows && type === 'number' && !disabled && (
          <div
            className={cn(
              'p-1 duration-300',
              typeof min === 'number' && stateValue <= min
                ? 'text-disabled cursor-not-allowed'
                : 'cursor-pointer text-general hover:text-success'
            )}
            // onClick={() => {
            //   if (typeof min !== 'number')
            //     onChange(Number(value) - Number(step))
            //   else onChange(Math.max(Number(value) - Number(step), min))
            // }}
            {...longPressArrowDownEvent}
          >
            <FontAwesomeIcon icon={faArrowDown} className="w-5 h-5" />
          </div>
        )}

        <input
          type={type}
          step={step}
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
            stateValue === null
              ? ''
              : typeof stateValue === 'number'
                ? String(stateValue)
                : stateValue
          }
          defaultValue={defaultValue}
          onChange={(e) => {
            const { stateValue } = e.target
            if (type === 'number') {
              if (
                (typeof min !== 'number' || stateValue >= min) &&
                (typeof max !== 'number' || stateValue <= max)
              ) {
                if (stateValue === '') onChange(0)
                else onChange(parseInt(stateValue))
              } else if (typeof min === 'number' && stateValue < min)
                onChange(min)
              else if (typeof max === 'number' && stateValue > max)
                onChange(max)
            } else {
              if (maxLength && stateValue?.length > maxLength)
                onChange(stateValue.substring(0, maxLength))
              else onChange(stateValue)
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
        {showArrows && type === 'number' && !disabled && (
          <div
            className={cn(
              'p-1 duration-300',
              typeof max === 'number' && stateValue >= max
                ? 'text-disabled cursor-not-allowed'
                : 'cursor-pointer text-general hover:text-success'
            )}
            // onClick={() => {
            //   if (typeof max !== 'number')
            //     onChange(Number(value) + Number(step))
            //   else onChange(Math.min(Number(value) + Number(step), max))
            // }}
            {...longPressArrowUpEvent}
          >
            <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
          </div>
        )}
      </InputWrapper>
    )
  }
)

Input.displayName = 'Input'

export default Input
