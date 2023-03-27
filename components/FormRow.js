import cn from 'classnames'
import React from 'react'

const FormRow = ({ children, className }) => {
  return (
    <div
      className={cn('flex flex-1 gap-x-2 items-center mt-3 mb-1', className)}
    >
      {children}
    </div>
  )
}

export default FormRow
