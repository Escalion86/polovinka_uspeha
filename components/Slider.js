import isObject from '@helpers/isObject'
import FormControl from '@mui/material/FormControl'
import NativeSelect from '@mui/material/NativeSelect'
import SliderMui from '@mui/material/Slider'
import cn from 'classnames'
import InputWrapper from './InputWrapper'

const toFiniteNumber = (value, fallback) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

const normalizeRange = (min, max) => {
  const preparedMin = Math.trunc(toFiniteNumber(min, 0))
  const preparedMax = Math.trunc(toFiniteNumber(max, preparedMin))
  if (preparedMax < preparedMin) {
    return { min: preparedMin, max: preparedMin }
  }
  return { min: preparedMin, max: preparedMax }
}

const normalizeValue = (value, min, max) => {
  if (isObject(value)) {
    const leftRaw = Array.isArray(value) ? value[0] : min
    const rightRaw = Array.isArray(value) ? value[1] : max
    let left = Math.trunc(toFiniteNumber(leftRaw, min))
    let right = Math.trunc(toFiniteNumber(rightRaw, max))
    if (left < min) left = min
    if (right > max) right = max
    if (left > right) left = right
    return [left, right]
  }

  let nextValue = Math.trunc(toFiniteNumber(value, min))
  if (nextValue < min) nextValue = min
  if (nextValue > max) nextValue = max
  return nextValue
}

const Options = ({ min, max }) => {
  const rangeLength = Math.max(0, max - min + 1)
  const array = new Array(rangeLength).fill(0)

  return array.map((item, index) => {
    const value = index + min
    return (
      <option key={value} value={value}>
        {value}
      </option>
    )
  })
}

const Select = ({ value, onChange, left, min, max, className }) => (
  <FormControl className={cn('w-20', className)}>
    <NativeSelect
      value={isObject(value) ? value[left ? 0 : 1] : value}
      inputProps={{
        name: 'age',
        id: 'uncontrolled-native',
      }}
      onChange={(e) => {
        const newValue = Number(e.target.value)
        let leftValue = left ? newValue : value[0]
        let rightValue = left ? value[1] : newValue
        if (left) {
          if (newValue > rightValue) rightValue = newValue
        } else {
          if (newValue < leftValue) leftValue = newValue
        }
        onChange(isObject(value) ? [leftValue, rightValue] : newValue)
      }}
    >
      <Options min={min} max={max} />
    </NativeSelect>
  </FormControl>
)

const Slider = ({
  label,
  onChange,
  value,
  labelClassName,
  wrapperClassName,
  min = 0,
  max = 100,
  required,
  noInputs = false,
  paddingY = true,
  noMargin = false,
  smallMargin = false,
}) => {
  const normalizedRange = normalizeRange(min, max)
  const normalizedValue = normalizeValue(
    value,
    normalizedRange.min,
    normalizedRange.max
  )

  return (
  <InputWrapper
    label={label}
    labelClassName={labelClassName}
    value={value}
    className={cn('flex-1', wrapperClassName)}
    required={required}
    paddingY={paddingY}
    noMargin={noMargin}
    smallMargin={smallMargin}
  >
    <div className="flex flex-1 w-max min-w-40 gap-x-4">
      {!noInputs && (
        <Select
          value={normalizedValue}
          onChange={onChange}
          left
          min={normalizedRange.min}
          max={normalizedRange.max}
          className="min-w-14"
        />
      )}
      <SliderMui
        value={normalizedValue}
        onChange={(e, value) => onChange && onChange(value)}
        min={normalizedRange.min}
        max={normalizedRange.max}
      />
      {!noInputs && (
        <Select
          value={normalizedValue}
          onChange={onChange}
          min={normalizedRange.min}
          max={normalizedRange.max}
          className="min-w-14"
        />
      )}
    </div>
  </InputWrapper>
  )
}

export default Slider
