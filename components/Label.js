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
        'flex items-start text-text leading-[0.875rem]',
        contentWidth ? '' : 'min-w-[14vw]',
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
        <span className="flex-1 text-right">{text}</span>
        {required && <span className="text-red-700">*</span>}
      </span>
    </label>
  )
}

export default Label
