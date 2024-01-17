import cn from 'classnames'

const Label = ({ className, text, required, contentWidth, textPos }) => {
  if (!text) return null
  return (
    <div
      className={cn(
        'flex text-text leading-[0.875rem]',
        contentWidth ? '' : 'min-w-label',
        textPos
          ? textPos === 'right' || textPos === 'bottom'
            ? 'laptop:justify-end'
            : 'justify-start'
          : 'laptop:justify-end',
        className
      )}
    >
      <span className="flex">
        <span className={cn('flex-1', textPos === 'right' ? '' : 'text-right')}>
          {text}
        </span>
        {required && <span className="text-red-700">*</span>}
      </span>
    </div>
  )
}

export default Label
