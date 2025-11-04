import cn from 'classnames'
import Chip from './Chip'

const ChipsLine = ({ value, items, className, onChipClick, noWrap }) => {
  return (
    <div
      className={cn(
        'flex gap-x-1 gap-y-1 h-6 tablet:h-7 overflow-hidden',
        noWrap ? '' : 'flex-wrap',
        className
      )}
    >
      {typeof value === 'object' &&
        value
          .filter((text) => text)
          .map((text) => (
            <Chip
              key={'chip' + text}
              text={text}
              color={items.find((item) => item.text === text)?.color}
              onClick={onChipClick ? () => onChipClick(text) : undefined}
            />
          ))}
    </div>
  )
}

export default ChipsLine
