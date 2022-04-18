import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ListItem = ({ children }) => (
  <li className="flex items-center gap-x-2">
    <FontAwesomeIcon
      className="w-5 h-5 text-general min-w-5 min-h-5 tablet:min-h-6 tablet:min-w-6 tablet:h-6 tablet:w-6"
      icon={faCheckCircle}
    />
    {children}
  </li>
)

export default ListItem
