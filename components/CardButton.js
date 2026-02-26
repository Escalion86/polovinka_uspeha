import Tooltip from '@components/Tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'
import { getCardButtonPalette } from './cardButtonsPalette'

const CardButton = ({
  active,
  icon,
  onClick,
  color = 'red',
  tooltipText,
  paddingY = true,
  disabled,
}) => {
  const palette = getCardButtonPalette(color)

  return (
    <Tooltip title={tooltipText}>
      <div
        className={cn(
          'text-base font-normal duration-200 flex items-center justify-center w-9 rounded-full transition-colors',
          paddingY ? 'h-9' : '',
          disabled
            ? 'cursor-not-allowed text-[#bbaab1] opacity-60'
            : 'cursor-pointer',
          active ? palette.active : palette.text,
          !disabled && !active && palette.hover
        )}
        onClick={(e) => {
          e.stopPropagation()
          if (disabled) return
          onClick && onClick()
        }}
      >
        <FontAwesomeIcon icon={icon} className="w-5 h-5 min-h-5" />
      </div>
    </Tooltip>
  )
}

export default CardButton
