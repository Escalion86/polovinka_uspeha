import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tooltip from '@components/Tooltip'
import cn from 'classnames'

const CardButton = ({ active, icon, onClick, color = 'red', tooltipText }) => (
  <Tooltip title={tooltipText}>
    <div
      className={cn(
        `cursor-pointer text-base font-normal duration-300 flex border items-center justify-center w-8 h-8 hover:bg-${color}-600 border-${color}-500 hover:border-${color}-600 hover:text-white`,
        active ? `bg-${color}-500 text-white` : `bg-white text-${color}-500`
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
