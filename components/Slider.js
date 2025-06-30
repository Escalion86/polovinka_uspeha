import isObject from '@helpers/isObject'
import FormControl from '@mui/material/FormControl'
import NativeSelect from '@mui/material/NativeSelect'
import SliderMui from '@mui/material/Slider'
import cn from 'classnames'
import InputWrapper from './InputWrapper'

const Options = ({ min, max }) => {
  const array = new Array(max - min + 1).fill(0)

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
}) => (
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
          value={value}
          onChange={onChange}
          left
          min={min}
          max={max}
          className="min-w-14"
        />
      )}
      <SliderMui
        value={value}
        onChange={(e, value) => onChange && onChange(value)}
        min={min}
        max={max}
      />
      {!noInputs && (
        <Select
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          className="min-w-14"
        />
      )}
    </div>
  </InputWrapper>
)

export default Slider
