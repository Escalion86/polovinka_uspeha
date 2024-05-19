import InputWrapper from '@components/InputWrapper'
import { useState } from 'react'
import ValueItem from './ValueItem'

const ValuePicker = ({
  value = null,
  valuesArray = [],
  label = null,
  onChange = null,
  name = 'prop',
  required = false,
  disselectOnSameClick = false,
  error = false,
  labelClassName,
  className,
  defaultValue,
  readOnly,
  disabledValues = [],
}) => {
  const [state, setState] = useState(defaultValue)
  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      value={value}
      className={className}
      required={required}
      paddingY
      fitWidth
    >
      <div className="relative flex flex-wrap items-center gap-x-2 gap-y-1 max-w-fit">
        {error && (
          <div className="z-0 top-0 bottom-0 right-0 left-0 absolute -m-0.5 border border-red-500 rounded" />
        )}
        {valuesArray.map((item) => (
          <ValueItem
            key={name + item.value}
            className="z-10"
            active={
              defaultValue !== undefined
                ? item.value === state
                : item.value === value
            }
            value={item.value}
            name={item.name}
            icon={item.icon}
            imageSrc={item.imageSrc}
            color={item.color}
            onClick={
              !readOnly && !disabledValues.includes(item.value)
                ? () => {
                    if (defaultValue !== undefined) {
                      if (item.value === state) {
                        if (disselectOnSameClick) {
                          onChange(null)
                          setState(null)
                        }
                      } else {
                        onChange(item.value)
                        setState(item.value)
                      }
                    } else {
                      item.value === value
                        ? disselectOnSameClick && onChange(null)
                        : onChange(item.value)
                    }
                  }
                : null
            }
          />
        ))}
      </div>
    </InputWrapper>
  )
}

export default ValuePicker
