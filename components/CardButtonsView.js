import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import windowDimensionsTailwindSelector from '@state/selectors/windowDimensionsTailwindSelector'
import cn from 'classnames'
import { useAtomValue } from 'jotai'
import CardButton from './CardButton'
import DropDown from './DropDown'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV'

const MenuItem = ({
  active,
  icon,
  onClick,
  color = 'red',
  tooltipText,
  disabled,
}) => (
  <div
    className={cn(
      `cursor-pointer text-base font-normal px-2 duration-300 flex items-center gap-x-2 h-9 hover:bg-${color}-600 hover:text-white`,
      active
        ? `bg-${color}-500 text-white`
        : `bg-white text-${color}-500 ${
            disabled ? 'pointer-events-none opacity-60' : ''
          }`
    )}
    onClick={() => {
      if (disabled) return
      onClick && onClick()
    }}
  >
    <FontAwesomeIcon icon={icon} className="w-7 h-7 min-h-7" />
    <div className="whitespace-nowrap prevent-select-text">{tooltipText}</div>
  </div>
)

const CardButtonsView = ({
  buttons,
  className,
  alwaysCompact,
  alwaysCompactOnPhone,
  triggerClassName = '',
  compactThreshold = 3,
}) => {
  const device = useAtomValue(windowDimensionsTailwindSelector)
  const safeButtons = Array.isArray(buttons) ? buttons.filter(Boolean) : []
  if (safeButtons.length === 0) return null

  const isCompact =
    alwaysCompact ||
    ((safeButtons.length > compactThreshold || alwaysCompactOnPhone) &&
      ['phoneV', 'phoneH', 'tablet'].includes(device))

  const ItemComponent = isCompact ? MenuItem : CardButton
  const items = safeButtons.map(
    (
      {
        key: customKey,
        icon,
        onClick,
        color = 'red',
        tooltipText,
        active,
        disabled,
      },
      index
    ) => (
      <ItemComponent
        key={customKey || `custom-${index}`}
        icon={icon}
        onClick={() => {
          if (disabled) return
          onClick && onClick()
        }}
        color={color}
        tooltipText={tooltipText}
        active={active}
        disabled={disabled}
      />
    )
  )

  return isCompact ? (
    <div onClick={(e) => e.stopPropagation()}>
      <DropDown
        trigger={
          <div
            className={cn(
              'flex flex-col items-center justify-center cursor-pointer w-9 h-9 text-general',
              triggerClassName
            )}
          >
            <FontAwesomeIcon icon={faEllipsisV} className="w-7 h-7 min-h-7" />
          </div>
        }
        className={className}
        openOnHover
      >
        <div className="overflow-hidden rounded-lg">{items}</div>
      </DropDown>
    </div>
  ) : (
    <div className={cn('flex', className)}>{items}</div>
  )
}

export default CardButtonsView
