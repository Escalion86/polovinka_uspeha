import cn from 'classnames'
import React from 'react'

const Label = ({ className, text, required, htmlFor }) => {
  return (
    <label
      className={cn(
        'flex items-start tablet:justify-end text-text leading-[0.875rem] mt-1 tablet:mt-0 tablet:py-1 tablet:text-right',
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
