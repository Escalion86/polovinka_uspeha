import cn from 'classnames'
import InputWrapper from './InputWrapper'
import SliderMui from '@mui/material/Slider'
import FormControl from '@mui/material/FormControl'
import NativeSelect from '@mui/material/NativeSelect'
import isObject from '@helpers/isObject'
// import { InputLabel } from '@mui/material'

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
  copyPasteButtons = false,
  wrapperClassName,
  min = 0,
  max = 100,
  required,
  noInputs = false,
}) => (
  <InputWrapper
    label={label}
    labelClassName={labelClassName}
    onChange={onChange}
    copyPasteButtons={copyPasteButtons}
    value={value}
    className={cn('flex-1', wrapperClassName)}
    required={required}
  >
    {/* <div
        className={cn(
          'flex rounded overflow-hidden bg-white',
          error ? 'border-red-500' : 'border-gray-400',
          inputClassName ? inputClassName : 'w-full',
          noBorder ? '' : 'border'
        )}
      > */}
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

      {/* {!noInputs && (
          <input
            className={cn('outline-none px-1 w-12 bg-transparent')}
            type="number"
            value={isObject(value) ? value[0] : value}
            onChange={(e) => {
              const newValue = e.target.value
              if (
                (typeof min !== 'number' || newValue >= min) &&
                (typeof max !== 'number' || newValue <= max)
              )
                onChange(
                  isObject(value) ? [newValue, value[1]] : newValue
                )
            }}
          />
        )} */}
      <SliderMui
        // getAriaLabel={() => 'Temperature range'}
        value={value}
        onChange={(e, value) => onChange && onChange(value)}
        // valueLabelDisplay="auto"
        min={min}
        max={max}
        // color="#ffffff"
        // getAriaValueText={valuetext}
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
    {/* <input
          className={cn(
            'outline-none px-1 flex-1 min-w-10',
            disabled
              ? 'cursor-not-allowed bg-gray-200 text-gray-200'
              : 'bg-transparent'
          )}
          type={type}
          value={value ?? ''}
          onChange={(e) => {
            const { value } = e.target
            if (type === 'number') {
              if (
                (typeof min !== 'number' || value >= min) &&
                (typeof max !== 'number' || value <= max)
              )
                onChange(value)
            } else {
              onChange(value)
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
        /> */}
    {/* </div> */}
  </InputWrapper>
)

export default Slider
