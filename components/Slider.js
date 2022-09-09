import cn from 'classnames'
import InputWrapper from './InputWrapper'
import SliderMui from '@mui/material/Slider'

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
}) => {
  return (
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
      <div className="flex flex-1 px-3 w-max min-w-40 gap-x-4">
        {!noInputs && (
          <input
            className={cn('outline-none px-1 w-12 bg-transparent')}
            type="number"
            value={typeof value === 'object' ? value[0] : value}
            onChange={(e) => {
              const newValue = e.target.value
              if (
                (typeof min !== 'number' || newValue >= min) &&
                (typeof max !== 'number' || newValue <= max)
              )
                onChange(
                  typeof value === 'object' ? [newValue, value[1]] : newValue
                )
            }}
          />
        )}
        <SliderMui
          // getAriaLabel={() => 'Temperature range'}
          value={value}
          onChange={(e, value) => onChange && onChange(value)}
          valueLabelDisplay="auto"
          min={min}
          max={max}
          // color="#ffffff"
          // getAriaValueText={valuetext}
        />
        {!noInputs && (
          <input
            className={cn('outline-none px-1 w-12 bg-transparent')}
            type="number"
            value={typeof value === 'object' ? value[1] : value}
            onChange={(e) => {
              const newValue = e.target.value
              if (
                (typeof min !== 'number' || newValue >= min) &&
                (typeof max !== 'number' || newValue <= max)
              )
                onChange(
                  typeof value === 'object' ? [value[0], newValue] : newValue
                )
            }}
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
}

export default Slider
