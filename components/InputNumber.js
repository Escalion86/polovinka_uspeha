import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'
import { forwardRef, useEffect, useState } from 'react'
import InputWrapper from './InputWrapper'
import useLongPress from '@helpers/useLongPress'

const InputNumber = forwardRef(
  (
    {
      label,
      onChange,
      value,
      className,
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
      placeholderOnDisabled = false, // on value === null
    },
    ref
  ) => {
    const [stateValue, setStateValue] = useState(value)
    const [isMounted, setIsMounted] = useState(false)

    const longPressArrowDownEvent = useLongPress(
      () => {
        var newNumber
        setStateValue((state) => {
          if (state === undefined) return state
          newNumber = parseInt(
            typeof min !== 'number'
              ? Number(state) - Number(step)
              : Math.max(Number(state) - Number(step), min)
          )
          // onChange(newNumber)
          // console.log(newNumber)
          return newNumber
        })
        // console.log('newNumber', newNumber)
        // if (newNumber !== undefined) onChange(newNumber)
      }
      // () => onChange(stateValue)
    )

    const longPressArrowUpEvent = useLongPress(
      () => {
        var newNumber
        setStateValue((state) => {
          if (state === undefined) return state
          newNumber = parseInt(
            typeof max !== 'number'
              ? Number(state) + Number(step)
              : Math.min(Number(state) + Number(step), max)
          )
          // onChange(newNumber)
          return newNumber
        })
        // console.log(newNumber)
        // if (newNumber !== undefined) onChange(newNumber)
      }
      // () => {
      //   onChange(stateValue)
      // }
    )

    useEffect(() => {
      if (!stateValue && stateValue != 0) {
        const minValue = parseInt(min > 0 ? min : 0)
        setStateValue(minValue)
        onChange(minValue)
      } else if (isMounted && stateValue !== undefined) onChange(stateValue)
    }, [stateValue])

    useEffect(() => {
      setIsMounted(true)
    }, [])

    const showPlaceholder =
      disabled && ['string', 'number'].includes(typeof placeholderOnDisabled)

    return (
      <InputWrapper
        label={label}
        labelClassName={labelClassName}
        value={stateValue}
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
        {showArrows && !disabled && (
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
          // type="number"
          step={step}
          type={showPlaceholder ? 'text' : 'number'}
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
            showPlaceholder
              ? placeholderOnDisabled
              : stateValue === null
                ? ''
                : typeof stateValue === 'number'
                  ? String(stateValue)
                  : stateValue
          }
          defaultValue={defaultValue}
          onChange={(e) => {
            const { value } = e.target
            if (
              (typeof min !== 'number' || value >= min) &&
              (typeof max !== 'number' || value <= max)
            ) {
              if (stateValue === '') {
                onChange(0)
                setStateValue(0)
              } else {
                const newValue = parseInt(value)
                setStateValue(newValue)
                onChange(newValue)
              }
            } else if (typeof min === 'number' && value < min) {
              setStateValue(min)
              onChange(min)
            } else if (typeof max === 'number' && value > max) {
              setStateValue(max)
              onChange(max)
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
        {showArrows && !disabled && (
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

InputNumber.displayName = 'InputNumber'

export default InputNumber
