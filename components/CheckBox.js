import cn from 'classnames'
import InputWrapper from './InputWrapper'
import Label from './Label'

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
            'bg-white border border-gray-400 appearance-none from-blue-900 bg-check checked:border-transparent focus:outline-none',
            small ? 'w-4 h-4 rounded-sm' : 'w-5 h-5 rounded-md'
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
