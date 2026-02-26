import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import windowDimensionsTailwindSelector from '@state/selectors/windowDimensionsTailwindSelector'
import cn from 'classnames'
import { useAtomValue } from 'jotai'
import CardButton from './CardButton'
import DropDown from './DropDown'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV'
import { getCardButtonPalette } from './cardButtonsPalette'

const MenuItem = ({
  active,
  icon,
  onClick,
  color = 'red',
  tooltipText,
  disabled,
}) => {
  const palette = getCardButtonPalette(color)

  return (
    <div
      className={cn(
        'group flex h-10 items-center gap-x-2 px-3 text-sm font-medium transition-colors duration-200',
        disabled
          ? 'cursor-not-allowed bg-white text-[#bbaab1] pointer-events-none'
          : 'cursor-pointer bg-white',
        active
          ? 'bg-[#6b1f2a] text-white'
          : `${palette.text} ${palette.hover}`,
        'border-b border-[#f1e4e9] last:border-b-0'
      )}
      onClick={() => {
        if (disabled) return
        onClick && onClick()
      }}
    >
      <FontAwesomeIcon
        icon={icon}
        className={cn(
          'w-5 h-5 min-h-5 transition-colors duration-200',
          active ? 'text-white' : palette.text,
          !disabled && !active && 'group-hover:text-white'
        )}
      />
      <div className="whitespace-nowrap prevent-select-text">{tooltipText}</div>
    </div>
  )
}

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
              'flex flex-col items-center justify-center cursor-pointer w-9 h-9 text-[#6b1f2a] rounded-full bg-white/95 border border-[#f0e2e8] shadow-[0_6px_16px_rgba(0,0,0,0.08)] hover:bg-[#6b1f2a] hover:text-white transition-colors duration-200',
              triggerClassName
            )}
          >
            <FontAwesomeIcon icon={faEllipsisV} className="w-5 h-5 min-h-5" />
          </div>
        }
        className={className}
        openOnHover
      >
        <div className="overflow-hidden rounded-2xl border border-[#f0e2e8] bg-white shadow-[0_14px_30px_rgba(0,0,0,0.14)]">
          {items}
        </div>
      </DropDown>
    </div>
  ) : (
    <div
      className={cn(
        'inline-flex items-center gap-x-0.5 rounded-full border border-[#f0e2e8] bg-white/95 px-1 py-1 shadow-[0_6px_16px_rgba(0,0,0,0.08)]',
        className
      )}
    >
      {items}
    </div>
  )
}

export default CardButtonsView
