import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tooltip from '@components/Tooltip'
import cn from 'classnames'

const CardButton = ({
  active,
  icon,
  onClick,
  color = 'red',
  tooltipText,
  paddingY = true,
}) => (
  <Tooltip title={tooltipText}>
    <div
      className={cn(
        `cursor-pointer text-base font-normal duration-200 flex items-center justify-center w-9`,
        // `text-${color}-500`
        paddingY ? 'h-9' : '',
        active ? `bg-${color}-500 text-white` : `text-${color}-500`,
        `rounded-full hover:text-toxic hover:scale-110`
        // `rounded-full hover:bg-${color}-600 hover:text-white`
        // `border border-${color}-500 hover:border-${color}-600 hover:bg-${color}-600 hover:text-white`
      )}
      onClick={(e) => {
        e.stopPropagation()
        onClick && onClick()
      }}
    >
      <FontAwesomeIcon icon={icon} className="w-6 h-6" />
    </div>
  </Tooltip>
)

export default CardButton
