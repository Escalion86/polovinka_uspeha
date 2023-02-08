import cn from 'classnames'
import React from 'react'

const Label = ({
  className,
  text,
  required,
  htmlFor,
  contentWidth,
  textPos,
}) => {
  if (!text) return null
  return (
    <label
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
      htmlFor={htmlFor}
    >
      <span className="flex">
        <span className={cn('flex-1', textPos === 'right' ? '' : 'text-right')}>
          {text}
        </span>
        {required && <span className="text-red-700">*</span>}
      </span>
    </label>
  )
}

export default Label
