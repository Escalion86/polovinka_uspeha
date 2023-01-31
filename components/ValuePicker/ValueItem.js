import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'
import Image from 'next/image'

const ValueItem = ({
  active = false,
  value = 0,
  name = '',
  color = 'gray',
  icon = null,
  imageSrc = null,
  onClick = null,
  hoverable,
  className,
}) => (
  <button
    className={cn(
      `h-[30px] flex min-w-22 duration-300 outline-none items-center justify-center border px-2 py-0.5 rounded gap-x-2 flex-nowrap border-${color} group`,
      active
        ? `text-white bg-${color}`
        : onClick
        ? `text-${color} bg-white`
        : `text-gray-500 bg-gray-200`,
      onClick ? 'cursor-pointer' : 'cursor-not-allowed',
      hoverable ? `hover:text-white hover:bg-${color}` : '',
      className
    )}
    onClick={onClick ? () => onClick(value) : null}
  >
    {icon && <FontAwesomeIcon icon={icon} className="h-5" />}
    {imageSrc && (
      <div className="w-5 h-5">
        <Image src={imageSrc} width="20" height="20" />
      </div>
    )}
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
