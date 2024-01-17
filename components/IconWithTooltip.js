import Tooltip from '@components/Tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'

const IconWithTooltip = ({ className, icon, tooltip, size = 'md' }) => (
  <Tooltip title={tooltip}>
    <div
      className={cn(
        'flex items-center justify-center',
        size === 'md' ? 'w-5' : 'w-4',
        className
      )}
    >
      <FontAwesomeIcon icon={icon} className="w-5" />
    </div>
  </Tooltip>
)

export default IconWithTooltip
