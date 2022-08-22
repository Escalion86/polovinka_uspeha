import cn from 'classnames'
import React from 'react'

const Label = ({ className, text, required, htmlFor }) => {
  return (
    <label
      className={cn(
        'flex items-start tablet:justify-end text-text leading-4 pt-1 text-right',
        className
      )}
      htmlFor={htmlFor}
    >
      {text}
      {required && <span className="text-red-700">*</span>}
    </label>
  )
}

export default Label
