import Tooltip from '@components/Tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
        paddingY ? 'h-9' : '',
        active ? `bg-${color}-500 text-white` : `text-${color}-500`,
        `rounded-full hover:text-toxic hover:scale-110`
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
