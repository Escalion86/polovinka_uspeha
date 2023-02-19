import cn from 'classnames'
import InputWrapper from './InputWrapper'

const CheckBox = ({
  checked = false,
  onClick = null,
  onChange = null,
  small = false,
  label = null,
  labelPos = 'right',
  labelClassName,
  name,
  readOnly = false,
  hidden = false,
  wrapperClassName,
  error,
}) => {
  if (readOnly && !checked) return null

  return (
    <InputWrapper
      labelPos={labelPos}
      label={label}
      labelClassName={labelClassName}
      wrapperClassName={wrapperClassName}
      hidden={hidden}
    >
      {(!readOnly || checked) && (
        // <div className="flex items-center">
        <input
          readOnly
          checked={checked}
          type="checkbox"
          className={cn(
            readOnly ? 'bg-gray-500' : 'checked:bg-general cursor-pointer',
            'bg-white border appearance-none from-blue-900 bg-check checked:border-transparent focus:outline-none',
            small
              ? 'min-w-4 min-h-4 w-4 h-4 rounded-sm'
              : 'min-w-5 min-h-5 w-5 h-5 rounded-md',
            error ? 'border-danger' : ' border-gray-400'
          )}
          onClick={!readOnly ? onClick : null}
          onChange={!readOnly ? onChange : null}
          name={name}
        />
        // </div>
      )}
    </InputWrapper>
  )
}

export default CheckBox
