import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tooltip from './Tooltip'
import cn from 'classnames'
import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from '@material-tailwind/react'

const CardButton = ({
  active,
  icon,
  onClick,
  color = 'red',
  dataTip,
  popoverText,
}) => (
  <Tooltip content={dataTip}>
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
      <Popover>
        <PopoverHandler>
          <FontAwesomeIcon icon={icon} className="w-6 h-6" />
        </PopoverHandler>
        {popoverText && (
          <PopoverContent className="z-50">{popoverText}</PopoverContent>
        )}
      </Popover>
    </div>
  </Tooltip>
)

export default CardButton
