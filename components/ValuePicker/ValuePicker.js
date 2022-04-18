import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'

const colors = [
  'border-blue-400',
  'border-red-400',
  'border-yellow-400',
  'border-green-400',
  'text-red-400',
  'text-blue-400',
  'text-yellow-400',
  'text-green-400',
  'bg-blue-400',
  'bg-red-400',
  'bg-yellow-400',
  'bg-green-400',
]

const ValueItem = ({
  active = false,
  value = 0,
  name = '',
  color = 'gray',
  icon = null,
  onClick = null,
}) => (
  <button
    className={cn(
      `flex min-w-22 duration-300 outline-none items-center justify-center border px-2 py-1 rounded-lg cursor-pointer gap-x-2 flex-nowrap`,
      `border-${color}`,
      active ? `text-white bg-${color}` : `text-${color} bg-white`
    )}
    onClick={() => onClick(value)}
  >
    {icon && <FontAwesomeIcon icon={icon} size="lg" />}
    <div
      className={cn(
        'whitespace-nowrap duration-300 text-sm select-none',
        active ? 'text-white' : `text-input`
      )}
    >
      {name}
    </div>
  </button>
)

const ValuePicker = ({
  value = null,
  valuesArray = [],
  label = null,
  onChange = null,
  inLine = false,
  className = null,
  labelStyle = null,
  name = 'prop',
  required = false,
  readOnly = false,
  disselectOnSameClick = true,
}) => {
  if (readOnly) {
    if (!value && value !== 0) return null
    const itemInArray = valuesArray.find((item) => item.value === value)
    return (
      <div className={cn('flex gap-x-1 flex-row', className)}>
        {label && (
          <div>
            <label
              className={cn(
                'border-b-1 border-primary max-w-min whitespace-nowrap',
                labelStyle
              )}
              htmlFor={name}
            >
              {label}:
            </label>
          </div>
        )}
        <div className="ml-2 italic">
          {itemInArray ? itemInArray.name : '-'}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex',
        inLine ? ' flex-row items-center' : ' flex-col',
        className
      )}
    >
      {label && (
        <label
          className={cn(labelStyle, {
            'min-w-24 max-w-40 w-1/4': inLine && !labelStyle,
          })}
          htmlFor={name}
        >
          {label}
          {required && <span className="text-red-700">*</span>}
        </label>
      )}
      <div className="flex flex-wrap py-1 gap-x-2 gap-y-1">
        {valuesArray.map((item) => (
          <ValueItem
            key={name + item.value}
            active={item.value === value}
            value={item.value}
            name={item.name}
            icon={item.icon}
            color={item.color}
            onClick={() =>
              item.value === value
                ? disselectOnSameClick && onChange(null)
                : onChange(item.value)
            }
          />
        ))}
      </div>
    </div>
  )
}

export default ValuePicker
