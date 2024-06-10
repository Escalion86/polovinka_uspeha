import { faCheckCircle } from '@fortawesome/free-regular-svg-icons/faCheckCircle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'

const ListItem = ({ children, className }) => (
  <li className={cn('flex items-center gap-x-2', className)}>
    <FontAwesomeIcon
      className="w-5 h-5 text-general min-w-5 min-h-5 tablet:min-h-6 tablet:min-w-6 tablet:h-6 tablet:w-6"
      icon={faCheckCircle}
    />
    {children}
  </li>
)

export default ListItem
