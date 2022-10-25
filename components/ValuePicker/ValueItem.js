import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'

const ValueItem = ({
  active = false,
  value = 0,
  name = '',
  color = 'gray',
  icon = null,
  onClick = null,
  hoverable,
  className,
}) => (
  <button
    className={cn(
      `h-[30px] flex min-w-22 duration-300 outline-none items-center justify-center border px-2 py-0.5 rounded cursor-pointer gap-x-2 flex-nowrap border-${color} group`,
      active ? `text-white bg-${color}` : `text-${color} bg-white`,
      hoverable ? `hover:text-white hover:bg-${color}` : '',
      className
    )}
    onClick={() => onClick && onClick(value)}
  >
    {icon && <FontAwesomeIcon icon={icon} className="h-5" />}
    <div
      className={cn(
        'whitespace-nowrap duration-300 select-none',
        active ? 'text-white' : `text-input`,
        hoverable ? `group-hover:text-white` : ''
      )}
    >
      {name}
    </div>
  </button>
)

export default ValueItem
