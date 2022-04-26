import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'

const colors = [
  'border-blue-400',
  'border-red-400',
  'border-yellow-400',
  'border-green-400',
  'border-purple-400',
  'text-red-400',
  'text-blue-400',
  'text-yellow-400',
  'text-green-400',
  'text-purple-400',
  'bg-blue-400',
  'bg-red-400',
  'bg-yellow-400',
  'bg-green-400',
  'bg-purple-400',
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
      `flex min-w-22 duration-300 outline-none items-center justify-center border px-2 py-0.5 rounded-lg cursor-pointer gap-x-2 flex-nowrap`,
      `border-${color}`,
      active ? `text-white bg-${color}` : `text-${color} bg-white`
    )}
    onClick={() => onClick(value)}
  >
    {icon && <FontAwesomeIcon icon={icon} className="h-6" />}
    <div
      className={cn(
        'whitespace-nowrap duration-300 select-none',
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
  name = 'prop',
  required = false,
  disselectOnSameClick = true,
}) => {
  return (
    <>
      {label && (
        <label
          className="flex items-center justify-end text-right"
          htmlFor={name}
        >
          {label}
          {required && <span className="text-red-700">*</span>}
        </label>
      )}
      <div className="flex flex-wrap gap-x-2 gap-y-1">
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
    </>
  )
}

export default ValuePicker
