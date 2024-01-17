import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'

const Chip = ({ text, color, onClose, onClick }) => (
  <div
    className={cn(
      'flex items-center h-[24px] tablet:h-[28px] tablet:py-0.5 tablet:pl-3 pl-2 pr-1 rounded-full',
      onClick ? 'cursor-pointer' : 'cursor-default'
    )}
    style={{ backgroundColor: color }}
    onClick={(e) => {
      if (onClick) {
        e.stopPropagation()
        onClick()
      }
    }}
  >
    <div className="tablet:text-[13px] text-[11px] uppercase select-none pr-1 tablet:pr-2 text-gray-700">
      {text}
    </div>
    {onClose && (
      <div
        onClick={(e) => {
          if (onClose) {
            e.stopPropagation()
            onClose()
          }
        }}
        className="flex items-center justify-center p-0.5 bg-white rounded-full cursor-pointer group"
      >
        <FontAwesomeIcon
          icon={faTimes}
          style={{ color: color }}
          className="w-3 h-3 tablet:w-4 tablet:h-4 duration-300 group-hover:scale-125"
        />
      </div>
    )}
  </div>
)

export default Chip
