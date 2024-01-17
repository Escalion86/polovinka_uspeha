import Tooltip from '@components/Tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'

const IconWithTooltip = ({ className, icon, tooltip }) => (
  <Tooltip title={tooltip}>
    <div className={cn('flex items-center justify-center w-5', className)}>
      <FontAwesomeIcon icon={icon} className="w-5" />
    </div>
  </Tooltip>
)

export default IconWithTooltip
